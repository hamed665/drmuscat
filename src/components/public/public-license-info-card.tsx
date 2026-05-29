import type { PublicCatalogLocale, PublicLicenseInfo } from '@/lib/catalog/public-types';

type PublicLicenseInfoCardVariant = 'center' | 'doctor';

type PublicLicenseInfoCardProps = {
  locale: PublicCatalogLocale;
  licenseInfo: PublicLicenseInfo | null;
  variant: PublicLicenseInfoCardVariant;
};

type LicenseInfoCardCopy = {
  titleByVariant: Record<PublicLicenseInfoCardVariant, string>;
  licenseNumberLabel: string;
  licenseAuthorityLabel: string;
  transparencyNote: string;
};

const copyByLocale: Record<PublicCatalogLocale, LicenseInfoCardCopy> = {
  en: {
    titleByVariant: {
      center: 'License information',
      doctor: 'Professional license'
    },
    licenseNumberLabel: 'License number',
    licenseAuthorityLabel: 'Licensing authority',
    transparencyNote: 'Displayed for transparency. This does not replace professional medical advice.'
  },
  ar: {
    titleByVariant: {
      center: 'معلومات الترخيص',
      doctor: 'الترخيص المهني'
    },
    licenseNumberLabel: 'رقم الترخيص',
    licenseAuthorityLabel: 'جهة الترخيص',
    transparencyNote: 'تُعرض هذه المعلومات للشفافية ولا تُغني عن الاستشارة الطبية المهنية.'
  }
};

export function PublicLicenseInfoCard({ locale, licenseInfo, variant }: PublicLicenseInfoCardProps) {
  if (licenseInfo === null) return null;

  const copy = copyByLocale[locale];

  return (
    <section className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-4" aria-label={copy.titleByVariant[variant]}>
      <h3 className="text-sm font-semibold leading-6 text-slate-950">{copy.titleByVariant[variant]}</h3>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium text-slate-500">{copy.licenseNumberLabel}</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-950">{licenseInfo.licenseNumber}</dd>
        </div>
        {licenseInfo.licenseAuthority ? (
          <div>
            <dt className="text-xs font-medium text-slate-500">{copy.licenseAuthorityLabel}</dt>
            <dd className="mt-1 text-sm font-semibold text-slate-950">{licenseInfo.licenseAuthority}</dd>
          </div>
        ) : null}
      </dl>
      <p className="mt-3 text-xs leading-5 text-slate-600">{copy.transparencyNote}</p>
    </section>
  );
}
