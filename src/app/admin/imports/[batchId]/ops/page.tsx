import { revalidatePath } from "next/cache";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { promoteNoindexImportQueueToIndexEligible } from "@/server/admin/import-index-promotion";
import { publishApprovedImportCandidatesNoindex } from "@/server/admin/import-noindex-publish";
import { applyApprovedImportRelationCandidates } from "@/server/admin/import-relation-apply";
import { generateAdminImportRelationCandidates } from "@/server/admin/import-relation-candidates";
import { reviewAdminImportRow } from "@/server/admin/import-row-review";
import { includeSitemapEligibleImportCandidates } from "@/server/admin/import-sitemap-inclusion";
import { projectAdminImportBatchRows } from "@/server/admin/import-public-projection";
import {
  detectAdminImportBatchDuplicates,
  getAdminImportBatchDetail,
  normalizeAdminImportBatchRows,
} from "@/server/admin/imports";

type PageProps = {
  params: Promise<{ batchId: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function formatLabel(value: string): string {
  return value
    .split(/[_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function statusRedirect(
  batchId: string,
  input: {
    step: string;
    ok: boolean;
    reason?: string;
    count?: number;
  },
): never {
  const params = new URLSearchParams({
    step: input.step,
    ok: input.ok ? "1" : "0",
  });
  if (input.reason) params.set("reason", input.reason);
  if (typeof input.count === "number") params.set("count", String(input.count));
  redirect(`/admin/imports/${batchId}/ops?${params.toString()}`);
}

async function normalizeAction(formData: FormData) {
  "use server";
  const batchId = formData.get("batchId");
  if (typeof batchId !== "string") return;

  const result = await normalizeAdminImportBatchRows(batchId);
  if (result.ok) {
    revalidatePath("/admin/imports");
    revalidatePath(`/admin/imports/${batchId}`);
    revalidatePath(`/admin/imports/${batchId}/ops`);
    statusRedirect(batchId, { step: "normalize", ok: true, count: result.normalizedRows });
  }
  statusRedirect(batchId, { step: "normalize", ok: false, reason: result.reason });
}

async function detectAction(formData: FormData) {
  "use server";
  const batchId = formData.get("batchId");
  if (typeof batchId !== "string") return;

  const result = await detectAdminImportBatchDuplicates(batchId);
  if (result.ok) {
    revalidatePath("/admin/imports");
    revalidatePath(`/admin/imports/${batchId}`);
    revalidatePath(`/admin/imports/${batchId}/ops`);
    statusRedirect(batchId, { step: "detect-duplicates", ok: true, count: result.candidatesCreated });
  }
  statusRedirect(batchId, { step: "detect-duplicates", ok: false, reason: result.reason });
}

async function markReadyAction(formData: FormData) {
  "use server";
  const batchId = formData.get("batchId");
  if (typeof batchId !== "string") return;

  const detail = await getAdminImportBatchDetail(batchId);
  if (!detail.ok) statusRedirect(batchId, { step: "mark-ready", ok: false, reason: detail.reason });

  const rows = detail.rawRows.filter((row) => row.row_status === "normalized");
  if (rows.length === 0) statusRedirect(batchId, { step: "mark-ready", ok: false, reason: "empty" });

  let changed = 0;
  for (const row of rows) {
    const result = await reviewAdminImportRow(row.id, "approved_for_projection");
    if (!result.ok) statusRedirect(batchId, { step: "mark-ready", ok: false, reason: result.reason, count: changed });
    changed += 1;
  }

  revalidatePath("/admin/imports");
  revalidatePath(`/admin/imports/${batchId}`);
  revalidatePath(`/admin/imports/${batchId}/ops`);
  statusRedirect(batchId, { step: "mark-ready", ok: true, count: changed });
}

async function projectAction(formData: FormData) {
  "use server";
  const batchId = formData.get("batchId");
  if (typeof batchId !== "string") return;

  const result = await projectAdminImportBatchRows(batchId);
  if (result.ok) {
    revalidatePath("/admin/imports");
    revalidatePath(`/admin/imports/${batchId}`);
    revalidatePath(`/admin/imports/${batchId}/ops`);
    statusRedirect(batchId, { step: "project", ok: true, count: result.projectedRows });
  }
  statusRedirect(batchId, { step: "project", ok: false, reason: result.reason });
}

async function publishNoindexAction(formData: FormData) {
  "use server";
  const batchId = formData.get("batchId");
  if (typeof batchId !== "string") return;

  const result = await publishApprovedImportCandidatesNoindex(batchId);
  if (result.ok) {
    revalidatePath("/admin/imports");
    revalidatePath(`/admin/imports/${batchId}`);
    revalidatePath(`/admin/imports/${batchId}/ops`);
    statusRedirect(batchId, { step: "publish-noindex", ok: true, count: result.publishedNoindexRows });
  }
  statusRedirect(batchId, { step: "publish-noindex", ok: false, reason: result.reason });
}

async function promoteAction(formData: FormData) {
  "use server";
  const batchId = formData.get("batchId");
  if (typeof batchId !== "string") return;

  const result = await promoteNoindexImportQueueToIndexEligible(batchId);
  if (result.ok) {
    revalidatePath("/admin/imports");
    revalidatePath(`/admin/imports/${batchId}`);
    revalidatePath(`/admin/imports/${batchId}/ops`);
    statusRedirect(batchId, { step: "promote-index", ok: true, count: result.promotedRows });
  }
  statusRedirect(batchId, { step: "promote-index", ok: false, reason: result.reason });
}

async function sitemapAction(formData: FormData) {
  "use server";
  const batchId = formData.get("batchId");
  if (typeof batchId !== "string") return;

  const result = await includeSitemapEligibleImportCandidates(batchId);
  if (result.ok) {
    revalidatePath("/admin/imports");
    revalidatePath(`/admin/imports/${batchId}`);
    revalidatePath(`/admin/imports/${batchId}/ops`);
    statusRedirect(batchId, { step: "sitemap", ok: true, count: result.includedRows });
  }
  statusRedirect(batchId, { step: "sitemap", ok: false, reason: result.reason });
}

async function relationsAction(formData: FormData) {
  "use server";
  const batchId = formData.get("batchId");
  if (typeof batchId !== "string") return;

  const result = await generateAdminImportRelationCandidates(batchId);
  if (result.ok) {
    revalidatePath("/admin/imports");
    revalidatePath(`/admin/imports/${batchId}`);
    revalidatePath(`/admin/imports/${batchId}/ops`);
    statusRedirect(batchId, { step: "relations", ok: true, count: result.relationCandidatesCreated });
  }
  statusRedirect(batchId, { step: "relations", ok: false, reason: result.reason });
}

async function applyRelationsAction(formData: FormData) {
  "use server";
  const batchId = formData.get("batchId");
  if (typeof batchId !== "string") return;

  const result = await applyApprovedImportRelationCandidates(batchId);
  if (result.ok) {
    revalidatePath("/admin/imports");
    revalidatePath(`/admin/imports/${batchId}`);
    revalidatePath(`/admin/imports/${batchId}/ops`);
    statusRedirect(batchId, { step: "apply-relations", ok: true, count: result.applied });
  }
  statusRedirect(batchId, { step: "apply-relations", ok: false, reason: result.reason });
}

function Feedback({ params }: { params: Record<string, string | string[] | undefined> }) {
  const step = first(params.step);
  const ok = first(params.ok);
  const reason = first(params.reason);
  const count = first(params.count);
  if (!step || !ok) return null;

  const success = ok === "1";
  return (
    <section className={`rounded-3xl border p-5 shadow-sm ${success ? "border-emerald-200 bg-emerald-50 text-emerald-950" : "border-amber-200 bg-amber-50 text-amber-950"}`}>
      <h2 className="text-lg font-bold">{formatLabel(step)} {success ? "completed" : "failed"}</h2>
      <p className="mt-2 text-sm leading-6">
        {success
          ? count ? `Completed count: ${count}.` : "The action completed and the page was refreshed."
          : reason ? `Reason: ${formatLabel(reason)}.` : "No raw database error is exposed here."}
      </p>
    </section>
  );
}

function ActionCard({
  code,
  title,
  description,
  action,
  disabled,
  button,
}: {
  code: string;
  title: string;
  description: string;
  action: (formData: FormData) => Promise<void>;
  disabled?: boolean;
  button: string;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">{code}</p>
      <h3 className="mt-2 text-xl font-bold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <form action={action} className="mt-4">
        <input type="hidden" name="batchId" value="" />
        <button
          type="submit"
          disabled={disabled}
          className="rounded-2xl bg-cyan-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {button}
        </button>
      </form>
    </section>
  );
}

function BatchActionCard({
  batchId,
  code,
  title,
  description,
  action,
  disabled,
  button,
}: {
  batchId: string;
  code: string;
  title: string;
  description: string;
  action: (formData: FormData) => Promise<void>;
  disabled?: boolean;
  button: string;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">{code}</p>
      <h3 className="mt-2 text-xl font-bold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <form action={action} className="mt-4">
        <input type="hidden" name="batchId" value={batchId} />
        <button
          type="submit"
          disabled={disabled}
          className="rounded-2xl bg-cyan-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {button}
        </button>
      </form>
    </section>
  );
}

export default async function AdminImportOpsPage({ params, searchParams }: PageProps) {
  const { batchId } = await params;
  const query = searchParams ? await searchParams : {};
  const result = await getAdminImportBatchDetail(batchId);

  if (!result.ok) {
    if (result.reason === "not_found") notFound();
    return (
      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <h2 className="text-2xl font-bold">Import workflow unavailable</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6">The batch could not be loaded. No raw database error is exposed here.</p>
      </section>
    );
  }

  const { batch } = result;
  const normalizedRows = result.rawRows.filter((row) => row.row_status === "normalized").length;
  const readyRows = result.rawRows.filter((row) => row.row_status === "ready_for_publish").length;
  const publishedRows = result.rawRows.filter((row) => row.row_status === "published_noindex").length;
  const indexRows = result.rawRows.filter((row) => row.row_status === "index_eligible").length;
  const canDetect = result.rawRows.length > 1;
  const canMarkReady = normalizedRows > 0;
  const canProject = readyRows > 0;
  const canPublish = readyRows > 0;
  const canPromote = result.publishQueue.some((row) => row.publish_status === "published_noindex" && row.index_policy === "noindex");
  const canSitemap = result.publishQueue.some((row) => row.publish_status === "index_eligible");
  const canRelations = result.publishQueue.length > 0 || result.rawRows.length > 0;
  const canApplyRelations = false;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link href={`/admin/imports/${batch.id}`} className="text-sm font-semibold text-cyan-800 hover:text-cyan-950">
          ← Back to batch review
        </Link>
        <Link href="/admin/imports" className="text-sm font-semibold text-slate-600 hover:text-slate-950">
          All imports
        </Link>
      </div>

      <Feedback params={query} />

      <section className="rounded-3xl border border-cyan-100 bg-cyan-50/70 p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-800">ADM-OPS</p>
        <h2 className="mt-2 text-2xl font-bold tracking-[-0.02em] text-slate-950">Import operations: {batch.batchName}</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          Run import actions from this page when the review page feels like a decorative museum of buttons. Each action redirects back with an explicit success or failure message. Public publishing, indexing, and sitemap inclusion remain gated by their own buttons.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <div className="rounded-2xl border border-cyan-200 bg-white/80 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Status</p><p className="mt-2 font-semibold text-slate-950">{formatLabel(batch.status)}</p></div>
          <div className="rounded-2xl border border-cyan-200 bg-white/80 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Rows</p><p className="mt-2 font-mono text-lg text-slate-950">{batch.totalRows}</p></div>
          <div className="rounded-2xl border border-cyan-200 bg-white/80 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Ready</p><p className="mt-2 font-mono text-lg text-slate-950">{readyRows}</p></div>
          <div className="rounded-2xl border border-cyan-200 bg-white/80 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Queue</p><p className="mt-2 font-mono text-lg text-slate-950">{result.publishQueue.length}</p></div>
        </div>
        <dl className="mt-5 grid gap-3 text-sm text-slate-700 md:grid-cols-4">
          <div><dt className="font-semibold text-slate-950">Entity</dt><dd>{formatLabel(batch.entityType)}</dd></div>
          <div><dt className="font-semibold text-slate-950">Normalized</dt><dd>{normalizedRows}</dd></div>
          <div><dt className="font-semibold text-slate-950">Published noindex</dt><dd>{publishedRows}</dd></div>
          <div><dt className="font-semibold text-slate-950">Index eligible</dt><dd>{indexRows}</dd></div>
          <div><dt className="font-semibold text-slate-950">Updated</dt><dd>{formatDate(batch.updatedAt)}</dd></div>
        </dl>
      </section>

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <BatchActionCard batchId={batch.id} code="STEP-1" title="Normalize staged rows" description="Cleans raw rows into normalized payloads. Does not publish, index, or create public pages." action={normalizeAction} disabled={result.rawRows.length === 0} button="Run normalize" />
        <BatchActionCard batchId={batch.id} code="STEP-2" title="Detect duplicates" description="Creates duplicate candidates for review only. Does not modify public data." action={detectAction} disabled={!canDetect} button="Detect duplicates" />
        <BatchActionCard batchId={batch.id} code="STEP-3" title="Mark all normalized rows ready" description="Bulk-approves normalized rows for projection. This replaces the useless one-by-one click parade." action={markReadyAction} disabled={!canMarkReady} button="Mark all ready" />
        <BatchActionCard batchId={batch.id} code="STEP-4" title="Create public-safe projection" description="Creates protected entity candidates from ready rows. Still does not create public pages." action={projectAction} disabled={!canProject} button="Create projection" />
        <BatchActionCard batchId={batch.id} code="STEP-5" title="Publish noindex queue" description="Moves approved candidates into noindex queue. Sitemap remains excluded." action={publishNoindexAction} disabled={!canPublish} button="Publish noindex" />
        <BatchActionCard batchId={batch.id} code="STEP-6" title="Promote index eligible" description="Runs the index gate for noindex queue rows. Passing rows become index candidates, not sitemap-included yet." action={promoteAction} disabled={!canPromote} button="Promote index" />
        <BatchActionCard batchId={batch.id} code="STEP-7" title="Include sitemap queue" description="Runs sitemap inclusion gate. Use only after checking eligibility output." action={sitemapAction} disabled={!canSitemap} button="Include sitemap" />
        <BatchActionCard batchId={batch.id} code="REL-1" title="Generate relation candidates" description="Generates pending relation candidates from projected entities for admin review." action={relationsAction} disabled={!canRelations} button="Generate relations" />
        <BatchActionCard batchId={batch.id} code="REL-2" title="Apply approved relations" description="Applies only approved relation candidates. This stays disabled until approved candidates exist." action={applyRelationsAction} disabled={!canApplyRelations} button="Apply relations" />
      </section>
    </div>
  );
}
