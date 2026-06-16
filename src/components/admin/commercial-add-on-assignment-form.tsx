"use client";

import { useActionState } from "react";

import {
  createCommercialAddOnAssignment,
  type CommercialAddOnAssignmentState,
} from "@/server/admin/commercial-addon-actions";
import type { AdminCommercialAddOnCenterOption } from "@/server/admin/commercial-addons";

type CommercialAddOnAssignmentFormProps = {
  centers: AdminCommercialAddOnCenterOption[];
};

const initialState: CommercialAddOnAssignmentState = {
  ok: false,
  message: null,
};

const addOnTypes = [
  { value: "homepage_ads", label: "Homepage Ads" },
  { value: "special_offer_placement", label: "Special Offer Placement" },
] as const;

const terms = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly / 3 months" },
] as const;

function formatLabel(value: string): string {
  return value
    .split(/[_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function CommercialAddOnAssignmentForm({
  centers,
}: CommercialAddOnAssignmentFormProps) {
  const [state, formAction, isPending] = useActionState(
    createCommercialAddOnAssignment,
    initialState,
  );

  const canSubmit = centers.length > 0;

  return (
    <section className="rounded-3xl border border-cyan-100 bg-cyan-50/70 p-5 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-800">
            ADDON-A
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-950">
            Assign commercial add-on
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
            Creates an internal commercial add-on assignment for Ads or Special
            Offer placement. This does not charge, invoice, publish, activate a
            public placement, or create offer content.
          </p>
        </div>
        <div className="rounded-2xl border border-cyan-200 bg-white/80 px-4 py-3 text-sm font-medium text-cyan-900">
          {centers.length} centers
        </div>
      </div>

      {!canSubmit ? (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          Add at least one non-deleted center before creating add-on assignments.
        </div>
      ) : null}

      <form action={formAction} className="mt-5 space-y-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <label className="block text-sm font-semibold text-slate-800">
            Center
            <select
              name="centerId"
              defaultValue=""
              disabled={isPending || !canSubmit}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
              required
            >
              <option value="" disabled>
                Select center
              </option>
              {centers.map((center) => (
                <option key={center.id} value={center.id}>
                  {center.name_en} · {center.slug} · {formatLabel(center.status)}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-semibold text-slate-800">
            Add-on type
            <select
              name="addOnType"
              defaultValue=""
              disabled={isPending || !canSubmit}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
              required
            >
              <option value="" disabled>
                Select add-on type
              </option>
              {addOnTypes.map((addOnType) => (
                <option key={addOnType.value} value={addOnType.value}>
                  {addOnType.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="block text-sm font-semibold text-slate-800">
            Term
            <select
              name="term"
              defaultValue=""
              disabled={isPending || !canSubmit}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
              required
            >
              <option value="" disabled>
                Select term
              </option>
              {terms.map((term) => (
                <option key={term.value} value={term.value}>
                  {term.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-semibold text-slate-800">
            Starts at
            <input
              name="startsAt"
              type="date"
              disabled={isPending || !canSubmit}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-800">
            Budget / price
            <input
              name="budgetAmount"
              type="number"
              min="0"
              step="0.001"
              placeholder="Optional"
              disabled={isPending || !canSubmit}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
            />
          </label>
        </div>

        <label className="block text-sm font-semibold text-slate-800">
          Private note
          <textarea
            name="note"
            rows={3}
            maxLength={1000}
            placeholder="Optional internal sales note"
            disabled={isPending || !canSubmit}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          />
        </label>

        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm leading-6 text-slate-700">
          Ads and Special Offer placements are separate products. This form only
          creates an internal draft commercial assignment and placement shell;
          public activation, payment, invoices, offer content, and media upload
          remain deferred.
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={isPending || !canSubmit}
            className="inline-flex justify-center rounded-2xl bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isPending ? "Saving…" : "Save commercial add-on"}
          </button>
          {state.message !== null ? (
            <p
              className={`text-sm font-semibold ${
                state.ok ? "text-emerald-700" : "text-rose-700"
              }`}
              role="status"
            >
              {state.message}
            </p>
          ) : null}
        </div>
      </form>
    </section>
  );
}
