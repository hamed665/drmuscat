"use client";

import { useActionState } from "react";

import {
  updateProviderOnboardingLeadStatusPriority,
  type ProviderOnboardingLeadMutationState,
} from "@/server/admin/provider-onboarding-lead-actions";

type ProviderLeadStatus =
  | "new"
  | "reviewing"
  | "contacted"
  | "qualified"
  | "rejected"
  | "converted"
  | "closed";

type ProviderLeadPriority = "low" | "normal" | "high";

type ProviderOnboardingLeadStatusPriorityFormProps = {
  leadId: string;
  currentStatus: ProviderLeadStatus;
  currentPriority: ProviderLeadPriority;
};

const statusOptions: { value: ProviderLeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "rejected", label: "Rejected" },
  { value: "converted", label: "Converted" },
  { value: "closed", label: "Closed" },
];

const priorityOptions: { value: ProviderLeadPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
];

const initialState: ProviderOnboardingLeadMutationState = {
  ok: false,
  message: null,
};

export function ProviderOnboardingLeadStatusPriorityForm({
  leadId,
  currentStatus,
  currentPriority,
}: ProviderOnboardingLeadStatusPriorityFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateProviderOnboardingLeadStatusPriority,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input name="leadId" type="hidden" value={leadId} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-800">
          Status
          <select
            name="status"
            defaultValue={currentStatus}
            disabled={isPending}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm transition focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
            required
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-semibold text-slate-800">
          Priority
          <select
            name="priority"
            defaultValue={currentPriority}
            disabled={isPending}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm transition focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
            required
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex justify-center rounded-2xl bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isPending ? "Updating…" : "Update status and priority"}
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
  );
}
