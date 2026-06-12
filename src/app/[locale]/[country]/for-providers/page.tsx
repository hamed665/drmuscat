import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { localeDirection, isSupportedCountry, isSupportedLocale, type SupportedLocale } from '@/lib/i18n/config';
import { buildLocalizedMetadata } from '@/lib/seo/metadata';

import { ProviderOnboardingForm, type ProviderFormCopy } from './provider-onboarding-form';

type Params = { locale: string; country: string };

type ProviderPageCopy = {
  metadataTitle: string;
  metadataDescription: string;
  badge: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  heroNote: string;
  audienceTitle: string;
  audienceItems: readonly string[];
  valuesTitle: string;
  values: readonly { title: string; description: string }[];
  processTitle: string;
  processSteps: readonly string[];
  disclaimerTitle: string;
  disclaimerItems: readonly string[];
  form: ProviderFormCopy;
};

const copyByLocale: Record<SupportedLocale, ProviderPageCopy> = {
  en: {
    metadataTitle: 'List your healthcare business in Oman | DrMuscat',
    metadataDescription:
      'DrMuscat is onboarding clinics, doctors, pharmacies, labs, hospitals, wellness providers and pet clinics in Oman for reviewed bilingual public discovery profiles.',
    badge: 'For providers in Oman',
    title: 'Bring your healthcare business onto DrMuscat',
    description:
      'DrMuscat is restoring safe onboarding for providers across Oman. Share basic public information so our team can review your profile for future discovery pages.',
    primaryCta: 'Request onboarding review',
    secondaryCta: 'Public discovery only',
    heroNote: 'No payment, booking, dashboard, ranking promise or immediate publishing is included in this request.',
    audienceTitle: 'Who this page is for',
    audienceItems: ['Clinics', 'Doctors', 'Dental clinics', 'Pharmacies', 'Labs', 'Hospitals', 'Beauty and wellness providers', 'Pet clinics'],
    valuesTitle: 'What a reviewed DrMuscat presence can prepare',
    values: [
      {
        title: 'Public discovery profile',
        description: 'A bilingual-ready public profile can help people understand your location, services and contact options after review.'
      },
      {
        title: 'English and Arabic presence',
        description: 'Provider information can be prepared for Oman audiences in English and Arabic without creating unsupported language routes.'
      },
      {
        title: 'Services and contact details',
        description: 'Your submitted services, phone, WhatsApp, directions readiness and public contact details can be checked before publication.'
      },
      {
        title: 'Future provider-approved offers',
        description: 'Offers or promotions may be supported later only when provider-approved, reviewed and clearly presented as public information.'
      }
    ],
    processTitle: 'Safe onboarding flow',
    processSteps: [
      'Submit basic business and contact details.',
      'The DrMuscat team reviews public information before any publication.',
      'Approved profile details can be prepared for direct WhatsApp, call and directions actions.'
    ],
    disclaimerTitle: 'Important discovery disclaimer',
    disclaimerItems: [
      'DrMuscat is a discovery and visibility platform, not a medical advice service.',
      'Provider information may require review before publication.',
      'Patients should confirm services, availability, prices, offers and clinical advice directly with the provider.'
    ],
    form: {
      title: 'Request provider onboarding',
      description: 'Use this safe form to send your interest to the DrMuscat provider team.',
      requiredNote: 'Required fields are marked by the browser validation before submission.',
      labels: {
        centerName: 'Center or business name',
        contactName: 'Contact person',
        phone: 'Phone',
        whatsapp: 'WhatsApp (optional)',
        email: 'Email (optional)',
        providerType: 'Provider type',
        cityText: 'City',
        areaText: 'Area (optional)',
        preferredLanguage: 'Preferred language',
        message: 'Message (optional)',
        consent: 'I agree that DrMuscat may contact me about provider onboarding and review of public information.',
        honeypot: 'Website'
      },
      placeholders: {
        centerName: 'Example Medical Center',
        contactName: 'Your name',
        phone: '+968 ...',
        whatsapp: '+968 ...',
        email: 'name@example.com',
        cityText: 'Muscat',
        areaText: 'Al Khuwair',
        message: 'Tell us which services or public details you want reviewed.'
      },
      providerTypeOptions: [
        { value: 'clinic', label: 'Clinic' },
        { value: 'medical_center', label: 'Medical center or hospital' },
        { value: 'dental_clinic', label: 'Dental clinic' },
        { value: 'pharmacy', label: 'Pharmacy' },
        { value: 'lab', label: 'Lab' },
        { value: 'wellness', label: 'Beauty or wellness provider' },
        { value: 'other', label: 'Other, including pet clinic' }
      ],
      languageOptions: [
        { value: 'en', label: 'English' },
        { value: 'ar', label: 'Arabic' },
        { value: 'en-ar', label: 'English and Arabic' }
      ],
      submit: 'Send onboarding request',
      submitting: 'Sending request…',
      success: 'Thank you. Your request was received for review.',
      error: 'We could not send the request. Please check the fields and try again.'
    }
  },
  ar: {
    metadataTitle: 'إدراج مقدم رعاية صحية في عُمان | DrMuscat',
    metadataDescription:
      'تستقبل DrMuscat طلبات انضمام العيادات والأطباء والصيدليات والمختبرات والمستشفيات ومقدمي التجميل والرفاهية والعيادات البيطرية في عُمان لملفات عامة ثنائية اللغة بعد المراجعة.',
    badge: 'لمقدمي الخدمات في عُمان',
    title: 'أضف حضور منشأتك الصحية على DrMuscat',
    description:
      'تستقبل DrMuscat طلبات انضمام آمنة لمقدمي الخدمات في عُمان. أرسل معلومات عامة أساسية ليتمكن فريقنا من مراجعة ملفك لصفحات الاكتشاف المستقبلية.',
    primaryCta: 'اطلب مراجعة الانضمام',
    secondaryCta: 'اكتشاف عام فقط',
    heroNote: 'لا يتضمن هذا الطلب دفعاً أو حجزاً أو لوحة تحكم أو وعداً بالترتيب أو نشراً فورياً.',
    audienceTitle: 'لمن هذه الصفحة؟',
    audienceItems: ['العيادات', 'الأطباء', 'عيادات الأسنان', 'الصيدليات', 'المختبرات', 'المستشفيات', 'مقدمو التجميل والرفاهية', 'العيادات البيطرية'],
    valuesTitle: 'ما الذي يمكن أن يجهزه حضور DrMuscat بعد المراجعة؟',
    values: [
      {
        title: 'ملف اكتشاف عام',
        description: 'يمكن أن يساعد الملف العام ثنائي اللغة الناس على فهم موقعك وخدماتك وطرق التواصل بعد المراجعة.'
      },
      {
        title: 'حضور بالعربية والإنجليزية',
        description: 'يمكن تجهيز معلومات مقدم الخدمة لجمهور عُمان بالعربية والإنجليزية دون إنشاء مسارات لغات غير مدعومة.'
      },
      {
        title: 'الخدمات وبيانات التواصل',
        description: 'يمكن مراجعة الخدمات ورقم الهاتف والواتساب وجاهزية الاتجاهات وبيانات التواصل العامة قبل النشر.'
      },
      {
        title: 'عروض مستقبلية بموافقة مقدم الخدمة',
        description: 'قد تُدعم العروض أو الترويج مستقبلاً فقط عندما تكون بموافقة مقدم الخدمة وبعد المراجعة وبصياغة واضحة كمعلومات عامة.'
      }
    ],
    processTitle: 'مسار انضمام آمن',
    processSteps: [
      'أرسل بيانات المنشأة والتواصل الأساسية.',
      'يراجع فريق DrMuscat المعلومات العامة قبل أي نشر.',
      'يمكن تجهيز تفاصيل الملف المعتمدة لإجراءات واتساب والاتصال والاتجاهات المباشرة.'
    ],
    disclaimerTitle: 'تنبيه مهم حول الاكتشاف',
    disclaimerItems: [
      'DrMuscat منصة اكتشاف وظهور عام وليست خدمة نصيحة طبية.',
      'قد تتطلب معلومات مقدم الخدمة مراجعة قبل النشر.',
      'ينبغي للمرضى تأكيد الخدمات والتوفر والأسعار والعروض والنصائح السريرية مباشرة مع مقدم الخدمة.'
    ],
    form: {
      title: 'طلب انضمام مقدم خدمة',
      description: 'استخدم هذا النموذج الآمن لإرسال اهتمامك إلى فريق مقدمي الخدمات في DrMuscat.',
      requiredNote: 'تتحقق المتصفحات من الحقول المطلوبة قبل الإرسال.',
      labels: {
        centerName: 'اسم المركز أو النشاط',
        contactName: 'الشخص المسؤول للتواصل',
        phone: 'الهاتف',
        whatsapp: 'واتساب (اختياري)',
        email: 'البريد الإلكتروني (اختياري)',
        providerType: 'نوع مقدم الخدمة',
        cityText: 'المدينة',
        areaText: 'المنطقة (اختياري)',
        preferredLanguage: 'لغة التواصل المفضلة',
        message: 'رسالة (اختياري)',
        consent: 'أوافق على أن تتواصل معي DrMuscat بخصوص الانضمام ومراجعة المعلومات العامة.',
        honeypot: 'الموقع الإلكتروني'
      },
      placeholders: {
        centerName: 'مثال: مركز طبي',
        contactName: 'اسمك',
        phone: '+968 ...',
        whatsapp: '+968 ...',
        email: 'name@example.com',
        cityText: 'مسقط',
        areaText: 'الخوير',
        message: 'أخبرنا بالخدمات أو التفاصيل العامة التي ترغب في مراجعتها.'
      },
      providerTypeOptions: [
        { value: 'clinic', label: 'عيادة' },
        { value: 'medical_center', label: 'مركز طبي أو مستشفى' },
        { value: 'dental_clinic', label: 'عيادة أسنان' },
        { value: 'pharmacy', label: 'صيدلية' },
        { value: 'lab', label: 'مختبر' },
        { value: 'wellness', label: 'تجميل أو رفاهية' },
        { value: 'other', label: 'أخرى، بما في ذلك عيادة بيطرية' }
      ],
      languageOptions: [
        { value: 'ar', label: 'العربية' },
        { value: 'en', label: 'الإنجليزية' },
        { value: 'en-ar', label: 'العربية والإنجليزية' }
      ],
      submit: 'إرسال طلب الانضمام',
      submitting: 'جارٍ الإرسال…',
      success: 'شكراً لك. تم استلام طلبك للمراجعة.',
      error: 'تعذر إرسال الطلب. يرجى مراجعة الحقول والمحاولة مرة أخرى.'
    }
  }
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, country } = await params;

  if (!isSupportedLocale(locale) || !isSupportedCountry(country)) return {};

  const copy = copyByLocale[locale];
  return buildLocalizedMetadata({
    locale,
    country,
    pathname: '/for-providers',
    title: copy.metadataTitle,
    description: copy.metadataDescription
  });
}

export default async function PublicProviderPlansPage({ params }: { params: Promise<Params> }) {
  const { locale, country } = await params;

  if (!isSupportedLocale(locale) || !isSupportedCountry(country)) notFound();

  const copy = copyByLocale[locale];
  const dir = localeDirection(locale);

  return (
    <main className="provider-onboarding-page" dir={dir} data-locale={locale} data-country={country}>
      <section className="provider-onboarding-hero" aria-labelledby="provider-onboarding-title">
        <div className="provider-onboarding-hero__copy">
          <span className="dm2026-badge">{copy.badge}</span>
          <h1 id="provider-onboarding-title">{copy.title}</h1>
          <p>{copy.description}</p>
          <div className="provider-onboarding-hero__actions" aria-label={copy.badge}>
            <a className="dm2026-button dm2026-button-primary" href="#provider-onboarding-form">
              {copy.primaryCta}
            </a>
            <span className="dm2026-button dm2026-button-secondary" aria-label={copy.secondaryCta}>
              {copy.secondaryCta}
            </span>
          </div>
          <p className="provider-onboarding-hero__note">{copy.heroNote}</p>
        </div>

        <aside className="provider-onboarding-audience" aria-labelledby="provider-onboarding-audience-title">
          <h2 id="provider-onboarding-audience-title">{copy.audienceTitle}</h2>
          <ul>
            {copy.audienceItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="provider-onboarding-section" aria-labelledby="provider-onboarding-values-title">
        <h2 id="provider-onboarding-values-title">{copy.valuesTitle}</h2>
        <div className="provider-onboarding-card-grid">
          {copy.values.map((value) => (
            <article className="provider-onboarding-card" key={value.title}>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="provider-onboarding-section provider-onboarding-section--split" aria-labelledby="provider-onboarding-process-title">
        <div>
          <h2 id="provider-onboarding-process-title">{copy.processTitle}</h2>
          <ol className="provider-onboarding-steps">
            {copy.processSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
        <div className="provider-onboarding-disclaimer" aria-labelledby="provider-onboarding-disclaimer-title">
          <h2 id="provider-onboarding-disclaimer-title">{copy.disclaimerTitle}</h2>
          <ul>
            {copy.disclaimerItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="provider-onboarding-form" className="provider-onboarding-section provider-onboarding-section--form" aria-label={copy.form.title}>
        <ProviderOnboardingForm locale={locale} copy={copy.form} />
      </section>

      <style>{`
        .provider-onboarding-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 8% 10%, rgba(14, 116, 105, 0.16), transparent 30rem),
            linear-gradient(180deg, #f7fbfa 0%, #ffffff 42%, #f6faf9 100%);
          color: #102724;
          padding: clamp(1.25rem, 3vw, 2.5rem);
        }

        .provider-onboarding-hero,
        .provider-onboarding-section {
          width: min(1120px, 100%);
          margin-inline: auto;
        }

        .provider-onboarding-hero {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(18rem, 0.65fr);
          gap: clamp(1rem, 3vw, 2rem);
          align-items: stretch;
          padding-block: clamp(1.5rem, 4vw, 3.5rem);
        }

        .provider-onboarding-hero__copy,
        .provider-onboarding-audience,
        .provider-onboarding-card,
        .provider-onboarding-disclaimer,
        .provider-onboarding-form {
          border: 1px solid rgba(15, 118, 110, 0.14);
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.88);
          box-shadow: 0 24px 80px rgba(15, 45, 42, 0.08);
        }

        .provider-onboarding-hero__copy {
          padding: clamp(1.4rem, 4vw, 3rem);
        }

        .provider-onboarding-hero h1 {
          max-width: 12ch;
          margin: 1rem 0;
          font-size: clamp(2.25rem, 7vw, 5.25rem);
          line-height: 0.96;
          letter-spacing: -0.06em;
        }

        [dir='rtl'] .provider-onboarding-hero h1 {
          letter-spacing: -0.02em;
          line-height: 1.08;
        }

        .provider-onboarding-hero p,
        .provider-onboarding-card p,
        .provider-onboarding-form p,
        .provider-onboarding-form span,
        .provider-onboarding-disclaimer li,
        .provider-onboarding-steps li {
          color: #49615e;
          line-height: 1.7;
        }

        .provider-onboarding-hero__copy > p {
          max-width: 68ch;
          font-size: clamp(1rem, 2vw, 1.18rem);
        }

        .provider-onboarding-hero__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          margin-block: 1.4rem 0.8rem;
        }

        .provider-onboarding-hero__note {
          margin: 0;
          font-size: 0.93rem;
        }

        .provider-onboarding-audience {
          padding: clamp(1.2rem, 3vw, 2rem);
        }

        .provider-onboarding-audience h2,
        .provider-onboarding-section h2,
        .provider-onboarding-form h2 {
          margin: 0 0 1rem;
          font-size: clamp(1.45rem, 3vw, 2.25rem);
          letter-spacing: -0.03em;
        }

        .provider-onboarding-audience ul,
        .provider-onboarding-disclaimer ul {
          display: grid;
          gap: 0.7rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .provider-onboarding-audience li,
        .provider-onboarding-disclaimer li {
          border-radius: 999px;
          background: rgba(14, 116, 105, 0.08);
          padding: 0.72rem 0.9rem;
          font-weight: 700;
        }

        .provider-onboarding-section {
          padding-block: clamp(1rem, 3vw, 2rem);
        }

        .provider-onboarding-card-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1rem;
        }

        .provider-onboarding-card {
          padding: 1.2rem;
        }

        .provider-onboarding-card h3 {
          margin: 0 0 0.6rem;
          font-size: 1.08rem;
        }

        .provider-onboarding-card p {
          margin: 0;
          font-size: 0.95rem;
        }

        .provider-onboarding-section--split {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 1rem;
        }

        .provider-onboarding-steps {
          display: grid;
          gap: 0.8rem;
          margin: 0;
          padding-inline-start: 1.4rem;
        }

        [dir='rtl'] .provider-onboarding-steps {
          padding-inline-start: 0;
          padding-inline-end: 1.4rem;
        }

        .provider-onboarding-steps li {
          padding-inline-start: 0.4rem;
          font-weight: 700;
        }

        .provider-onboarding-disclaimer {
          padding: clamp(1rem, 3vw, 1.5rem);
          background: rgba(255, 250, 235, 0.9);
          border-color: rgba(180, 83, 9, 0.18);
        }

        .provider-onboarding-disclaimer li {
          background: rgba(180, 83, 9, 0.08);
          border-radius: 18px;
          font-weight: 600;
        }

        .provider-onboarding-section--form {
          padding-bottom: clamp(2rem, 5vw, 4rem);
        }

        .provider-onboarding-form {
          display: grid;
          gap: 1rem;
          padding: clamp(1.2rem, 4vw, 2rem);
        }

        .provider-onboarding-form__intro p,
        .provider-onboarding-form__intro span {
          margin: 0;
        }

        .provider-onboarding-form__grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.9rem;
        }

        .provider-onboarding-form label {
          display: grid;
          gap: 0.42rem;
          font-weight: 800;
          color: #183b37;
        }

        .provider-onboarding-form input,
        .provider-onboarding-form select,
        .provider-onboarding-form textarea {
          width: 100%;
          border: 1px solid rgba(15, 118, 110, 0.22);
          border-radius: 16px;
          background: #ffffff;
          color: #102724;
          font: inherit;
          padding: 0.85rem 0.95rem;
        }

        .provider-onboarding-form input:focus,
        .provider-onboarding-form select:focus,
        .provider-onboarding-form textarea:focus {
          outline: 3px solid rgba(14, 116, 105, 0.18);
          border-color: rgba(14, 116, 105, 0.72);
        }

        .provider-onboarding-form__message,
        .provider-onboarding-form__consent,
        .provider-onboarding-form__submit,
        .provider-onboarding-form__status {
          grid-column: 1 / -1;
        }

        .provider-onboarding-form__consent {
          display: flex !important;
          align-items: flex-start;
          gap: 0.7rem;
          border-radius: 18px;
          background: rgba(14, 116, 105, 0.08);
          padding: 0.9rem;
        }

        .provider-onboarding-form__consent input {
          width: auto;
          margin-top: 0.28rem;
        }

        .provider-onboarding-form__website {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          clip-path: inset(50%);
          white-space: nowrap;
        }

        .provider-onboarding-form__submit {
          justify-self: start;
          border: 0;
          cursor: pointer;
        }

        [dir='rtl'] .provider-onboarding-form__submit {
          justify-self: end;
        }

        .provider-onboarding-form__status {
          min-height: 1.5rem;
          margin: 0;
          font-weight: 800;
        }

        .provider-onboarding-form__status--success {
          color: #0f766e;
        }

        .provider-onboarding-form__status--error {
          color: #b42318;
        }

        @media (max-width: 900px) {
          .provider-onboarding-hero,
          .provider-onboarding-section--split,
          .provider-onboarding-card-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .provider-onboarding-page {
            padding: 0.9rem;
          }

          .provider-onboarding-form__grid {
            grid-template-columns: 1fr;
          }

          .provider-onboarding-hero__actions .dm2026-button,
          .provider-onboarding-form__submit {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </main>
  );
}
