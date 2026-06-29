import Link from "next/link";

import { DraftCenterCreateForm } from "@/components/admin/draft-center-create-form";

export default function AdminNewDraftCenterPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/draft-centers"
          className="text-sm font-semibold text-cyan-800 hover:text-cyan-950"
        >
          ← Back to draft centers
        </Link>
      </div>

      <header className="rounded-3xl border border-cyan-100 bg-cyan-50/70 p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
          CENTER-MANUAL-A
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-[-0.02em] text-slate-950">
          Create manual draft center
        </h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          Create a protected internal center draft without using provider leads or
          spreadsheet import. The created center remains draft, unverified,
          inactive, not claimable, contact-hidden, and excluded from public
          sitemap/index workflows.
        </p>
      </header>

      <DraftCenterCreateForm />
    </div>
  );
}
