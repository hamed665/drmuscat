import Link from 'next/link';
import type { SupportedCountry, SupportedLocale } from '@/lib/i18n/config';
import { publicProviderRoute } from '@/lib/routes/public';

type HomeForProviders2026Props = {
  locale: SupportedLocale;
  country: SupportedCountry;
  dir: 'ltr' | 'rtl';
};

const copy = {
  en: {
    eyebrow: 'For providers',
    title: 'Build a premium public profile for your healthcare center in Oman.',
    subtitle: 'Prepare visibility for doctors, clinics, labs, pharmacies, beauty, wellness and pet care providers — with public profile, offers, call, directions and sponsored visibility prepared for later approved phases.',
    listCta: 'List your center',
    optionsCta: 'View provider options',
    accountCta: 'Create account',
    accountNote: 'Account access preview — route and auth backend are not active in this phase.',
    items: ['Public profile shell', 'Approved offers later', 'WhatsApp, call and directions later', 'Sponsored visibility later'],
    note: 'No dashboard, auth backend, payment backend, subscription activation or lead delivery is active in this UI shell.'
  },
  ar: {
    eyebrow: 'للمقدّمين',
    title: 'ابنِ حضوراً رقمياً أوضح لمركزك الصحي في عُمان',
    subtitle: 'جهّز الظهور للأطباء والعيادات والمختبرات والصيدليات والجمال والرفاهية ورعاية الحيوانات — مع ملفات عامة وعروض واتصال واتجاهات وظهور ممول لمراحل لاحقة معتمدة.',
    listCta: 'أدرج مركزك',
    optionsCta: 'عرض خيارات المقدمين',
    accountCta: 'إنشاء حساب',
    accountNote: 'معاينة وصول الحساب — المسار ونظام الدخول غير مفعّلين في هذه المرحلة.',
    items: ['غلاف ملف عام', 'عروض معتمدة لاحقاً', 'واتساب واتصال واتجاهات لاحقاً', 'ظهور مموّل لاحقاً'],
    note: 'لا توجد لوحة تحكم أو نظام تسجيل دخول أو دفع أو تفعيل اشتراكات أو تسليم فرص في هذا الغلاف الواجهاتي.'
  }
} as const;

export function HomeForProviders2026({ locale, country, dir }: HomeForProviders2026Props) {
  const sectionCopy = copy[locale];
  const providerHref = publicProviderRoute(locale, country);

  return (
    <section className="dm2026-home-section" dir={dir} aria-labelledby="dm2026-home-providers-title">
      <div className="dm2026-home-provider-cta-2026 dm2026-card-glass">
        <div className="dm2026-home-section__head">
          <span className="dm2026-badge">{sectionCopy.eyebrow}</span>
          <h2 id="dm2026-home-providers-title">{sectionCopy.title}</h2>
          <p>{sectionCopy.subtitle}</p>
        </div>
        <ul>
          {sectionCopy.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="dm2026-home-provider-cta-2026__actions">
          <Link href={providerHref} className="dm2026-button dm2026-button-primary">
            {sectionCopy.listCta}
          </Link>
          <Link href={providerHref} className="dm2026-button dm2026-button-secondary">
            {sectionCopy.optionsCta}
          </Link>
          <span className="dm2026-button dm2026-button-secondary dm2026-home-provider-cta-2026__disabled" aria-disabled="true" title={sectionCopy.accountNote}>
            {sectionCopy.accountCta}
          </span>
        </div>
        <p className="dm2026-home-provider-cta-2026__note">{sectionCopy.note}</p>
      </div>
    </section>
  );
}
