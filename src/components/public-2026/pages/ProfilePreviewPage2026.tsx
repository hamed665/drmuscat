import Link from "next/link";
import type { ReactNode } from "react";

import { ModeratedComments2026 } from "@/components/public-2026/ui/ModeratedComments2026";
import { ReviewsRatings2026 } from "@/components/public-2026/ui/ReviewsRatings2026";
import type { SupportedCountry, SupportedLocale } from "@/lib/i18n/config";
import {
  homeRoute,
  publicArticlesRoute,
  publicDiscoveryRoute,
  publicListYourCenterRoute,
} from "@/lib/routes/public";

export type ProfilePreviewKind =
  | "doctor"
  | "center"
  | "pharmacy"
  | "lab"
  | "service";

type ProfilePreviewPage2026Props = {
  locale: SupportedLocale;
  country: SupportedCountry;
  kind: ProfilePreviewKind;
  slug: string;
};

type ProfileCopy = {
  badge: string;
  name: string;
  category: string;
  location: string;
  hours: string;
  affiliation: string;
  description: string;
  languages: readonly string[];
  services: readonly string[];
  practical: readonly string[];
  safety: string;
  relatedRoute:
    | "doctors"
    | "centers"
    | "pharmacies"
    | "labs"
    | "services"
    | "search";
};

const ui = {
  en: {
    home: "Home",
    preview: "Approved profile preview",
    noReviews: "No reviews yet",
    reviewsModerated: "Reviews appear after moderation",
    whatsapp: "WhatsApp",
    call: "Call",
    directions: "Directions",
    save: "Save",
    share: "Share",
    claim: "Claim / request update",
    report: "Report issue",
    contactNotice: "Contact details will appear after approval.",
    about: "About",
    services: "Services and interests",
    affiliation: "Affiliation and credentials",
    practical: "Practical information",
    gallery: "Gallery and media",
    offers: "Offers and packages",
    map: "Location and map preview",
    nearby: "Nearby and related providers",
    faq: "Frequently asked questions",
    reviews: "Ratings and reviews",
    comments: "Profile comments",
    safetyTitle: "Medical and discovery safety note",
    articles: "Related articles",
    listCta: "Manage this provider?",
    listBody:
      "Request listing review, claim support, or correction before public launch.",
    listButton: "Request listing review",
    video: "Video placeholder",
    galleryEmpty:
      "Media appears only after review. This preview uses polished placeholders instead of fake photos.",
    offersEmpty:
      "Offers/packages appear only after approval and are not active in this frontend preview.",
    mapBody:
      "Map and directions will use approved public address data. Confirm location directly before visiting.",
    faqItems: [
      [
        "Can I book directly through DrMuscat?",
        "No. This frontend preview does not provide booking. Contact the provider directly after approval.",
      ],
      [
        "Are ratings verified?",
        "No average rating is shown until moderated reviews are available.",
      ],
      [
        "Should I confirm availability before visiting?",
        "Yes. Confirm hours, services, prices, and requirements directly.",
      ],
      [
        "Is this medical advice?",
        "No. The profile is for discovery only and does not diagnose or treat.",
      ],
      [
        "How do I report incorrect information?",
        "Use the claim/request update or report issue action when available.",
      ],
    ],
  },
  ar: {
    home: "الرئيسية",
    preview: "معاينة ملف معتمد",
    noReviews: "لا توجد مراجعات بعد",
    reviewsModerated: "تظهر المراجعات بعد المراجعة",
    whatsapp: "واتساب",
    call: "اتصال",
    directions: "الاتجاهات",
    save: "حفظ",
    share: "مشاركة",
    claim: "مطالبة / طلب تحديث",
    report: "الإبلاغ عن مشكلة",
    contactNotice: "ستظهر بيانات التواصل بعد الاعتماد.",
    about: "نبذة",
    services: "الخدمات والاهتمامات",
    affiliation: "الارتباط والاعتمادات",
    practical: "معلومات عملية",
    gallery: "المعرض والوسائط",
    offers: "العروض والباقات",
    map: "الموقع ومعاينة الخريطة",
    nearby: "مقدمو رعاية قريبون ومرتبطون",
    faq: "الأسئلة الشائعة",
    reviews: "التقييمات والمراجعات",
    comments: "تعليقات الملف",
    safetyTitle: "ملاحظة السلامة الطبية والاكتشاف",
    articles: "مقالات ذات صلة",
    listCta: "هل تدير هذا المقدم؟",
    listBody:
      "اطلب مراجعة القائمة أو دعم المطالبة أو التصحيح قبل الإطلاق العام.",
    listButton: "اطلب مراجعة القائمة",
    video: "معاينة فيديو",
    galleryEmpty:
      "تظهر الوسائط فقط بعد المراجعة. تستخدم هذه المعاينة عناصر مصقولة بدلاً من صور مزيفة.",
    offersEmpty:
      "تظهر العروض والباقات فقط بعد الاعتماد وليست مفعلة في هذه المعاينة الأمامية.",
    mapBody:
      "ستستخدم الخريطة والاتجاهات بيانات العنوان العامة المعتمدة. أكد الموقع مباشرة قبل الزيارة.",
    faqItems: [
      [
        "هل يمكنني الحجز مباشرة عبر دكتور مسقط؟",
        "لا. هذه المعاينة الأمامية لا توفر الحجز. تواصل مباشرة مع مقدم الرعاية بعد الاعتماد.",
      ],
      [
        "هل التقييمات موثقة؟",
        "لا يتم عرض متوسط تقييم حتى تتوفر مراجعات خاضعة للمراجعة.",
      ],
      [
        "هل يجب تأكيد التوفر قبل الزيارة؟",
        "نعم. أكد الساعات والخدمات والأسعار والمتطلبات مباشرة.",
      ],
      ["هل هذا نصيحة طبية؟", "لا. الملف للاكتشاف فقط ولا يشخص أو يعالج."],
      [
        "كيف أبلغ عن معلومات غير صحيحة؟",
        "استخدم إجراء المطالبة أو طلب التحديث أو الإبلاغ عند توفره.",
      ],
    ],
  },
} as const;

const profiles: Record<
  SupportedLocale,
  Record<ProfilePreviewKind, ProfileCopy>
> = {
  en: {
    doctor: {
      badge: "Doctor profile",
      name: "Doctor profile preview",
      category: "General medicine",
      location: "Muscat · Al Khuwair",
      hours: "Hours shown after profile approval",
      affiliation: "Current clinic affiliation shown when verified",
      description:
        "A complete doctor profile preview with specialty, languages, education, experience, practice location, reviews, comments, FAQ, and safety notes.",
      languages: ["English", "Arabic"],
      services: [
        "General medicine discovery",
        "Specialty interests shown when verified",
        "Practice location contact actions",
      ],
      practical: [
        "Experience shown when verified",
        "Education shown when verified",
        "Insurance/payment details shown when approved",
        "No fake ratings or booking claims",
      ],
      safety:
        "Confirm availability, credentials, consultation location, fees, and visit requirements directly with the doctor or clinic. This profile does not provide medical advice.",
      relatedRoute: "doctors",
    },
    center: {
      badge: "Clinic / medical center profile",
      name: "Medical center profile preview",
      category: "Medical center",
      location: "Muscat · Al Khuwair",
      hours: "Open hours shown after approval",
      affiliation: "Departments and doctors appear after review",
      description:
        "A center profile preview with services, departments, doctors, gallery, video, offers, practical information, reviews, comments, and claim support.",
      languages: ["Arabic", "English"],
      services: [
        "General clinic services",
        "Departments shown after review",
        "Doctors/providers at this center",
      ],
      practical: [
        "Basic profile: limited public details",
        "Plus: logo, cover, gallery up to 6",
        "Premium: offers, richer gallery, SEO article mention",
        "Enterprise: branches and departments preview",
      ],
      safety:
        "Confirm services, opening hours, insurance/payment, accessibility, and appointment requirements directly with the center.",
      relatedRoute: "centers",
    },
    pharmacy: {
      badge: "Pharmacy profile",
      name: "Pharmacy profile preview",
      category: "Pharmacy",
      location: "Seeb · Al Hail",
      hours: "Call directly to confirm hours",
      affiliation:
        "Prescription support and delivery labels appear only after review",
      description:
        "A pharmacy profile preview focused on practical contact, services, medicine-availability confirmation, FAQ, reviews, and safety notes.",
      languages: ["Arabic", "English"],
      services: [
        "Prescription support placeholder",
        "Medicine availability confirmation note",
        "Delivery label preview when approved",
        "Home care / wellness categories",
      ],
      practical: [
        "No medicine availability guarantee",
        "Call before relying on hours",
        "Prices confirmed directly",
        "No medical advice",
      ],
      safety:
        "Confirm medicine availability, prescription requirements, delivery, opening hours, and prices directly with the pharmacy.",
      relatedRoute: "pharmacies",
    },
    lab: {
      badge: "Laboratory profile",
      name: "Laboratory profile preview",
      category: "Medical laboratory",
      location: "Ruwi · Muscat",
      hours: "Confirm test timing directly",
      affiliation:
        "Test categories and sample collection labels appear after review",
      description:
        "A laboratory profile preview with diagnostics services, preparation notes, map, reviews, comments, FAQ, and safety notes.",
      languages: ["Arabic", "English"],
      services: [
        "Blood tests",
        "Diagnostic tests",
        "Sample collection placeholder",
        "Preparation instruction note",
      ],
      practical: [
        "Confirm test availability directly",
        "Confirm preparation requirements",
        "Confirm reporting timing",
        "No diagnosis claims",
      ],
      safety:
        "Confirm test availability, preparation requirements, timing, reporting details, and prices directly with the laboratory.",
      relatedRoute: "labs",
    },
    service: {
      badge: "Service provider profile",
      name: "Wellness and pet care provider preview",
      category: "Wellness / pet care / service provider",
      location: "Muscat · Qurum",
      hours: "Confirm directly before visiting",
      affiliation: "Packages and provider team appear after review",
      description:
        "A service provider preview for wellness, beauty, physiotherapy, nutrition, or veterinary discovery with no outcome guarantees.",
      languages: ["Arabic", "English"],
      services: [
        "Wellness service labels",
        "Pet clinic / veterinary service labels",
        "Physiotherapy and nutrition discovery",
        "Packages/offers after approval",
      ],
      practical: [
        "No guaranteed results",
        "Veterinary care is not human medical care",
        "Confirm category and service directly",
        "No emergency availability claims",
      ],
      safety:
        "Confirm services, suitability, prices, timing, and provider requirements directly. Wellness/beauty results are not guaranteed; pet clinic care is veterinary care.",
      relatedRoute: "services",
    },
  },
  ar: {
    doctor: {
      badge: "ملف طبيب",
      name: "معاينة ملف طبيب",
      category: "طب عام",
      location: "مسقط · الخوير",
      hours: "تظهر الساعات بعد اعتماد الملف",
      affiliation: "يظهر ارتباط العيادة الحالية عند التحقق",
      description:
        "معاينة ملف طبيب كاملة تتضمن التخصص واللغات والتعليم والخبرة وموقع الممارسة والمراجعات والتعليقات والأسئلة وملاحظات السلامة.",
      languages: ["العربية", "الإنجليزية"],
      services: [
        "اكتشاف الطب العام",
        "تظهر اهتمامات التخصص عند التحقق",
        "إجراءات تواصل موقع الممارسة",
      ],
      practical: [
        "تظهر الخبرة عند التحقق",
        "يظهر التعليم عند التحقق",
        "تظهر معلومات التأمين/الدفع عند الاعتماد",
        "لا تقييمات أو ادعاءات حجز مزيفة",
      ],
      safety:
        "أكد التوفر والاعتمادات وموقع الاستشارة والرسوم ومتطلبات الزيارة مباشرة مع الطبيب أو العيادة. هذا الملف لا يقدم نصيحة طبية.",
      relatedRoute: "doctors",
    },
    center: {
      badge: "ملف عيادة / مركز طبي",
      name: "معاينة ملف مركز طبي",
      category: "مركز طبي",
      location: "مسقط · الخوير",
      hours: "تظهر ساعات العمل بعد الاعتماد",
      affiliation: "تظهر الأقسام والأطباء بعد المراجعة",
      description:
        "معاينة ملف مركز تتضمن الخدمات والأقسام والأطباء والمعرض والفيديو والعروض والمعلومات العملية والمراجعات والتعليقات ودعم المطالبة.",
      languages: ["العربية", "الإنجليزية"],
      services: [
        "خدمات عيادة عامة",
        "تظهر الأقسام بعد المراجعة",
        "أطباء ومقدمو رعاية في هذا المركز",
      ],
      practical: [
        "Basic: تفاصيل عامة محدودة",
        "Plus: شعار وغلاف ومعرض حتى 6",
        "Premium: عروض ومعرض أوسع وذكر مقال SEO",
        "Enterprise: معاينة الفروع والأقسام",
      ],
      safety:
        "أكد الخدمات وساعات العمل والتأمين/الدفع وإمكانية الوصول ومتطلبات المواعيد مباشرة مع المركز.",
      relatedRoute: "centers",
    },
    pharmacy: {
      badge: "ملف صيدلية",
      name: "معاينة ملف صيدلية",
      category: "صيدلية",
      location: "السيب · الحيل",
      hours: "اتصل مباشرة لتأكيد الساعات",
      affiliation: "تظهر وسوم دعم الوصفة والتوصيل فقط بعد المراجعة",
      description:
        "معاينة ملف صيدلية تركز على التواصل العملي والخدمات وتأكيد توفر الأدوية والأسئلة والمراجعات وملاحظات السلامة.",
      languages: ["العربية", "الإنجليزية"],
      services: [
        "معاينة دعم الوصفة",
        "ملاحظة تأكيد توفر الدواء",
        "وسم توصيل عند الاعتماد",
        "فئات رعاية منزلية/عافية",
      ],
      practical: [
        "لا ضمان لتوفر الدواء",
        "اتصل قبل الاعتماد على الساعات",
        "تؤكد الأسعار مباشرة",
        "لا نصيحة طبية",
      ],
      safety:
        "أكد توفر الدواء ومتطلبات الوصفة والتوصيل وساعات العمل والأسعار مباشرة مع الصيدلية.",
      relatedRoute: "pharmacies",
    },
    lab: {
      badge: "ملف مختبر",
      name: "معاينة ملف مختبر",
      category: "مختبر طبي",
      location: "روي · مسقط",
      hours: "أكد توقيت الفحص مباشرة",
      affiliation: "تظهر فئات الفحوصات ووسوم سحب العينات بعد المراجعة",
      description:
        "معاينة ملف مختبر تتضمن خدمات التشخيص وملاحظات التحضير والخريطة والمراجعات والتعليقات والأسئلة وملاحظات السلامة.",
      languages: ["العربية", "الإنجليزية"],
      services: [
        "تحاليل دم",
        "فحوصات تشخيصية",
        "معاينة سحب عينات",
        "ملاحظة تعليمات التحضير",
      ],
      practical: [
        "أكد توفر الفحص مباشرة",
        "أكد متطلبات التحضير",
        "أكد توقيت النتائج",
        "لا ادعاءات تشخيص",
      ],
      safety:
        "أكد توفر الفحص ومتطلبات التحضير والتوقيت وتفاصيل النتائج والأسعار مباشرة مع المختبر.",
      relatedRoute: "labs",
    },
    service: {
      badge: "ملف مقدم خدمة",
      name: "معاينة مقدم عافية ورعاية حيوانات",
      category: "عافية / رعاية حيوانات / مقدم خدمة",
      location: "مسقط · القرم",
      hours: "أكد مباشرة قبل الزيارة",
      affiliation: "تظهر الباقات وفريق المقدم بعد المراجعة",
      description:
        "معاينة مقدم خدمة للعافية أو التجميل أو العلاج الطبيعي أو التغذية أو الرعاية البيطرية دون ضمان نتائج.",
      languages: ["العربية", "الإنجليزية"],
      services: [
        "وسوم خدمات العافية",
        "وسوم عيادة بيطرية",
        "اكتشاف علاج طبيعي وتغذية",
        "باقات/عروض بعد الاعتماد",
      ],
      practical: [
        "لا ضمان للنتائج",
        "الرعاية البيطرية ليست رعاية طبية بشرية",
        "أكد الفئة والخدمة مباشرة",
        "لا ادعاءات توفر طارئ",
      ],
      safety:
        "أكد الخدمات والملاءمة والأسعار والتوقيت ومتطلبات مقدم الرعاية مباشرة. نتائج العافية/التجميل غير مضمونة؛ ورعاية الحيوانات رعاية بيطرية.",
      relatedRoute: "services",
    },
  },
};

export const profilePreviewSlugs2026: Record<
  ProfilePreviewKind,
  readonly string[]
> = {
  doctor: [
    "doctor-profile-preview",
    "pediatrics-profile-preview",
    "dental-doctor-preview",
    "physiotherapy-profile-preview",
  ],
  center: [
    "medical-center-preview",
    "dental-clinic-preview",
    "wellness-provider-preview",
    "pet-clinic-preview",
    "al-khuwair-medical-centre",
  ],
  pharmacy: [
    "pharmacy-preview",
    "delivery-pharmacy-preview",
    "wellness-pharmacy-preview",
    "24-hour-label-preview",
    "seeb-family-pharmacy",
  ],
  lab: [
    "medical-lab-preview",
    "home-sample-preview",
    "diagnostic-center-preview",
    "lab-package-preview",
    "ruwi-diagnostic-laboratory",
  ],
  service: [
    "dental-care",
    "lab-tests",
    "pharmacy-services",
    "pet-care",
    "service-provider-preview",
  ],
};

export function profilePreviewKindForCenterSlug2026(
  slug: string,
): Exclude<ProfilePreviewKind, "doctor"> | null {
  if (profilePreviewSlugs2026.center.includes(slug)) return "center";
  if (profilePreviewSlugs2026.pharmacy.includes(slug)) return "pharmacy";
  if (profilePreviewSlugs2026.lab.includes(slug)) return "lab";
  if (profilePreviewSlugs2026.service.includes(slug)) return "service";
  return null;
}

export function isDoctorProfilePreviewSlug2026(slug: string) {
  return profilePreviewSlugs2026.doctor.includes(slug);
}

export function ProfilePreviewPage2026({
  locale,
  country,
  kind,
  slug,
}: ProfilePreviewPage2026Props) {
  const text = ui[locale];
  const profile = profiles[locale][kind];
  const isArabic = locale === "ar";
  const relatedRoutes = ([profile.relatedRoute, "search", "services"] as const).filter(
    (route, index, routes) => routes.indexOf(route) === index,
  );

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="mt-8 space-y-6 text-slate-950"
    >
      <nav
        aria-label={isArabic ? "مسار الصفحة" : "Breadcrumb"}
        className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-500"
      >
        <Link
          href={homeRoute(locale, country)}
          className="hover:text-emerald-700"
        >
          {text.home}
        </Link>
        <span>/</span>
        <Link
          href={publicDiscoveryRoute(locale, country, profile.relatedRoute)}
          className="hover:text-emerald-700"
        >
          {profile.category}
        </Link>
        <span>/</span>
        <span className="text-slate-800">{profile.name}</span>
      </nav>

      <section className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-xl shadow-emerald-900/10 lg:grid lg:grid-cols-[1fr_21rem]">
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
              {text.preview}
            </span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-900">
              {text.noReviews}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
              {profile.category}
            </span>
          </div>
          <div className="mt-6 flex flex-col gap-5 sm:flex-row">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-[2rem] bg-gradient-to-br from-emerald-100 via-cyan-50 to-white text-4xl font-black text-emerald-800 shadow-inner">
              {profile.name.slice(0, 1)}
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                {profile.name}
              </h1>
              <p className="mt-3 text-base font-bold text-slate-600">
                {profile.location} · {profile.hours}
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-650">
                {profile.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.languages.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <ProfileActionPanel text={text} />
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="space-y-6">
          <ProfileSection title={text.about}>
            <p>{profile.description}</p>
            <p className="mt-3 font-semibold text-slate-700">
              {profile.affiliation}
            </p>
          </ProfileSection>
          <ProfileSection title={text.services}>
            <div className="grid gap-3 sm:grid-cols-2">
              {profile.services.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </ProfileSection>
          <ProfileSection title={text.practical}>
            <div className="grid gap-3 sm:grid-cols-2">
              {profile.practical.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </ProfileSection>
          <ProfileSection title={text.gallery}>
            <div className="grid gap-3 sm:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-emerald-50 text-sm font-bold text-slate-500"
                >
                  {text.gallery}
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {text.galleryEmpty}
            </p>
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm font-bold text-slate-600">
              ▶ {text.video}
            </div>
          </ProfileSection>
          <ProfileSection title={text.offers}>
            <p>{text.offersEmpty}</p>
          </ProfileSection>
          <ProfileSection title={text.map}>
            <p>{text.mapBody}</p>
          </ProfileSection>
          <ProfileSection title={text.reviews}>
            <ReviewsRatings2026 locale={locale} />
          </ProfileSection>
          <ProfileSection title={text.comments}>
            <ModeratedComments2026 locale={locale} />
          </ProfileSection>
          <ProfileSection title={text.faq}>
            <div className="grid gap-3 md:grid-cols-2">
              {text.faqItems.map(([q, a]) => (
                <details
                  key={q}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <summary className="cursor-pointer font-black text-slate-950">
                    {q}
                  </summary>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{a}</p>
                </details>
              ))}
            </div>
          </ProfileSection>
          <ProfileSection title={text.safetyTitle}>
            <p>{profile.safety}</p>
          </ProfileSection>
        </div>
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <ProfileActionPanel text={text} compact />
          <ProfileSection title={text.nearby}>
            <div className="flex flex-wrap gap-2">
              {relatedRoutes.map((route) => (
                <Link
                  key={route}
                  href={publicDiscoveryRoute(locale, country, route)}
                  className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-800"
                >
                  {discoveryRouteLabel(locale, route)}
                </Link>
              ))}
            </div>
          </ProfileSection>
          <ProfileSection title={text.articles}>
            <Link
              href={publicArticlesRoute(locale, country)}
              className="rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white"
            >
              {text.articles}
            </Link>
          </ProfileSection>
          <section className="rounded-[2rem] bg-slate-950 p-5 text-white">
            <h2 className="text-xl font-black">{text.listCta}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {text.listBody}
            </p>
            <Link
              href={publicListYourCenterRoute(locale, country)}
              className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-black text-slate-950"
            >
              {text.listButton}
            </Link>
          </section>
        </aside>
      </div>
      <p className="text-xs font-semibold text-slate-400">
        preview-slug: {slug}
      </p>
    </main>
  );
}

function discoveryRouteLabel(
  locale: SupportedLocale,
  route: ProfileCopy["relatedRoute"],
) {
  const labels = {
    en: {
      doctors: "Doctors",
      centers: "Centers",
      pharmacies: "Pharmacies",
      labs: "Labs",
      services: "Services",
      search: "Search",
    },
    ar: {
      doctors: "الأطباء",
      centers: "المراكز",
      pharmacies: "الصيدليات",
      labs: "المختبرات",
      services: "الخدمات",
      search: "البحث",
    },
  } as const;

  return labels[locale][route];
}

function ProfileActionPanel({
  text,
  compact = false,
}: {
  text: typeof ui.en | typeof ui.ar;
  compact?: boolean;
}) {
  return (
    <div
      className={`${compact ? "rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm" : "border-t border-slate-100 bg-slate-50 p-6 lg:border-l lg:border-t-0"} flex flex-col justify-center gap-3`}
    >
      <button
        type="button"
        className="min-h-11 rounded-full bg-emerald-600 px-5 py-3 text-center text-sm font-black text-white shadow-sm hover:bg-emerald-700"
      >
        {text.whatsapp}
      </button>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="min-h-11 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700"
        >
          {text.call}
        </button>
        <button
          type="button"
          className="min-h-11 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700"
        >
          {text.directions}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="min-h-11 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700"
        >
          {text.save}
        </button>
        <button
          type="button"
          className="min-h-11 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700"
        >
          {text.share}
        </button>
      </div>
      <button
        type="button"
        className="min-h-11 rounded-full border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-black text-amber-900"
      >
        {text.claim}
      </button>
      <button
        type="button"
        className="min-h-11 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700"
      >
        {text.report}
      </button>
      <p className="rounded-2xl bg-white px-4 py-3 text-xs font-semibold leading-5 text-slate-500">
        {text.contactNotice}
      </p>
    </div>
  );
}

function ProfileSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black text-slate-950">{title}</h2>
      <div className="mt-4 text-sm leading-7 text-slate-650">{children}</div>
    </section>
  );
}
