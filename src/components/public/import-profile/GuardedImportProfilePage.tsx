import Link from "next/link";
import {
  buildPublicImportProfileSummary,
  type PublicImportProfileSummaryInput,
} from "@/lib/catalog/public-import-profile-summary";
import type { PublicImportLocalSuggestion, PublicImportLocalSuggestionFamily } from "@/server/public/import-local-suggestion-guard";
import type { PublicImportProfile } from "@/server/public/import-doctor-profile-guard";

type GuardedImportProfilePageProps = {
  profile: PublicImportProfile;
  locale: "en" | "ar";
};

type LocalSuggestionProfile = PublicImportProfile & {
  localSuggestions?: PublicImportLocalSuggestion[];
};

function formatLabel(value: string): string {
  return value
    .split(/[_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function profileTypeLabel(profile: PublicImportProfile): string {
  switch (profile.entityType) {
    case "doctor":
      return "Doctor profile";
    default:
      return formatLabel(profile.entityType);
  }
}

function localSuggestionDisplayName(locale: "en" | "ar", suggestion: PublicImportLocalSuggestion): string {
  return locale === "ar" && suggestion.nameAr ? suggestion.nameAr : suggestion.name;
}

function localSuggestionFamilyLabel(locale: "en" | "ar", family: PublicImportLocalSuggestionFamily): string {
  const labels: Record<"en" | "ar", Record<PublicImportLocalSuggestionFamily, string>> = {
    en: {
      doctor: "Doctor",
      pharmacy: "Pharmacy",
      hospital: "Hospital",
      radiology: "Radiology",
      dentistry: "Dentistry",
      beauty: "Beauty",
    },
    ar: {
      doctor: "طبيب",
      pharmacy: "صيدلية",
      hospital: "مستشفى",
      radiology: "أشعة",
      dentistry: "أسنان",
      beauty: "تجميل",
    },
  };
  return labels[locale][family];
}

function publicSearchHref(locale: "en" | "ar", country: string, query: string): string {
  return `/${locale}/${country}/search?q=${encodeURIComponent(query)}`;
}

function publicLocalSuggestionHref(locale: "en" | "ar", country: string, suggestion: PublicImportLocalSuggestion): string {
  if (suggestion.slug && suggestion.family === "doctor") return `/${locale}/${country}/doctor/${suggestion.slug}`;
  if (suggestion.slug && suggestion.family === "pharmacy") return `/${locale}/${country}/pharmacies/${suggestion.slug}`;
  if (suggestion.slug && suggestion.family === "hospital") return `/${locale}/${country}/hospitals/${suggestion.slug}`;
  return publicSearchHref(locale, country, `${suggestion.name} ${suggestion.area}`);
}

export function GuardedImportProfilePage({ profile, locale }: GuardedImportProfilePageProps) {
  const dir = locale === "ar" ? "rtl" : "ltr";
  const location = [profile.area, profile.wilayat, profile.governorate].filter(Boolean).join(", ");
  const careSignals = [profile.primarySpecialty, ...profile.services.slice(0, 4)].filter(Boolean);
  const profileSummary = buildPublicImportProfileSummary(locale, profile satisfies PublicImportProfileSummaryInput);
  const localSuggestions = (profile as LocalSuggestionProfile).localSuggestions ?? [];

  return (
    <main className="home-foundation dm2026-home-page" dir={dir} data-profile-family={profile.family}>
      <section className="dm2026-container dm2026-search-surface" aria-labelledby="profile-title">
        <div className="dm2026-doctors-hero__copy">
          <span className="dm2026-badge">{profileTypeLabel(profile)}</span>
          <h1 id="profile-title">{locale === "ar" && profile.nameAr ? profile.nameAr : profile.name}</h1>
          {profile.nameAr && locale !== "ar" ? <p>{profile.nameAr}</p> : null}
          <p>{profileSummary}</p>
        </div>
      </section>

      <section className="dm2026-container dm2026-doctors-listings" aria-labelledby="profile-overview-title">
        <div className="dm2026-card-soft">
          <h2 id="profile-overview-title">Profile overview</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">{profileSummary}</p>
          <dl className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-950">Location</dt>
              <dd>{location || "Oman"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-950">Primary care signal</dt>
              <dd>{profile.primarySpecialty ?? "General healthcare discovery"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-950">Languages</dt>
              <dd>{profile.languages.length > 0 ? profile.languages.join(", ") : "Not listed"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-950">Last checked</dt>
              <dd>{profile.lastCheckedAt ?? "Not listed"}</dd>
            </div>
          </dl>
        </div>

        {careSignals.length > 0 ? (
          <div className="dm2026-card-soft mt-4">
            <h2>Care and service signals</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {careSignals.map((item) => (
                <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {localSuggestions.length > 0 ? (
          <div className="dm2026-card-soft mt-4">
            <h2>{locale === "ar" ? "رعاية قريبة في نفس المنطقة" : "Nearby care in the same area"}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {locale === "ar" ? "تظهر هذه الروابط فقط عند وجود دليل مصدر ومطابقة واضحة للمنطقة." : "These links appear only when the nearby relationship has reviewed source evidence and a matching area."}
            </p>
            <ul className="mt-3 grid gap-3 md:grid-cols-2" role="list">
              {localSuggestions.map((suggestion) => {
                const suggestionName = localSuggestionDisplayName(locale, suggestion);
                return (
                  <li key={`${suggestion.family}:${suggestion.slug ?? suggestion.name}`} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{localSuggestionFamilyLabel(locale, suggestion.family)}</p>
                    <h3 className="mt-1">
                      <Link href={publicLocalSuggestionHref(locale, "om", suggestion)} className="text-sm font-semibold text-slate-950 underline-offset-4 hover:underline">
                        {suggestionName}
                      </Link>
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {[suggestion.area, suggestion.governorate].filter(Boolean).join(" · ")}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {locale === "ar" ? "تم التحقق من المصدر" : "Source checked"}: {suggestion.lastCheckedAt}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        <div className="dm2026-card-soft mt-4">
          <h2>Contact and directions</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.phoneE164 ? (
              <a className="dm2026-button dm2026-button-secondary" href={`tel:${profile.phoneE164}`}>
                Call
              </a>
            ) : null}
            {profile.websiteUrl ? (
              <a className="dm2026-button dm2026-button-secondary" href={profile.websiteUrl} target="_blank" rel="noopener noreferrer">
                Website
              </a>
            ) : null}
            {profile.googleMapsUrl ? (
              <a className="dm2026-button dm2026-button-secondary" href={profile.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                Google Maps
              </a>
            ) : null}
            {profile.directionUrl ? (
              <a className="dm2026-button dm2026-button-secondary" href={profile.directionUrl} target="_blank" rel="noopener noreferrer">
                Directions
              </a>
            ) : null}
            {!profile.phoneE164 && !profile.websiteUrl && !profile.googleMapsUrl && !profile.directionUrl ? (
              <span className="text-sm text-slate-600">Contact details are not listed yet.</span>
            ) : null}
          </div>
        </div>

        <p className="mt-4 text-xs leading-5 text-slate-500">
          Source: {profile.sourceName ?? "reviewed import source"}. Confirm details directly with the provider.
        </p>
      </section>
    </main>
  );
}
