import "server-only";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import type { Database, Json } from "@/lib/supabase/types";
import { requireAdminPermission } from "@/server/admin/permissions";
import { isValidUuid, type CmsStatus } from "@/server/admin/cms-content";

type CmsEntryRow = Database["public"]["Tables"]["cms_content_entries"]["Row"];
type CmsRevisionRow = Database["public"]["Tables"]["cms_content_revisions"]["Row"];
type Row = CmsEntryRow & { cms_content_revisions?: CmsRevisionRow | CmsRevisionRow[] | null };

type JsonRecord = Record<string, Json>;

export type AdminFaqCmsItem = {
  id: string; contentKey: string; status: CmsStatus; updatedAt: string; isArchived: boolean; currentRevisionId: string | null; currentRevisionNumber: number | null; questionEn: string | null; questionAr: string | null; answerEn: string; answerAr: string; category: string | null; displayOrder: number; tags: string[]; isFeatured: boolean; internalNote: string | null; faqGroup: string | null; reviewNote: string | null; slug: string | null;
};

export type AdminFaqFilters = { status?: string; category?: string; archived?: string; search?: string };

function object(value: Json): JsonRecord { return value && typeof value === "object" && !Array.isArray(value) ? value as JsonRecord : {}; }
function text(value: Json | undefined): string { return typeof value === "string" ? value : ""; }
function nullableText(value: Json | undefined): string | null { return typeof value === "string" && value ? value : null; }
function numberValue(value: Json | undefined): number { return typeof value === "number" ? value : 0; }
function boolValue(value: Json | undefined): boolean { return typeof value === "boolean" ? value : false; }
function tagsValue(value: Json | undefined): string[] { return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []; }

function current(row: Row): CmsRevisionRow | null { return Array.isArray(row.cms_content_revisions) ? row.cms_content_revisions[0] ?? null : row.cms_content_revisions ?? null; }

function map(row: Row): AdminFaqCmsItem {
  const revision = current(row);
  const bodyEn = object(revision?.body_en ?? {});
  const bodyAr = object(revision?.body_ar ?? {});
  const meta = object(revision?.metadata ?? row.metadata ?? {});
  return {
    id: row.id,
    contentKey: row.content_key,
    status: row.status as CmsStatus,
    updatedAt: row.updated_at,
    isArchived: row.is_archived,
    currentRevisionId: row.current_revision_id,
    currentRevisionNumber: revision?.revision_number ?? null,
    questionEn: revision?.title_en ?? row.title_en,
    questionAr: revision?.title_ar ?? row.title_ar,
    answerEn: text(bodyEn.answer),
    answerAr: text(bodyAr.answer),
    category: nullableText(bodyEn.category) ?? nullableText(bodyAr.category),
    displayOrder: numberValue(bodyEn.display_order),
    tags: tagsValue(bodyEn.tags),
    isFeatured: boolValue(bodyEn.is_featured),
    internalNote: nullableText(meta.internal_note),
    faqGroup: nullableText(meta.faq_group),
    reviewNote: revision?.review_note ?? null,
    slug: row.slug,
  };
}

function safe(value: string): string { return value.replaceAll("%", "\\%").replaceAll(",", " ").trim().slice(0, 160); }

export async function listAdminFaqCmsEntries(filters: AdminFaqFilters = {}): Promise<{ ok: true; items: AdminFaqCmsItem[] } | { ok: false }> {
  await requireAdminPermission("content.read");
  try {
    const supabase = createSupabaseServiceRoleClient();
    let query = supabase.from("cms_content_entries").select("*, cms_content_revisions!cms_content_entries_current_revision_id_fkey(*)").eq("content_type", "faq").is("deleted_at", null).order("updated_at", { ascending: false }).limit(100);
    if (["draft", "in_review", "approved", "rejected", "published", "archived"].includes(filters.status ?? "")) query = query.eq("status", filters.status!);
    if (filters.archived === "active") query = query.eq("is_archived", false); else if (filters.archived === "archived") query = query.eq("is_archived", true);
    const search = safe(filters.search ?? "");
    if (search) query = query.or(`content_key.ilike.%${search}%,title_en.ilike.%${search}%,title_ar.ilike.%${search}%`);
    const { data, error } = await query;
    if (error) return { ok: false };
    let items = (data ?? []).map((row) => map(row as Row));
    if (filters.category) items = items.filter((item) => item.category === filters.category);
    return { ok: true, items };
  } catch { return { ok: false }; }
}

export async function getAdminFaqCmsEntry(entryId: string): Promise<{ ok: true; item: AdminFaqCmsItem } | { ok: false }> {
  await requireAdminPermission("content.read");
  if (!isValidUuid(entryId)) return { ok: false };
  try {
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase.from("cms_content_entries").select("*, cms_content_revisions!cms_content_entries_current_revision_id_fkey(*)").eq("id", entryId).eq("content_type", "faq").is("deleted_at", null).maybeSingle();
    if (error || !data) return { ok: false };
    return { ok: true, item: map(data as Row) };
  } catch { return { ok: false }; }
}
