import type { ImportAdminReadinessReviewReadOnlyModel } from "@/server/admin/import-admin-readiness-review-readonly";

function formatLabel(value: string): string {
  return value
    .split(/[_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function ImportReadinessReviewReadOnlyPanel({
  model,
}: {
  model: ImportAdminReadinessReviewReadOnlyModel;
}) {
  return (
    <section className="rounded-3xl border border-violet-100 bg-violet-50/70 p-6 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-800">ADM-READINESS-READONLY</p>
          <h3 className="mt-2 text-xl font-bold text-slate-950">Import readiness review</h3>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
            Read-only review of ready and blocked entities, blocker categories, severity, next action, and readiness timeline. This surface cannot approve, publish, index, or mutate imported data.
          </p>
        </div>
        <span className="w-fit rounded-full border border-violet-200 bg-white/80 px-3 py-1 text-xs font-bold text-violet-900">
          Allowed actions: none
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Imported", model.summary.totalImported],
          ["Ready", model.summary.readyToPublish],
          ["Blocked", model.summary.blocked],
          ["Sitemap eligible", model.summary.sitemapEligible],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-violet-200 bg-white/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">{label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
          </div>
        ))}
      </div>

      {model.rows.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-violet-200 bg-white/70 p-5">
          <h4 className="font-bold text-slate-950">No readiness rows loaded</h4>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            The review surface is active, but no entity readiness rows were supplied. It intentionally does not query raw import tables or fabricate operational data.
          </p>
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-violet-200 bg-white/80">
          <table className="min-w-full divide-y divide-violet-100 text-sm">
            <thead className="bg-violet-50 text-left text-xs font-semibold uppercase tracking-wide text-violet-700">
              <tr>
                <th className="px-4 py-3">Entity</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Blockers</th>
                <th className="px-4 py-3">Next action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-violet-100">
              {model.rows.map((row) => (
                <tr key={row.entity_id} className="align-top">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-950">{row.entity_name ?? row.entity_id}</p>
                    <p className="mt-1 text-xs text-slate-500">{formatLabel(row.entity_type)} · {formatLabel(row.entity_domain)}</p>
                  </td>
                  <td className="px-4 py-4 font-semibold text-slate-700">{row.readiness.publishReady ? "Ready" : "Blocked"}</td>
                  <td className="px-4 py-4 text-slate-700">{row.readiness.score}</td>
                  <td className="px-4 py-4">
                    <div className="flex max-w-xl flex-wrap gap-2">
                      {row.blockerGroups.length === 0 ? (
                        <span className="text-slate-500">None</span>
                      ) : (
                        row.blockerGroups.map((group) => (
                          <span key={group.category} className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700">
                            {formatLabel(group.category)} · {formatLabel(group.severity)}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-700">{formatLabel(row.readiness.nextAction)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {model.visibleBlockerCategories.map((category) => (
          <span key={category} className="rounded-full border border-violet-200 bg-white/80 px-3 py-1 text-xs font-semibold text-violet-900">
            {formatLabel(category)}
          </span>
        ))}
      </div>
    </section>
  );
}
