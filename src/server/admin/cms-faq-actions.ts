"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { AdminPermissionKey } from "@/lib/admin/permissions";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import type { Database, Json } from "@/lib/supabase/types";
import { writeAdminAuditEvent, type AdminAuditAction } from "@/server/admin/audit-log";
import { isValidUuid, type CmsStatus } from "@/server/admin/cms-content";
import { requireAdminPermission, type CurrentAdminContext } from "@/server/admin/permissions";

type ActionState = { ok: boolean; message: string };
type CmsEntryRow = Database["public"]["Tables"]["cms_content_entries"]["Row"];
type CmsRevisionRow = Database["public"]["Tables"]["cms_content_revisions"]["Row"];
type CmsRevisionInsert = Database["public"]["Tables"]["cms_content_revisions"]["Insert"];
type JsonRecord = Record<string, Json>;

type FaqBody = { answer: string; category: string | null; display_order: number; tags: string[]; is_featured: boolean };

type FaqPayload = {
  contentKey: string;
  slug: string | null;
  questionEn: string | null;
  questionAr: string | null;
  answerEn: string;
  answerAr: string;
  category: string | null;
  displayOrder: number;
  tags: string[];
  isFeatured: boolean;
  internalNote: string | null;
  faqGroup: string | null;
  reviewNote: string | null;
};

const transition: Record<CmsStatus, CmsStatus[]> = {
  draft: ["in_review", "archived"],
  in_review: ["approved", "rejected"],
  approved: ["archived"],
  rejected: ["draft"],
  published: [],
  archived: ["draft"],
};

function readText(formData: FormData, key: string, limit: number, required = false): string | null {
  const value = String(formData.get(key) ?? "").trim();
  if (!value) {
    if (required) throw new Error(`${key} is required.`);
    return null;
  }
  if (value.length > limit) throw new Error(`${key} is too long.`);
  return value;
}

function readDisplayOrder(formData: FormData): number {
  const value = Number.parseInt(String(formData.get("displayOrder") ?? "0"), 10);
  if (!Number.isInteger(value) || value < 0 || value > 10000) throw new Error("display_order must be between 0 and 10000.");
  return value;
}

function readTags(formData: FormData): string[] {
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  if (tags.length > 10) throw new Error("tags can include at most 10 items.");
  for (const tag of tags) if (tag.length > 40) throw new Error("Each tag must be 40 characters or fewer.");
  return tags;
}

function safeSlug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120);
}

function readFaqPayload(formData: FormData, includeKey: boolean): FaqPayload {
  const rawKey = includeKey ? readText(formData, "contentKey", 160, true)! : "faq.existing";
  const contentKey = rawKey.startsWith("faq.") ? rawKey : `faq.${safeSlug(rawKey)}`;
  const questionEn = readText(formData, "questionEn", 220);
  const questionAr = readText(formData, "questionAr", 220);
  if (!questionEn && !questionAr) throw new Error("At least one FAQ question is required.");
  return {
    contentKey,
    slug: readText(formData, "slug", 160),
    questionEn,
    questionAr,
    answerEn: readText(formData, "answerEn", 2000) ?? "",
    answerAr: readText(formData, "answerAr", 2000) ?? "",
    category: readText(formData, "category", 120),
    displayOrder: readDisplayOrder(formData),
    tags: readTags(formData),
    isFeatured: formData.get("isFeatured") === "on",
    internalNote: readText(formData, "internalNote", 1000),
    faqGroup: readText(formData, "faqGroup", 120),
    reviewNote: readText(formData, "reviewNote", 1000),
  };
}

function body(payload: FaqPayload, answer: string): FaqBody {
  return { answer, category: payload.category, display_order: payload.displayOrder, tags: payload.tags, is_featured: payload.isFeatured };
}

function metadata(payload: FaqPayload): JsonRecord {
  return { faq_group: payload.faqGroup, internal_note: payload.internalNote };
}

function auditValues(entry: CmsEntryRow, revision?: CmsRevisionRow | null): JsonRecord {
  const bodyEn = revision?.body_en && typeof revision.body_en === "object" && !Array.isArray(revision.body_en) ? revision.body_en as JsonRecord : {};
  return {
    content_key: entry.content_key,
    content_type: entry.content_type,
    locale: entry.locale,
    status: revision?.status ?? entry.status,
    revision_number: revision?.revision_number ?? null,
    title: revision?.title_en ?? revision?.title_ar ?? entry.title_en ?? entry.title_ar,
    category: typeof bodyEn.category === "string" ? bodyEn.category : null,
    display_order: typeof bodyEn.display_order === "number" ? bodyEn.display_order : null,
    is_featured: typeof bodyEn.is_featured === "boolean" ? bodyEn.is_featured : null,
  };
}

async function audit(admin: CurrentAdminContext, permissionKey: AdminPermissionKey, action: AdminAuditAction, entry: CmsEntryRow, revision: CmsRevisionRow | null, summary: string) {
  await writeAdminAuditEvent({ admin, permissionKey, action, entityType: action.includes("revision") || action.includes("submitted") ? "cms_content_revision" : "cms_content_entry", entityId: revision?.id ?? entry.id, targetTable: revision ? "cms_content_revisions" : "cms_content_entries", summary, newValues: auditValues(entry, revision) });
}

async function readFaqEntry(entryId: string): Promise<CmsEntryRow> {
  if (!isValidUuid(entryId)) throw new Error("Invalid FAQ entry.");
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase.from("cms_content_entries").select("*").eq("id", entryId).eq("content_type", "faq").is("deleted_at", null).maybeSingle();
  if (error || !data) throw new Error("FAQ CMS entry could not be loaded.");
  return data;
}

async function readCurrentRevision(entry: CmsEntryRow): Promise<CmsRevisionRow> {
  if (!entry.current_revision_id) throw new Error("FAQ revision could not be loaded.");
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase.from("cms_content_revisions").select("*").eq("id", entry.current_revision_id).eq("entry_id", entry.id).maybeSingle();
  if (error || !data) throw new Error("FAQ revision could not be loaded.");
  return data;
}

function nextStatus(current: string, target: CmsStatus) {
  if (!transition[current as CmsStatus]?.includes(target)) throw new Error("FAQ status transition is not allowed.");
}

export async function createAdminFaqCmsDraft(_prev: ActionState, formData: FormData): Promise<ActionState> {
  let entryId = "";
  try {
    const admin = await requireAdminPermission("content.create");
    const payload = readFaqPayload(formData, true);
    const supabase = createSupabaseServiceRoleClient();
    const { data: entry, error: entryError } = await supabase.from("cms_content_entries").insert({ content_key: payload.contentKey, content_type: "faq", locale: null, country: "om", title_en: payload.questionEn, title_ar: payload.questionAr, slug: payload.slug, metadata: metadata(payload), status: "draft", created_by_profile_id: admin.profile.id, updated_by_profile_id: admin.profile.id }).select("*").single();
    if (entryError) throw new Error("FAQ CMS entry could not be created.");
    const revisionInput: CmsRevisionInsert = { entry_id: entry.id, created_by_profile_id: admin.profile.id, revision_number: 1, status: "draft", title_en: payload.questionEn, title_ar: payload.questionAr, summary_en: null, summary_ar: null, body_en: body(payload, payload.answerEn) as unknown as Json, body_ar: body(payload, payload.answerAr) as unknown as Json, metadata: metadata(payload), review_note: payload.reviewNote };
    const { data: revision, error: revisionError } = await supabase.from("cms_content_revisions").insert(revisionInput).select("*").single();
    if (revisionError) throw new Error("FAQ CMS revision could not be created.");
    await supabase.from("cms_content_entries").update({ current_revision_id: revision.id }).eq("id", entry.id);
    entryId = entry.id;
    await audit(admin, "content.create", "cms_content.entry_created", entry, null, "FAQ CMS entry created as an internal draft.");
    await audit(admin, "content.create", "cms_content.revision_created", entry, revision, "Initial FAQ CMS revision created.");
  } catch (error) { return { ok: false, message: error instanceof Error ? error.message : "FAQ CMS draft could not be created." }; }
  revalidatePath("/admin/content/faqs");
  redirect(`/admin/content/faqs/${entryId}`);
}

export async function updateAdminFaqCmsDraft(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const admin = await requireAdminPermission("content.update");
    const entry = await readFaqEntry(String(formData.get("entryId") ?? ""));
    if (!["draft", "rejected"].includes(entry.status)) throw new Error("Only draft or rejected FAQ entries can be edited.");
    const payload = readFaqPayload(formData, false);
    const revision = await readCurrentRevision(entry);
    const supabase = createSupabaseServiceRoleClient();
    const { data: updatedRevision, error: revisionError } = await supabase.from("cms_content_revisions").update({ status: "draft", title_en: payload.questionEn, title_ar: payload.questionAr, body_en: body(payload, payload.answerEn) as unknown as Json, body_ar: body(payload, payload.answerAr) as unknown as Json, metadata: metadata(payload), review_note: payload.reviewNote }).eq("id", revision.id).select("*").single();
    if (revisionError) throw new Error("FAQ CMS revision could not be updated.");
    const { data: updatedEntry, error: entryError } = await supabase.from("cms_content_entries").update({ title_en: payload.questionEn, title_ar: payload.questionAr, slug: payload.slug, metadata: metadata(payload), status: "draft", is_archived: false, updated_by_profile_id: admin.profile.id }).eq("id", entry.id).select("*").single();
    if (entryError) throw new Error("FAQ CMS entry could not be updated.");
    await audit(admin, "content.update", "cms_content.revision_updated", updatedEntry, updatedRevision, "FAQ CMS draft revision updated.");
    await audit(admin, "content.update", "cms_content.entry_updated", updatedEntry, null, "FAQ CMS entry updated.");
    revalidatePath(`/admin/content/faqs/${entry.id}`);
    return { ok: true, message: "FAQ draft saved." };
  } catch (error) { return { ok: false, message: error instanceof Error ? error.message : "FAQ CMS draft could not be saved." }; }
}

async function workflow(entryId: string, target: CmsStatus, permission: AdminPermissionKey, action: AdminAuditAction, summary: string) {
  const admin = await requireAdminPermission(permission);
  const entry = await readFaqEntry(entryId);
  const revision = await readCurrentRevision(entry);
  nextStatus(revision.status, target);
  const supabase = createSupabaseServiceRoleClient();
  const patch = target === "approved" ? { status: target, approved_at: new Date().toISOString(), approved_by_profile_id: admin.profile.id } : target === "rejected" ? { status: target, rejected_at: new Date().toISOString(), rejected_by_profile_id: admin.profile.id } : { status: target };
  const { data: updatedRevision, error: revisionError } = await supabase.from("cms_content_revisions").update(patch).eq("id", revision.id).select("*").single();
  if (revisionError) throw new Error("FAQ CMS revision workflow could not be updated.");
  const { data: updatedEntry, error: entryError } = await supabase.from("cms_content_entries").update({ status: target, updated_by_profile_id: admin.profile.id }).eq("id", entry.id).select("*").single();
  if (entryError) throw new Error("FAQ CMS entry workflow could not be updated.");
  await audit(admin, permission, action, updatedEntry, updatedRevision, summary);
  revalidatePath(`/admin/content/faqs/${entry.id}`);
}

export async function submitAdminFaqRevisionForReview(formData: FormData) { await workflow(String(formData.get("entryId") ?? ""), "in_review", "content.submit_review", "cms_content.submitted_for_review", "FAQ CMS revision submitted for review."); }
export async function approveAdminFaqRevision(formData: FormData) { await workflow(String(formData.get("entryId") ?? ""), "approved", "content.approve", "cms_content.revision_approved", "FAQ CMS revision approved internally."); }
export async function rejectAdminFaqRevision(formData: FormData) { await workflow(String(formData.get("entryId") ?? ""), "rejected", "content.reject", "cms_content.revision_rejected", "FAQ CMS revision rejected internally."); }

export async function archiveAdminFaqEntry(formData: FormData) {
  const admin = await requireAdminPermission("content.archive");
  const entry = await readFaqEntry(String(formData.get("entryId") ?? ""));
  nextStatus(entry.status, "archived");
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase.from("cms_content_entries").update({ status: "archived", is_archived: true, updated_by_profile_id: admin.profile.id }).eq("id", entry.id).select("*").single();
  if (error) throw new Error("FAQ CMS entry could not be archived.");
  await audit(admin, "content.archive", "cms_content.entry_archived", data, null, "FAQ CMS entry archived internally.");
  revalidatePath(`/admin/content/faqs/${entry.id}`);
}

export async function restoreAdminFaqEntry(formData: FormData) {
  const admin = await requireAdminPermission("content.archive");
  const entry = await readFaqEntry(String(formData.get("entryId") ?? ""));
  nextStatus(entry.status, "draft");
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase.from("cms_content_entries").update({ status: "draft", is_archived: false, updated_by_profile_id: admin.profile.id }).eq("id", entry.id).select("*").single();
  if (error) throw new Error("FAQ CMS entry could not be restored.");
  await audit(admin, "content.archive", "cms_content.entry_restored", data, null, "FAQ CMS entry restored internally.");
  revalidatePath(`/admin/content/faqs/${entry.id}`);
}
