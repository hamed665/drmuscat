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
    title: 'Prepare your public presence on DrMuscat',
    subtitle: 'A premium growth path for centers, clinics, labs and pharmacies — without payments or claim automation in this phase.',
    cta: 'For Providers',
    items: ['List your center', 'Claim your profile', 'Add offers after approval', 'Get featured placement', 'Receive public discovery leads later'],
    note: 'No real claim backend, payment backend, subscription activation or lead delivery is implemented here.'
  },
  ar: {
    eyebrow: 'للمقدّمين',
    title: 'جهّز حضورك العام على DrMuscat',
    subtitle: 'مسار نمو مميز للمراكز والعيادات والمختبرات والصيدليات — دون دفع أو أتمتة مطالبات في هذه المرحلة.',
    cta: 'للمقدّمين',
    items: ['أدرج مركزك', 'طالب بملفك', 'أضف عروضاً بعد الموافقة', 'احصل على موضع مميز', 'استقبل لاحقاً فرص اكتشاف عامة'],
    note: 'لا يتم تنفيذ نظام مطالبات حقيقي أو دفع أو تفعيل اشتراكات أو تسليم فرص هنا.'
  }
} as const;

export function HomeForProviders2026({ locale, country, dir }: HomeForProviders2026Props) {
  const sectionCopy = copy[locale];

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
        <p className="dm2026-home-provider-cta-2026__note">{sectionCopy.note}</p>
        <Link href={publicProviderRoute(locale, country)} className="dm2026-button dm2026-button-primary">
          {sectionCopy.cta}
        </Link>
      </div>
    </section>
  );
}
