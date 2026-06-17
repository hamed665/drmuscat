"use client";

import { useActionState } from "react";

import {
  saveDraftCenterPrimaryLocation,
  type DraftCenterLocationState,
} from "@/server/admin/draft-center-location-actions";
import type {
  AdminDraftCenterLocation,
  AdminDraftCenterLocationOptions,
  AdminGeoOption,
} from "@/server/admin/draft-center-locations";
import type { AdminDraftCenterDetail } from "@/server/admin/draft-centers";

type DraftCenterLocationPanelProps = {
  center: AdminDraftCenterDetail;
  location: AdminDraftCenterLocation | null;
  options: AdminDraftCenterLocationOptions;
};

const initialState: DraftCenterLocationState = { ok: false, message: null };

function label(option: AdminGeoOption): string {
  return `${option.labelEn} / ${option.labelAr}`;
}

function value(input: string | null | undefined): string {
  return input ?? "";
}

function firstId(options: AdminGeoOption[]): string {
  return options[0]?.id ?? "";
}

function hasGeo(options: AdminDraftCenterLocationOptions): boolean {
  return options.countries.length > 0 && options.regions.length > 0 && options.cities.length > 0;
}

export function DraftCenterLocationPanel({ center, location, options }: DraftCenterLocationPanelProps) {
  const [state, formAction, isPending] = useActionState(
    saveDraftCenterPrimaryLocation,
    initialState,
  );
  const ready = hasGeo(options);
  const whatsappDefault = location?.whatsappPhone ?? center.whatsappPhone ?? center.primaryPhone;

  return (
    <section className="rounded-3xl border border-blue-200 bg-blue-50/70 p-5 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-800">
        CENTER-LOCATION-A
      </p>
      <h3 className="mt-2 text-xl font-bold text-slate-950">
        Location, WhatsApp & Google directions
      </h3>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
        Save one primary internal location candidate. This does not publish,
        activate, claim, bill, sponsor, or expose the center publicly.
      </p>

      {location !== null ? (
        <div className="mt-3 rounded-2xl border border-blue-200 bg-white/70 p-3 text-sm text-slate-700">
          <p className="font-semibold text-slate-950">Current location candidate</p>
          <p>{location.nameEn ?? location.addressLine1En ?? "Primary location"}</p>
          <p>WhatsApp: {location.whatsappPhone ?? "Not set"}</p>
          <p>Google directions: {location.googleDirectionsUrl !== null ? "Ready" : "Not ready"}</p>
        </div>
      ) : null}

      <form action={formAction} className="mt-5 space-y-5">
        <input name="centerId" type="hidden" value={center.id} />

        <div className="grid gap-4 lg:grid-cols-4">
          <label className="block text-sm font-semibold text-slate-800">
            Country
            <select className="mt-2 w-full rounded-2xl border border-blue-200 bg-white px-3 py-2 text-sm" defaultValue={location?.countryId ?? firstId(options.countries)} disabled={isPending || !ready} name="countryId" required>
              {options.countries.map((option) => <option key={option.id} value={option.id}>{label(option)}</option>)}
            </select>
          </label>
          <label className="block text-sm font-semibold text-slate-800">
            Region
            <select className="mt-2 w-full rounded-2xl border border-blue-200 bg-white px-3 py-2 text-sm" defaultValue={location?.regionId ?? firstId(options.regions)} disabled={isPending || !ready} name="regionId" required>
              {options.regions.map((option) => <option key={option.id} value={option.id}>{label(option)}</option>)}
            </select>
          </label>
          <label className="block text-sm font-semibold text-slate-800">
            City
            <select className="mt-2 w-full rounded-2xl border border-blue-200 bg-white px-3 py-2 text-sm" defaultValue={location?.cityId ?? firstId(options.cities)} disabled={isPending || !ready} name="cityId" required>
              {options.cities.map((option) => <option key={option.id} value={option.id}>{label(option)}</option>)}
            </select>
          </label>
          <label className="block text-sm font-semibold text-slate-800">
            Area optional
            <select className="mt-2 w-full rounded-2xl border border-blue-200 bg-white px-3 py-2 text-sm" defaultValue={location?.areaId ?? ""} disabled={isPending || !ready} name="areaId">
              <option value="">No area selected</option>
              {options.areas.map((option) => <option key={option.id} value={option.id}>{label(option)}</option>)}
            </select>
          </label>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <label className="block text-sm font-semibold text-slate-800">
            Location name EN
            <input className="mt-2 w-full rounded-2xl border border-blue-200 bg-white px-3 py-2 text-sm" defaultValue={value(location?.nameEn)} name="nameEn" />
          </label>
          <label className="block text-sm font-semibold text-slate-800">
            Location name AR
            <input className="mt-2 w-full rounded-2xl border border-blue-200 bg-white px-3 py-2 text-sm" defaultValue={value(location?.nameAr)} dir="rtl" name="nameAr" />
          </label>
          <label className="block text-sm font-semibold text-slate-800">
            Address EN
            <input className="mt-2 w-full rounded-2xl border border-blue-200 bg-white px-3 py-2 text-sm" defaultValue={value(location?.addressLine1En)} name="addressLine1En" />
          </label>
          <label className="block text-sm font-semibold text-slate-800">
            Address AR
            <input className="mt-2 w-full rounded-2xl border border-blue-200 bg-white px-3 py-2 text-sm" defaultValue={value(location?.addressLine1Ar)} dir="rtl" name="addressLine1Ar" />
          </label>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <label className="block text-sm font-semibold text-slate-800">
            Primary phone
            <input className="mt-2 w-full rounded-2xl border border-blue-200 bg-white px-3 py-2 text-sm" defaultValue={value(location?.primaryPhone ?? center.primaryPhone)} name="primaryPhone" />
          </label>
          <label className="block text-sm font-semibold text-slate-800">
            WhatsApp phone required
            <input className="mt-2 w-full rounded-2xl border border-blue-200 bg-white px-3 py-2 text-sm" defaultValue={value(whatsappDefault)} name="whatsappPhone" required />
          </label>
          <label className="block text-sm font-semibold text-slate-800">
            Email optional
            <input className="mt-2 w-full rounded-2xl border border-blue-200 bg-white px-3 py-2 text-sm" defaultValue={value(location?.email ?? center.email)} name="email" type="email" />
          </label>
        </div>

        <label className="block text-sm font-semibold text-slate-800">
          Google Maps URL
          <input className="mt-2 w-full rounded-2xl border border-blue-200 bg-white px-3 py-2 text-sm" defaultValue={value(location?.mapUrl)} name="mapUrl" placeholder="Paste a Google Maps link, or use latitude and longitude below" />
        </label>

        <div className="grid gap-4 lg:grid-cols-2">
          <label className="block text-sm font-semibold text-slate-800">
            Latitude optional
            <input className="mt-2 w-full rounded-2xl border border-blue-200 bg-white px-3 py-2 text-sm" defaultValue={value(location?.latitude)} name="latitude" />
          </label>
          <label className="block text-sm font-semibold text-slate-800">
            Longitude optional
            <input className="mt-2 w-full rounded-2xl border border-blue-200 bg-white px-3 py-2 text-sm" defaultValue={value(location?.longitude)} name="longitude" />
          </label>
        </div>

        <button className="rounded-2xl bg-blue-700 px-4 py-2 text-sm font-bold text-white disabled:bg-slate-400" disabled={isPending || !ready} type="submit">
          {isPending ? "Saving location…" : "Save location, WhatsApp & Google directions"}
        </button>

        {!ready ? <p className="text-sm font-semibold text-rose-700">Geo country, region, and city options are required first.</p> : null}
        {state.message !== null ? <p className={`text-sm font-semibold ${state.ok ? "text-emerald-700" : "text-rose-700"}`}>{state.message}</p> : null}
      </form>
    </section>
  );
}
