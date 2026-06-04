"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";

import { drMuscatSupportWhatsAppUrl } from "@/components/public-2026/home/support-contact-2026";
import {
  countryOptions2026,
  getAreaOptionsForCity2026,
  omanCityOptions2026,
} from "@/components/public-2026/location/location-options-2026";
import type { SupportedCountry, SupportedLocale } from "@/lib/i18n/config";
import {
  homeRoute,
  publicArticleDetailRoute,
  publicArticlesRoute,
  publicCenterDetailRoute,
  publicDiscoveryRoute,
  publicDoctorDetailRoute,
  publicListYourCenterRoute,
  publicProviderRoute,
} from "@/lib/routes/public";

type DiscoveryKind =
  | "doctors"
  | "centers"
  | "pharmacies"
  | "labs"
  | "services"
  | "search";

type Props = {
  locale: SupportedLocale;
  country: SupportedCountry;
  kind: DiscoveryKind;
  liveContent?: ReactNode;
};

type Faq = { q: string; a: string };
type DiscoveryCard = {
  name: string;
  category: string;
  location: string;
  hours: string;
  description: string;
  tags: readonly string[];
  meta: readonly string[];
  serviceNote?: string;
};

type PageCopy = {
  eyebrow: string;
  breadcrumb: string;
  title: string;
  subtitle: string;
  trustNote: string;
  searchPlaceholder: string;
  filtersTitle: string;
  country: string;
  city: string;
  area: string;
  allAreas: string;
  category: string;
  allCategories: string;
  sort: string;
  sorts: readonly string[];
  chips: readonly string[];
  resultsTitle: string;
  resultsNote: string;
  samplePreview: string;
  noReviews: string;
  reviewsModerated: string;
  view: string;
  whatsapp: string;
  call: string;
  directions: string;
  actionNotice: string;
  sponsored: string;
  sponsoredTitle: string;
  sponsoredBody: string;
  sponsoredDisclaimer: string;
  sponsoredCta: string;
  inListSponsoredTitle: string;
  sidebarSponsoredTitle: string;
  sidebarSponsoredBody: string;
  emptyTitle: string;
  emptyBody: string;
  nearbyTitle: string;
  categoryTitle: string;
  relatedArticlesTitle: string;
  seoTitle: string;
  seoParagraphs: readonly string[];
  faqTitle: string;
  faqs: readonly Faq[];
  safetyTitle: string;
  safety: string;
  providerCtaTitle: string;
  providerCtaBody: string;
  providerCtaButton: string;
  searchTabs?: readonly string[];
  groupedResultsTitle?: string;
  groupedResults?: readonly { label: string; body: string }[];
  cards: readonly DiscoveryCard[];
};

const common = {
  en: {
    eyebrow: "Healthcare discovery in Oman",
    breadcrumb: "Home",
    trustNote:
      "No paid placement is presented as medical quality. Confirm details directly before visiting.",
    filtersTitle: "Refine your discovery",
    country: "Country",
    city: "City",
    area: "Area",
    allAreas: "All areas",
    allCategories: "All categories",
    sort: "Sort",
    sorts: ["Recommended", "Nearby by area", "Recently updated", "A–Z"],
    samplePreview: "Sample preview listing",
    noReviews: "No reviews yet",
    reviewsModerated: "Reviews appear after moderation",
    view: "View profile",
    whatsapp: "WhatsApp",
    call: "Call",
    directions: "Directions",
    actionNotice:
      "Preview action only. Approved provider profiles will connect to real contact and profile actions later.",
    sponsored: "Sponsored",
    sponsoredDisclaimer:
      "Sponsored placement is paid visibility, not medical quality ranking. Always confirm details directly with the provider.",
    sponsoredCta: "Learn about provider visibility",
    emptyTitle: "No live filtered results yet",
    emptyBody:
      "This frontend preview shows how approved listings will appear after provider data is reviewed. Try a broader area or contact DrMuscat support.",
    nearbyTitle: "Nearby areas to explore",
    categoryTitle: "Related categories and services",
    relatedArticlesTitle: "Related articles and guides",
    safetyTitle: "Discovery and safety note",
    safety:
      "DrMuscat is a healthcare discovery platform. It does not provide diagnosis, treatment, emergency guidance, or medical quality rankings. Confirm availability, credentials, services, preparation instructions, prices, and contact details directly with the provider.",
  },
  ar: {
    eyebrow: "اكتشاف الرعاية الصحية في عُمان",
    breadcrumb: "الرئيسية",
    trustNote:
      "لا يتم تقديم الظهور المدفوع كتصنيف لجودة الرعاية الطبية. يرجى تأكيد التفاصيل مباشرة قبل الزيارة.",
    filtersTitle: "خصص بحثك",
    country: "الدولة",
    city: "المدينة",
    area: "المنطقة",
    allAreas: "كل المناطق",
    allCategories: "كل الفئات",
    sort: "الترتيب",
    sorts: ["موصى به", "بالقرب من المنطقة", "محدث مؤخراً", "أ–ي"],
    samplePreview: "معاينة قائمة نموذجية",
    noReviews: "لا توجد مراجعات بعد",
    reviewsModerated: "تظهر المراجعات بعد المراجعة",
    view: "عرض الملف",
    whatsapp: "واتساب",
    call: "اتصال",
    directions: "الاتجاهات",
    actionNotice:
      "إجراء معاينة فقط. سيتم ربط ملفات مقدمي الرعاية المعتمدة بإجراءات تواصل وملفات حقيقية لاحقاً.",
    sponsored: "ممَوّل",
    sponsoredDisclaimer:
      "الموضع الممول يعني ظهوراً مدفوعاً ولا يعني تصنيفاً لجودة الرعاية الطبية. يرجى دائماً تأكيد التفاصيل مباشرة مع مقدم الخدمة.",
    sponsoredCta: "تعرف على ظهور مقدمي الرعاية",
    emptyTitle: "لا توجد نتائج مباشرة مصفاة حالياً",
    emptyBody:
      "تعرض هذه المعاينة الأمامية طريقة ظهور القوائم المعتمدة بعد مراجعة بيانات مقدمي الرعاية. جرّب منطقة أوسع أو تواصل مع دعم دكتور مسقط.",
    nearbyTitle: "مناطق قريبة للاستكشاف",
    categoryTitle: "فئات وخدمات ذات صلة",
    relatedArticlesTitle: "مقالات وأدلة ذات صلة",
    safetyTitle: "ملاحظة الاكتشاف والسلامة",
    safety:
      "دكتور مسقط منصة لاكتشاف الرعاية الصحية. لا تقدم تشخيصاً أو علاجاً أو إرشاداً للطوارئ أو تصنيفاً لجودة الرعاية الطبية. يرجى تأكيد التوفر والاعتمادات والخدمات وتعليمات التحضير والأسعار وبيانات التواصل مباشرة مع مقدم الرعاية.",
  },
} as const satisfies Record<
  SupportedLocale,
  Record<string, string | readonly string[]>
>;

const pages = {
  doctors: {
    en: {
      title: "Find doctors in Oman",
      subtitle:
        "Search doctor profile previews by specialty, city, area, language, and care need without fake rankings or unsupported medical claims.",
      searchPlaceholder: "Search doctor name, specialty, clinic, or care need",
      category: "Specialty",
      chips: [
        "General medicine",
        "Dental",
        "Pediatrics",
        "Dermatology",
        "Eye care",
        "Physiotherapy",
        "Nutrition",
        "Women’s health",
        "ENT",
        "Orthopedics",
      ],
      resultsTitle: "Doctor profile previews",
      resultsNote:
        "Profile cards are frontend previews for approved public doctor data. Ratings are not fabricated.",
      sponsoredTitle: "Featured doctor visibility preview",
      sponsoredBody:
        "A future paid visibility slot can highlight an approved profile while staying separate from medical quality ranking.",
      inListSponsoredTitle: "Sponsored doctor profile slot",
      sidebarSponsoredTitle: "Featured in this area",
      sidebarSponsoredBody:
        "Future sponsored visibility for approved doctors in the selected city or area.",
      seoTitle: "Doctor discovery by specialty and area in Oman",
      seoParagraphs: [
        "Use DrMuscat to discover doctor profiles in Oman by specialty, city, area, and language preference. The page is designed for local discovery, not medical diagnosis.",
        "Doctor profile previews can show clinic affiliation, practical contact actions, languages, education or experience once verified, and review signals only after moderation.",
        "Always confirm clinic location, availability, credentials, fees, and visit requirements directly with the doctor or clinic before you go.",
      ],
      faqTitle: "Doctor discovery FAQ",
      faqs: [
        {
          q: "Can I book a doctor through DrMuscat?",
          a: "This preview does not provide booking. Contact actions can connect users to approved providers later.",
        },
        {
          q: "Are doctor ratings shown?",
          a: "Only honest review signals should appear. If no moderated reviews exist, the card says no reviews yet.",
        },
        {
          q: "How should I choose a doctor?",
          a: "Use specialty, city, area, language, and clinic information, then confirm details directly with the clinic.",
        },
        {
          q: "Should I confirm clinic details before visiting?",
          a: "Yes. Hours, locations, fees, and appointment rules should always be confirmed directly.",
        },
        {
          q: "Can doctors claim or update their profile?",
          a: "Future approved workflows can allow doctors or clinics to request listing review or claim support.",
        },
      ],
      providerCtaTitle: "Are you a doctor or clinic owner?",
      providerCtaBody:
        "Create or claim your public profile so patients can discover accurate contact, location, and service details.",
      providerCtaButton: "Create or claim your profile",
      cards: [
        {
          name: "Doctor profile preview",
          category: "General medicine",
          location: "Muscat · Al Khuwair",
          hours: "Hours shown after profile approval",
          description:
            "Sample doctor profile with clinic affiliation, languages, and practical contact details once approved.",
          tags: ["English", "Arabic", "Clinic affiliation"],
          meta: [
            "Experience shown when verified",
            "Education shown when verified",
          ],
        },
        {
          name: "Pediatrics profile preview",
          category: "Pediatrics",
          location: "Muscat · Qurum",
          hours: "Confirm hours directly",
          description:
            "Specialty-focused profile preview with service interests and no fabricated ratings or availability claims.",
          tags: ["Child health", "Family clinic", "Arabic"],
          meta: ["No reviews yet", "Reviews after moderation"],
        },
        {
          name: "Dental doctor preview",
          category: "Dental",
          location: "Bausher · Al Ghubrah",
          hours: "Call clinic before visiting",
          description:
            "A dentist listing preview that can link to clinic location, directions, and direct contact after approval.",
          tags: ["Dental care", "Clinic profile", "Directions"],
          meta: ["Education shown when verified"],
        },
        {
          name: "Physiotherapy profile preview",
          category: "Physiotherapy",
          location: "Seeb · Mawaleh",
          hours: "Availability not guaranteed",
          description:
            "A rehabilitation-focused preview with safe language and practical provider discovery signals.",
          tags: ["Movement care", "Arabic", "English"],
          meta: ["No fake ranking"],
        },
      ],
    },
    ar: {
      title: "ابحث عن أطباء في عُمان",
      subtitle:
        "ابحث في معاينات ملفات الأطباء حسب التخصص والمدينة والمنطقة واللغة دون تقييمات مزيفة أو ادعاءات طبية غير مدعومة.",
      searchPlaceholder:
        "ابحث باسم الطبيب أو التخصص أو العيادة أو الاحتياج الصحي",
      category: "التخصص",
      chips: [
        "طب عام",
        "أسنان",
        "أطفال",
        "جلدية",
        "عيون",
        "علاج طبيعي",
        "تغذية",
        "صحة المرأة",
        "أنف وأذن وحنجرة",
        "عظام",
      ],
      resultsTitle: "معاينات ملفات الأطباء",
      resultsNote:
        "بطاقات الملفات هي معاينات أمامية لبيانات أطباء عامة بعد الاعتماد. لا يتم اختلاق التقييمات.",
      sponsoredTitle: "معاينة ظهور طبيب ممول",
      sponsoredBody:
        "يمكن لموضع ظهور مدفوع مستقبلي إبراز ملف معتمد مع فصله بوضوح عن تصنيف جودة الرعاية الطبية.",
      inListSponsoredTitle: "موضع ملف طبيب ممول",
      sidebarSponsoredTitle: "مميز في هذه المنطقة",
      sidebarSponsoredBody:
        "ظهور ممول مستقبلي للأطباء المعتمدين في المدينة أو المنطقة المحددة.",
      seoTitle: "اكتشاف الأطباء حسب التخصص والمنطقة في عُمان",
      seoParagraphs: [
        "استخدم دكتور مسقط لاكتشاف ملفات الأطباء في عُمان حسب التخصص والمدينة والمنطقة وتفضيل اللغة. الصفحة مخصصة للاكتشاف المحلي وليست للتشخيص الطبي.",
        "يمكن لمعاينات ملفات الأطباء عرض الانتماء للعيادة وإجراءات التواصل العملية واللغات والتعليم أو الخبرة بعد التحقق، مع ظهور إشارات المراجعات فقط بعد المراجعة.",
        "يرجى دائماً تأكيد موقع العيادة والتوفر والاعتمادات والرسوم ومتطلبات الزيارة مباشرة مع الطبيب أو العيادة قبل الزيارة.",
      ],
      faqTitle: "أسئلة اكتشاف الأطباء",
      faqs: [
        {
          q: "هل يمكنني حجز طبيب عبر دكتور مسقط؟",
          a: "هذه المعاينة لا توفر الحجز. يمكن لإجراءات التواصل ربط المستخدمين بمقدمي الرعاية المعتمدين لاحقاً.",
        },
        {
          q: "هل تظهر تقييمات الأطباء؟",
          a: "يجب أن تظهر إشارات مراجعة صادقة فقط. إذا لم توجد مراجعات معتمدة، تظهر عبارة لا توجد مراجعات بعد.",
        },
        {
          q: "كيف أختار طبيباً؟",
          a: "استخدم التخصص والمدينة والمنطقة واللغة ومعلومات العيادة، ثم أكد التفاصيل مباشرة مع العيادة.",
        },
        {
          q: "هل يجب تأكيد تفاصيل العيادة قبل الزيارة؟",
          a: "نعم. يجب دائماً تأكيد الساعات والمواقع والرسوم وقواعد المواعيد مباشرة.",
        },
        {
          q: "هل يمكن للأطباء المطالبة بملفاتهم أو تحديثها؟",
          a: "يمكن لتدفقات مستقبلية معتمدة أن تسمح للأطباء أو العيادات بطلب مراجعة القائمة أو دعم المطالبة.",
        },
      ],
      providerCtaTitle: "هل أنت طبيب أو مالك عيادة؟",
      providerCtaBody:
        "أنشئ أو طالب بملفك العام حتى يتمكن المرضى من اكتشاف بيانات تواصل وموقع وخدمات دقيقة.",
      providerCtaButton: "أنشئ أو طالب بملفك",
      cards: [
        {
          name: "معاينة ملف طبيب",
          category: "طب عام",
          location: "مسقط · الخوير",
          hours: "تظهر الساعات بعد اعتماد الملف",
          description:
            "معاينة ملف طبيب تتضمن الانتماء للعيادة واللغات وتفاصيل التواصل العملية بعد الاعتماد.",
          tags: ["إنجليزية", "عربية", "انتماء للعيادة"],
          meta: ["تظهر الخبرة عند التحقق", "يظهر التعليم عند التحقق"],
        },
        {
          name: "معاينة طبيب أطفال",
          category: "أطفال",
          location: "مسقط · القرم",
          hours: "أكد الساعات مباشرة",
          description:
            "معاينة ملف تخصصي مع اهتمامات الخدمة ودون تقييمات أو ادعاءات توفر مختلقة.",
          tags: ["صحة الطفل", "عيادة عائلية", "العربية"],
          meta: ["لا توجد مراجعات بعد", "المراجعات بعد المراجعة"],
        },
        {
          name: "معاينة طبيب أسنان",
          category: "أسنان",
          location: "بوشر · الغبرة",
          hours: "اتصل بالعيادة قبل الزيارة",
          description:
            "معاينة طبيب أسنان يمكن أن ترتبط بموقع العيادة والاتجاهات والتواصل المباشر بعد الاعتماد.",
          tags: ["رعاية الأسنان", "ملف عيادة", "اتجاهات"],
          meta: ["يظهر التعليم عند التحقق"],
        },
        {
          name: "معاينة علاج طبيعي",
          category: "علاج طبيعي",
          location: "السيب · الموالح",
          hours: "لا يتم ضمان التوفر",
          description:
            "معاينة تركز على التأهيل بلغة آمنة وإشارات اكتشاف عملية لمقدم الرعاية.",
          tags: ["رعاية الحركة", "العربية", "الإنجليزية"],
          meta: ["لا يوجد ترتيب مزيف"],
        },
      ],
    },
  },
  centers: {
    en: {
      title: "Find clinics and medical centers in Oman",
      subtitle:
        "Browse clinics, medical centers, dental clinics, wellness providers, and diagnostics by category, city, and area.",
      searchPlaceholder: "Search center name, category, service, or area",
      category: "Center category",
      chips: [
        "Medical centers",
        "Dental clinics",
        "Beauty clinics",
        "Wellness centers",
        "Eye clinics",
        "Pet clinics",
        "Physiotherapy centers",
        "Diagnostic centers",
      ],
      resultsTitle: "Clinic and center previews",
      resultsNote:
        "Listings are sample previews for future approved center profiles and do not imply verified medical superiority.",
      sponsoredTitle: "Sponsored center visibility preview",
      sponsoredBody:
        "A paid placement area can help approved centers appear in a selected category or area while remaining clearly labeled.",
      inListSponsoredTitle: "Sponsored center listing slot",
      sidebarSponsoredTitle: "Featured centers in this area",
      sidebarSponsoredBody:
        "Future area/category visibility for approved centers, clinics, and groups.",
      seoTitle: "Clinic and medical center discovery in Oman",
      seoParagraphs: [
        "DrMuscat helps users discover clinics and medical centers in Oman by category, city, and area using practical public profile information.",
        "Center pages can support services, opening hours, languages, map previews, offers when available, and claim requests after approval.",
        "Users should confirm opening hours, services, insurance, accessibility, and appointment requirements directly with the center.",
      ],
      faqTitle: "Centers FAQ",
      faqs: [
        {
          q: "What types of centers are listed?",
          a: "The discovery experience can support medical centers, dental clinics, labs, wellness, physiotherapy, beauty, and pet clinics.",
        },
        {
          q: "Can a center claim its profile?",
          a: "A future approved claim flow can help centers request profile review and updates.",
        },
        {
          q: "Are opening hours guaranteed?",
          a: "No. Hours must be confirmed directly with the center before visiting.",
        },
        {
          q: "How do I contact a center?",
          a: "Approved profiles can show call, WhatsApp, directions, and profile actions.",
        },
        {
          q: "Can centers add offers later?",
          a: "Offers can appear only when approved and clearly attached to the provider profile.",
        },
      ],
      providerCtaTitle: "List your center on DrMuscat",
      providerCtaBody:
        "Request a listing review so people can discover your center by category, city, area, and service.",
      providerCtaButton: "List your center",
      cards: [
        {
          name: "Medical center preview",
          category: "Medical center",
          location: "Muscat · Al Khuwair",
          hours: "Open hours shown after approval",
          description:
            "Sample center listing with services, contact actions, location, and claim support.",
          tags: ["General clinic", "Family care", "Directions"],
          meta: ["Claim profile request", "No reviews yet"],
        },
        {
          name: "Dental clinic preview",
          category: "Dental clinic",
          location: "Bausher · Al Ghubrah",
          hours: "Confirm before visiting",
          description:
            "Dental-focused listing preview with practical details and no fabricated rankings.",
          tags: ["Dental care", "WhatsApp", "Call"],
          meta: ["Services shown after approval"],
        },
        {
          name: "Wellness provider preview",
          category: "Wellness center",
          location: "Seeb · Al Hail",
          hours: "Hours not guaranteed",
          description:
            "Wellness and beauty discovery card with safe, non-medical wording.",
          tags: ["Wellness", "Beauty", "Area discovery"],
          meta: ["Preview listing"],
        },
        {
          name: "Pet clinic preview",
          category: "Veterinary / pet clinic",
          location: "Muscat · Qurum",
          hours: "Call directly",
          description:
            "Pet clinic listing preview with directions, service tags, and claim support.",
          tags: ["Pet care", "Veterinary", "Directions"],
          meta: ["No fake ratings"],
        },
      ],
    },
    ar: {
      title: "ابحث عن العيادات والمراكز الطبية في عُمان",
      subtitle:
        "تصفح العيادات والمراكز الطبية وعيادات الأسنان ومقدمي العافية والتشخيص حسب الفئة والمدينة والمنطقة.",
      searchPlaceholder: "ابحث باسم المركز أو الفئة أو الخدمة أو المنطقة",
      category: "فئة المركز",
      chips: [
        "مراكز طبية",
        "عيادات أسنان",
        "عيادات تجميل",
        "مراكز عافية",
        "عيادات عيون",
        "عيادات بيطرية",
        "مراكز علاج طبيعي",
        "مراكز تشخيص",
      ],
      resultsTitle: "معاينات العيادات والمراكز",
      resultsNote:
        "القوائم معاينات نموذجية لملفات مراكز معتمدة مستقبلاً ولا تعني تفوقاً طبياً موثقاً.",
      sponsoredTitle: "معاينة ظهور مركز ممول",
      sponsoredBody:
        "يمكن لموضع ظهور مدفوع مساعدة المراكز المعتمدة على الظهور في فئة أو منطقة محددة مع وسم واضح.",
      inListSponsoredTitle: "موضع قائمة مركز ممول",
      sidebarSponsoredTitle: "مراكز مميزة في هذه المنطقة",
      sidebarSponsoredBody:
        "ظهور مستقبلي حسب المنطقة أو الفئة للمراكز والعيادات والمجموعات المعتمدة.",
      seoTitle: "اكتشاف العيادات والمراكز الطبية في عُمان",
      seoParagraphs: [
        "يساعد دكتور مسقط المستخدمين على اكتشاف العيادات والمراكز الطبية في عُمان حسب الفئة والمدينة والمنطقة باستخدام معلومات ملفات عامة عملية.",
        "يمكن لصفحات المراكز دعم الخدمات وساعات العمل واللغات ومعاينات الخريطة والعروض عند توفرها وطلبات المطالبة بعد الاعتماد.",
        "ينبغي للمستخدمين تأكيد ساعات العمل والخدمات والتأمين وإمكانية الوصول ومتطلبات المواعيد مباشرة مع المركز.",
      ],
      faqTitle: "أسئلة المراكز",
      faqs: [
        {
          q: "ما أنواع المراكز المدرجة؟",
          a: "يمكن لتجربة الاكتشاف دعم المراكز الطبية وعيادات الأسنان والمختبرات والعافية والعلاج الطبيعي والتجميل والعيادات البيطرية.",
        },
        {
          q: "هل يمكن لمركز المطالبة بملفه؟",
          a: "يمكن لتدفق مطالبة مستقبلي معتمد مساعدة المراكز على طلب مراجعة الملف وتحديثه.",
        },
        {
          q: "هل ساعات العمل مضمونة؟",
          a: "لا. يجب تأكيد الساعات مباشرة مع المركز قبل الزيارة.",
        },
        {
          q: "كيف أتواصل مع مركز؟",
          a: "يمكن للملفات المعتمدة عرض الاتصال والواتساب والاتجاهات وإجراءات الملف.",
        },
        {
          q: "هل يمكن للمراكز إضافة عروض لاحقاً؟",
          a: "يمكن أن تظهر العروض فقط عند اعتمادها وربطها بوضوح بملف مقدم الرعاية.",
        },
      ],
      providerCtaTitle: "أدرج مركزك في دكتور مسقط",
      providerCtaBody:
        "اطلب مراجعة قائمة حتى يتمكن الناس من اكتشاف مركزك حسب الفئة والمدينة والمنطقة والخدمة.",
      providerCtaButton: "أدرج مركزك",
      cards: [
        {
          name: "معاينة مركز طبي",
          category: "مركز طبي",
          location: "مسقط · الخوير",
          hours: "تظهر ساعات العمل بعد الاعتماد",
          description:
            "معاينة قائمة مركز تتضمن الخدمات وإجراءات التواصل والموقع ودعم المطالبة.",
          tags: ["عيادة عامة", "رعاية عائلية", "اتجاهات"],
          meta: ["طلب مطالبة بالملف", "لا توجد مراجعات بعد"],
        },
        {
          name: "معاينة عيادة أسنان",
          category: "عيادة أسنان",
          location: "بوشر · الغبرة",
          hours: "أكد قبل الزيارة",
          description: "معاينة قائمة أسنان بتفاصيل عملية ودون تصنيفات مختلقة.",
          tags: ["رعاية الأسنان", "واتساب", "اتصال"],
          meta: ["تظهر الخدمات بعد الاعتماد"],
        },
        {
          name: "معاينة مقدم عافية",
          category: "مركز عافية",
          location: "السيب · الحيل",
          hours: "الساعات غير مضمونة",
          description: "بطاقة اكتشاف للعافية والتجميل بلغة آمنة وغير طبية.",
          tags: ["عافية", "تجميل", "اكتشاف المنطقة"],
          meta: ["قائمة معاينة"],
        },
        {
          name: "معاينة عيادة بيطرية",
          category: "عيادة بيطرية",
          location: "مسقط · القرم",
          hours: "اتصل مباشرة",
          description:
            "معاينة قائمة عيادة حيوانات أليفة مع اتجاهات ووسوم خدمات ودعم مطالبة.",
          tags: ["رعاية الحيوانات", "بيطري", "اتجاهات"],
          meta: ["لا توجد تقييمات مزيفة"],
        },
      ],
    },
  },
  pharmacies: {
    en: {
      title: "Find pharmacies in Oman",
      subtitle:
        "Discover pharmacy listing previews by city and area, then confirm medicine availability and services directly with the pharmacy.",
      searchPlaceholder:
        "Search pharmacy, delivery, prescription support, or area",
      category: "Pharmacy service",
      chips: [
        "Nearby",
        "24-hour",
        "Delivery",
        "Prescription",
        "Insurance",
        "Home care",
        "Vitamins and wellness",
      ],
      resultsTitle: "Pharmacy listing previews",
      resultsNote:
        "Medication availability is never guaranteed on this page. Always call the pharmacy directly.",
      sponsoredTitle: "Sponsored pharmacy visibility preview",
      sponsoredBody:
        "A clearly labeled sponsored card can support approved pharmacies without implying medicine availability or medical quality.",
      inListSponsoredTitle: "Sponsored pharmacy slot",
      sidebarSponsoredTitle: "Featured pharmacies in this area",
      sidebarSponsoredBody:
        "Future visibility for approved pharmacies by area or service category.",
      seoTitle: "Pharmacy discovery by area in Oman",
      seoParagraphs: [
        "DrMuscat pharmacy discovery helps users find pharmacy listing previews by city, area, and service category in Oman.",
        "Cards can show practical details such as hours preview, contact actions, directions, delivery labels, and prescription support when approved.",
        "Always call directly to confirm medicine availability, prescription requirements, delivery, opening hours, and pricing before relying on a listing.",
      ],
      faqTitle: "Pharmacies FAQ",
      faqs: [
        {
          q: "Can I check medicine availability on DrMuscat?",
          a: "No. Medicine availability must be confirmed directly with the pharmacy.",
        },
        {
          q: "Do pharmacies offer delivery?",
          a: "Delivery can be shown only as a provider-supplied service label after approval.",
        },
        {
          q: "Should I call before visiting?",
          a: "Yes. Confirm opening hours, stock, prescription requirements, and location directly.",
        },
        {
          q: "Are pharmacy listings verified?",
          a: "This page is a frontend preview. Future public listings should be reviewed before display.",
        },
        {
          q: "Can pharmacies claim their listing?",
          a: "A pharmacy can request listing review through the provider listing flow when available.",
        },
      ],
      providerCtaTitle: "Run a pharmacy?",
      providerCtaBody:
        "Request listing review so people can find your pharmacy by city, area, and service needs.",
      providerCtaButton: "Request listing review",
      cards: [
        {
          name: "Pharmacy preview",
          category: "Community pharmacy",
          location: "Muscat · Al Khuwair",
          hours: "Call directly to confirm hours",
          description:
            "Sample pharmacy listing with contact actions and clear medicine availability confirmation language.",
          tags: [
            "Prescription support preview",
            "Call to confirm",
            "Directions",
          ],
          meta: ["No reviews yet"],
        },
        {
          name: "Delivery pharmacy preview",
          category: "Delivery label preview",
          location: "Seeb · Al Hail",
          hours: "Delivery not guaranteed",
          description:
            "A pharmacy card that can label delivery after approval without implying stock or speed.",
          tags: ["Delivery label", "WhatsApp", "Area discovery"],
          meta: ["Reviews after moderation"],
        },
        {
          name: "Wellness pharmacy preview",
          category: "Vitamins and wellness",
          location: "Bausher · Ghala",
          hours: "Confirm before visiting",
          description:
            "Practical discovery card for pharmacy services with no medicine availability claims.",
          tags: ["Wellness", "Home care label", "Call first"],
          meta: ["Sample preview"],
        },
        {
          name: "24-hour label preview",
          category: "Hours label preview",
          location: "Muttrah · Ruwi",
          hours: "24-hour label requires approval",
          description:
            "A future hours label can be displayed only when provider details are reviewed and still should be confirmed.",
          tags: ["Hours preview", "Directions", "Phone"],
          meta: ["No fake availability"],
        },
      ],
    },
    ar: {
      title: "ابحث عن صيدليات في عُمان",
      subtitle:
        "اكتشف معاينات قوائم الصيدليات حسب المدينة والمنطقة، ثم أكد توفر الأدوية والخدمات مباشرة مع الصيدلية.",
      searchPlaceholder: "ابحث عن صيدلية أو توصيل أو دعم وصفة أو منطقة",
      category: "خدمة الصيدلية",
      chips: [
        "قريب",
        "24 ساعة",
        "توصيل",
        "وصفة طبية",
        "تأمين",
        "رعاية منزلية",
        "فيتامينات وعافية",
      ],
      resultsTitle: "معاينات قوائم الصيدليات",
      resultsNote:
        "لا يتم ضمان توفر الأدوية في هذه الصفحة. اتصل دائماً بالصيدلية مباشرة.",
      sponsoredTitle: "معاينة ظهور صيدلية ممولة",
      sponsoredBody:
        "يمكن لبطاقة ممولة موسومة بوضوح دعم الصيدليات المعتمدة دون الإيحاء بتوفر الدواء أو جودة طبية.",
      inListSponsoredTitle: "موضع صيدلية ممول",
      sidebarSponsoredTitle: "صيدليات مميزة في هذه المنطقة",
      sidebarSponsoredBody:
        "ظهور مستقبلي للصيدليات المعتمدة حسب المنطقة أو فئة الخدمة.",
      seoTitle: "اكتشاف الصيدليات حسب المنطقة في عُمان",
      seoParagraphs: [
        "يساعد اكتشاف الصيدليات في دكتور مسقط المستخدمين على العثور على معاينات قوائم الصيدليات حسب المدينة والمنطقة وفئة الخدمة في عُمان.",
        "يمكن للبطاقات عرض تفاصيل عملية مثل معاينة الساعات وإجراءات التواصل والاتجاهات ووسوم التوصيل ودعم الوصفة عند الاعتماد.",
        "اتصل دائماً مباشرة لتأكيد توفر الأدوية ومتطلبات الوصفة والتوصيل وساعات العمل والأسعار قبل الاعتماد على أي قائمة.",
      ],
      faqTitle: "أسئلة الصيدليات",
      faqs: [
        {
          q: "هل يمكنني معرفة توفر الدواء عبر دكتور مسقط؟",
          a: "لا. يجب تأكيد توفر الدواء مباشرة مع الصيدلية.",
        },
        {
          q: "هل تقدم الصيدليات خدمة التوصيل؟",
          a: "يمكن عرض التوصيل كوسم خدمة مقدم من الصيدلية بعد الاعتماد فقط.",
        },
        {
          q: "هل يجب الاتصال قبل الزيارة؟",
          a: "نعم. أكد الساعات والمخزون ومتطلبات الوصفة والموقع مباشرة.",
        },
        {
          q: "هل قوائم الصيدليات موثقة؟",
          a: "هذه الصفحة معاينة أمامية. ينبغي مراجعة القوائم العامة المستقبلية قبل العرض.",
        },
        {
          q: "هل يمكن للصيدليات المطالبة بقائمتها؟",
          a: "يمكن للصيدلية طلب مراجعة القائمة عبر تدفق إدراج مقدمي الرعاية عند توفره.",
        },
      ],
      providerCtaTitle: "هل تدير صيدلية؟",
      providerCtaBody:
        "اطلب مراجعة قائمة حتى يتمكن الناس من العثور على صيدليتك حسب المدينة والمنطقة واحتياجات الخدمة.",
      providerCtaButton: "اطلب مراجعة القائمة",
      cards: [
        {
          name: "معاينة صيدلية",
          category: "صيدلية مجتمعية",
          location: "مسقط · الخوير",
          hours: "اتصل مباشرة لتأكيد الساعات",
          description:
            "معاينة قائمة صيدلية مع إجراءات تواصل ولغة واضحة لتأكيد توفر الدواء.",
          tags: ["معاينة دعم الوصفة", "اتصل للتأكيد", "اتجاهات"],
          meta: ["لا توجد مراجعات بعد"],
        },
        {
          name: "معاينة صيدلية توصيل",
          category: "معاينة وسم التوصيل",
          location: "السيب · الحيل",
          hours: "التوصيل غير مضمون",
          description:
            "بطاقة صيدلية يمكنها وسم التوصيل بعد الاعتماد دون الإيحاء بالمخزون أو السرعة.",
          tags: ["وسم توصيل", "واتساب", "اكتشاف المنطقة"],
          meta: ["المراجعات بعد المراجعة"],
        },
        {
          name: "معاينة صيدلية عافية",
          category: "فيتامينات وعافية",
          location: "بوشر · غلا",
          hours: "أكد قبل الزيارة",
          description:
            "بطاقة اكتشاف عملية لخدمات الصيدلية دون ادعاءات توفر الأدوية.",
          tags: ["عافية", "وسم رعاية منزلية", "اتصل أولاً"],
          meta: ["معاينة نموذجية"],
        },
        {
          name: "معاينة وسم 24 ساعة",
          category: "معاينة وسم الساعات",
          location: "مطرح · روي",
          hours: "وسم 24 ساعة يتطلب اعتماداً",
          description:
            "يمكن عرض وسم ساعات مستقبلي فقط عند مراجعة بيانات مقدم الخدمة ويجب تأكيده دائماً.",
          tags: ["معاينة ساعات", "اتجاهات", "هاتف"],
          meta: ["لا توفر مزيف"],
        },
      ],
    },
  },
  labs: {
    en: {
      title: "Find labs and diagnostic centers in Oman",
      subtitle:
        "Discover lab and diagnostic listing previews by city, area, and test category while confirming preparation details directly with the lab.",
      searchPlaceholder:
        "Search lab, test category, home sample collection, or area",
      category: "Test category",
      chips: [
        "Blood tests",
        "Imaging",
        "Home sample collection",
        "Packages",
        "Results",
        "Insurance",
        "Nearby",
      ],
      resultsTitle: "Lab and diagnostic previews",
      resultsNote:
        "Lab cards are discovery previews only. Confirm test availability, preparation, reporting time, and pricing directly.",
      sponsoredTitle: "Sponsored lab visibility preview",
      sponsoredBody:
        "A future sponsored lab slot can highlight approved diagnostic providers without giving test or quality advice.",
      inListSponsoredTitle: "Sponsored lab slot",
      sidebarSponsoredTitle: "Featured labs in this area",
      sidebarSponsoredBody:
        "Future approved visibility for laboratories and diagnostic centers by selected area.",
      seoTitle: "Laboratory and diagnostic discovery in Oman",
      seoParagraphs: [
        "DrMuscat lab discovery helps users find laboratory and diagnostic center profile previews by city, area, and test category in Oman.",
        "Future approved lab profiles can show contact actions, services, preparation notes, and home sample collection labels where applicable.",
        "Always confirm test preparation, timing, reporting details, price, and whether a doctor request is needed directly with the lab.",
      ],
      faqTitle: "Labs FAQ",
      faqs: [
        {
          q: "Can I book lab tests through DrMuscat?",
          a: "This preview does not provide lab booking. Contact approved labs directly when listings are available.",
        },
        {
          q: "Should I confirm preparation instructions?",
          a: "Yes. Fasting, timing, sample requirements, and paperwork should be confirmed directly with the lab.",
        },
        {
          q: "Are lab prices shown?",
          a: "Prices are not guaranteed here. Future profiles may show provider-supplied information after review.",
        },
        {
          q: "How do I find labs near me?",
          a: "Use city and area filters, then confirm the lab location and hours before visiting.",
        },
        {
          q: "Can labs publish test packages later?",
          a: "Package information can appear only when approved and should still be verified directly.",
        },
      ],
      providerCtaTitle: "Manage a lab?",
      providerCtaBody:
        "Submit your lab for review so users can discover services, areas, directions, and direct contact information.",
      providerCtaButton: "Submit your lab for review",
      cards: [
        {
          name: "Medical lab preview",
          category: "Routine diagnostics",
          location: "Muscat · Al Khuwair",
          hours: "Confirm test timing directly",
          description:
            "Sample lab listing with test category labels and a clear preparation confirmation note.",
          tags: ["Blood tests", "Routine diagnostics", "Call first"],
          meta: ["No reviews yet"],
          serviceNote:
            "Always confirm preparation and reporting details directly.",
        },
        {
          name: "Home sample preview",
          category: "Home sample collection label",
          location: "Seeb · Mawaleh",
          hours: "Collection not guaranteed",
          description:
            "A future service label can show home sample collection after provider review.",
          tags: ["Home sample label", "WhatsApp", "Area discovery"],
          meta: ["Reviews after moderation"],
        },
        {
          name: "Diagnostic center preview",
          category: "Imaging and diagnostics",
          location: "Bausher · Ghala",
          hours: "Call before visiting",
          description:
            "Diagnostic listing preview with services and directions, without diagnostic advice.",
          tags: ["Imaging label", "Directions", "Phone"],
          meta: ["Sample preview"],
        },
        {
          name: "Lab package preview",
          category: "Package label preview",
          location: "Salalah · Al Saada",
          hours: "Confirm price and timing",
          description:
            "A package label can appear later only after review and should not replace direct lab confirmation.",
          tags: ["Packages", "Results label", "Insurance label"],
          meta: ["No fake guarantees"],
        },
      ],
    },
    ar: {
      title: "ابحث عن المختبرات ومراكز التشخيص في عُمان",
      subtitle:
        "اكتشف معاينات المختبرات ومراكز التشخيص حسب المدينة والمنطقة وفئة الفحص مع تأكيد تعليمات التحضير مباشرة مع المختبر.",
      searchPlaceholder: "ابحث عن مختبر أو فئة فحص أو سحب منزلي أو منطقة",
      category: "فئة الفحص",
      chips: [
        "تحاليل دم",
        "تصوير",
        "سحب عينات منزلي",
        "باقات",
        "نتائج",
        "تأمين",
        "قريب",
      ],
      resultsTitle: "معاينات المختبرات والتشخيص",
      resultsNote:
        "بطاقات المختبرات للمعاينة فقط. أكد توفر الفحص والتحضير ووقت النتائج والأسعار مباشرة.",
      sponsoredTitle: "معاينة ظهور مختبر ممول",
      sponsoredBody:
        "يمكن لموضع مختبر ممول مستقبلي إبراز مقدمي التشخيص المعتمدين دون تقديم نصائح فحوصات أو جودة.",
      inListSponsoredTitle: "موضع مختبر ممول",
      sidebarSponsoredTitle: "مختبرات مميزة في هذه المنطقة",
      sidebarSponsoredBody:
        "ظهور معتمد مستقبلي للمختبرات ومراكز التشخيص حسب المنطقة المحددة.",
      seoTitle: "اكتشاف المختبرات والتشخيص في عُمان",
      seoParagraphs: [
        "يساعد اكتشاف المختبرات في دكتور مسقط المستخدمين على العثور على معاينات ملفات المختبرات ومراكز التشخيص حسب المدينة والمنطقة وفئة الفحص في عُمان.",
        "يمكن لملفات المختبرات المعتمدة مستقبلاً عرض إجراءات التواصل والخدمات وملاحظات التحضير ووسوم سحب العينات المنزلية عند الاقتضاء.",
        "أكد دائماً تعليمات التحضير ووقت الفحص وتفاصيل النتائج والسعر وما إذا كان طلب الطبيب مطلوباً مباشرة مع المختبر.",
      ],
      faqTitle: "أسئلة المختبرات",
      faqs: [
        {
          q: "هل يمكنني حجز فحوصات عبر دكتور مسقط؟",
          a: "هذه المعاينة لا توفر الحجز. تواصل مباشرة مع المختبرات المعتمدة عند توفر القوائم.",
        },
        {
          q: "هل يجب تأكيد تعليمات التحضير؟",
          a: "نعم. يجب تأكيد الصيام والتوقيت ومتطلبات العينة والأوراق مباشرة مع المختبر.",
        },
        {
          q: "هل تظهر أسعار المختبرات؟",
          a: "الأسعار غير مضمونة هنا. قد تعرض الملفات المستقبلية معلومات مقدمة من المزود بعد المراجعة.",
        },
        {
          q: "كيف أجد مختبرات قريبة مني؟",
          a: "استخدم مرشحات المدينة والمنطقة، ثم أكد موقع المختبر وساعاته قبل الزيارة.",
        },
        {
          q: "هل يمكن للمختبرات نشر باقات فحوصات لاحقاً؟",
          a: "يمكن أن تظهر معلومات الباقات فقط عند اعتمادها ويجب التحقق منها مباشرة أيضاً.",
        },
      ],
      providerCtaTitle: "هل تدير مختبراً؟",
      providerCtaBody:
        "أرسل مختبرك للمراجعة حتى يتمكن المستخدمون من اكتشاف الخدمات والمناطق والاتجاهات وبيانات التواصل المباشر.",
      providerCtaButton: "أرسل مختبرك للمراجعة",
      cards: [
        {
          name: "معاينة مختبر طبي",
          category: "تشخيص روتيني",
          location: "مسقط · الخوير",
          hours: "أكد توقيت الفحص مباشرة",
          description:
            "معاينة قائمة مختبر مع وسوم فئات الفحوصات وملاحظة واضحة لتأكيد التحضير.",
          tags: ["تحاليل دم", "تشخيص روتيني", "اتصل أولاً"],
          meta: ["لا توجد مراجعات بعد"],
          serviceNote: "أكد دائماً التحضير وتفاصيل النتائج مباشرة.",
        },
        {
          name: "معاينة سحب منزلي",
          category: "وسم سحب عينات منزلي",
          location: "السيب · الموالح",
          hours: "السحب غير مضمون",
          description:
            "يمكن لوسم خدمة مستقبلي عرض سحب العينات المنزلي بعد مراجعة مقدم الخدمة.",
          tags: ["وسم سحب منزلي", "واتساب", "اكتشاف المنطقة"],
          meta: ["المراجعات بعد المراجعة"],
        },
        {
          name: "معاينة مركز تشخيص",
          category: "تصوير وتشخيص",
          location: "بوشر · غلا",
          hours: "اتصل قبل الزيارة",
          description:
            "معاينة قائمة تشخيص مع خدمات واتجاهات ودون نصائح تشخيصية.",
          tags: ["وسم تصوير", "اتجاهات", "هاتف"],
          meta: ["معاينة نموذجية"],
        },
        {
          name: "معاينة باقة مختبر",
          category: "معاينة وسم باقة",
          location: "صلالة · السعادة",
          hours: "أكد السعر والتوقيت",
          description:
            "يمكن أن يظهر وسم باقة لاحقاً فقط بعد المراجعة ولا يغني عن تأكيد المختبر المباشر.",
          tags: ["باقات", "وسم نتائج", "وسم تأمين"],
          meta: ["لا ضمانات مزيفة"],
        },
      ],
    },
  },
  services: {
    en: {
      title: "Browse healthcare services in Oman",
      subtitle:
        "Explore healthcare, wellness, dental, beauty, diagnostics, pharmacy, and pet care discovery categories across Oman.",
      searchPlaceholder: "Search service, provider type, city, or area",
      category: "Service category",
      chips: [
        "Dental care",
        "Dermatology",
        "Pediatrics",
        "Eye care",
        "Physiotherapy",
        "Lab tests",
        "Pharmacy services",
        "Pet care",
        "Wellness and beauty",
        "Nutrition",
        "Women’s health",
        "General medicine",
      ],
      resultsTitle: "Service category previews",
      resultsNote:
        "Service cards route users to safe existing discovery pages and do not guarantee prices, availability, or outcomes.",
      sponsoredTitle: "Sponsored service category preview",
      sponsoredBody:
        "Future category visibility can help approved providers appear around a service while staying clearly labeled as paid visibility.",
      inListSponsoredTitle: "Sponsored service visibility slot",
      sidebarSponsoredTitle: "Featured service category",
      sidebarSponsoredBody:
        "Future paid visibility for approved providers offering services in a selected area.",
      seoTitle: "Healthcare service discovery in Oman",
      seoParagraphs: [
        "Use DrMuscat services to explore healthcare and wellness categories in Oman and move into provider discovery by city, area, and provider type.",
        "Service cards help users find relevant doctors, centers, pharmacies, labs, and articles without presenting medical advice or guaranteed prices.",
        "Confirm service details, availability, suitability, and pricing directly with a licensed provider before making decisions.",
      ],
      faqTitle: "Services FAQ",
      faqs: [
        {
          q: "What healthcare services can I search?",
          a: "You can browse discovery categories such as dental, dermatology, pediatrics, labs, pharmacy services, wellness, and pet care.",
        },
        {
          q: "Can I compare providers by service?",
          a: "Service cards can guide users to relevant provider discovery pages. They are not medical rankings.",
        },
        {
          q: "Are service prices guaranteed?",
          a: "No. Pricing should be confirmed directly with the provider.",
        },
        {
          q: "How do I contact a provider?",
          a: "Approved public profiles can show view, WhatsApp, call, and directions actions.",
        },
        {
          q: "Can providers add service pages later?",
          a: "Future provider workflows can request reviewed service details after approval.",
        },
      ],
      providerCtaTitle: "Offer healthcare services?",
      providerCtaBody:
        "Join DrMuscat discovery so people can find your services by category, city, and area.",
      providerCtaButton: "Join DrMuscat discovery",
      cards: [
        {
          name: "Dental care",
          category: "Service category",
          location: "Oman · multiple areas",
          hours: "Provider hours vary",
          description:
            "Discover dental providers and centers by city and area, then confirm services directly.",
          tags: ["Dentists", "Dental clinics", "Centers"],
          meta: ["Find providers"],
        },
        {
          name: "Lab tests",
          category: "Diagnostics",
          location: "Oman · city filters",
          hours: "Confirm timing with lab",
          description:
            "Use lab discovery to find diagnostic providers and confirm preparation instructions directly.",
          tags: ["Labs", "Blood tests", "Diagnostics"],
          meta: ["No medical advice"],
        },
        {
          name: "Pharmacy services",
          category: "Pharmacies",
          location: "Oman · area filters",
          hours: "Call before relying on hours",
          description:
            "Find pharmacy listings and confirm medicine availability directly with the pharmacy.",
          tags: ["Pharmacies", "Delivery label", "Prescription support"],
          meta: ["Availability not guaranteed"],
        },
        {
          name: "Pet care",
          category: "Veterinary / pet clinics",
          location: "Muscat and Oman",
          hours: "Confirm directly",
          description:
            "Browse pet clinic discovery categories and route to approved provider listings when available.",
          tags: ["Pet clinics", "Veterinary", "Directions"],
          meta: ["Preview category"],
        },
      ],
    },
    ar: {
      title: "تصفح خدمات الرعاية الصحية في عُمان",
      subtitle:
        "استكشف فئات اكتشاف الرعاية الصحية والعافية والأسنان والتجميل والتشخيص والصيدليات ورعاية الحيوانات في عُمان.",
      searchPlaceholder: "ابحث عن خدمة أو نوع مقدم أو مدينة أو منطقة",
      category: "فئة الخدمة",
      chips: [
        "رعاية الأسنان",
        "جلدية",
        "أطفال",
        "عيون",
        "علاج طبيعي",
        "تحاليل مختبر",
        "خدمات صيدلية",
        "رعاية الحيوانات",
        "عافية وتجميل",
        "تغذية",
        "صحة المرأة",
        "طب عام",
      ],
      resultsTitle: "معاينات فئات الخدمات",
      resultsNote:
        "توجه بطاقات الخدمات المستخدمين إلى صفحات اكتشاف آمنة قائمة ولا تضمن الأسعار أو التوفر أو النتائج.",
      sponsoredTitle: "معاينة فئة خدمة ممولة",
      sponsoredBody:
        "يمكن للظهور المستقبلي حسب الفئة مساعدة مقدمي الرعاية المعتمدين على الظهور حول خدمة مع وسمه بوضوح كظهور مدفوع.",
      inListSponsoredTitle: "موضع ظهور خدمة ممول",
      sidebarSponsoredTitle: "فئة خدمة مميزة",
      sidebarSponsoredBody:
        "ظهور مدفوع مستقبلي لمقدمي رعاية معتمدين يقدمون خدمات في منطقة محددة.",
      seoTitle: "اكتشاف خدمات الرعاية الصحية في عُمان",
      seoParagraphs: [
        "استخدم خدمات دكتور مسقط لاستكشاف فئات الرعاية الصحية والعافية في عُمان والانتقال إلى اكتشاف مقدمي الرعاية حسب المدينة والمنطقة ونوع المقدم.",
        "تساعد بطاقات الخدمات المستخدمين على العثور على أطباء ومراكز وصيدليات ومختبرات ومقالات ذات صلة دون تقديم نصائح طبية أو أسعار مضمونة.",
        "أكد تفاصيل الخدمة والتوفر والملاءمة والأسعار مباشرة مع مقدم رعاية مرخص قبل اتخاذ القرارات.",
      ],
      faqTitle: "أسئلة الخدمات",
      faqs: [
        {
          q: "ما خدمات الرعاية الصحية التي يمكنني البحث عنها؟",
          a: "يمكنك تصفح فئات اكتشاف مثل الأسنان والجلدية والأطفال والمختبرات وخدمات الصيدلية والعافية ورعاية الحيوانات.",
        },
        {
          q: "هل يمكنني مقارنة مقدمي الرعاية حسب الخدمة؟",
          a: "يمكن لبطاقات الخدمات توجيه المستخدمين إلى صفحات اكتشاف مقدمي رعاية ذات صلة. ليست تصنيفات طبية.",
        },
        {
          q: "هل أسعار الخدمات مضمونة؟",
          a: "لا. يجب تأكيد الأسعار مباشرة مع مقدم الرعاية.",
        },
        {
          q: "كيف أتواصل مع مقدم رعاية؟",
          a: "يمكن للملفات العامة المعتمدة عرض إجراءات العرض والواتساب والاتصال والاتجاهات.",
        },
        {
          q: "هل يمكن لمقدمي الرعاية إضافة صفحات خدمات لاحقاً؟",
          a: "يمكن لتدفقات مقدمي الرعاية المستقبلية طلب تفاصيل خدمات مراجعة بعد الاعتماد.",
        },
      ],
      providerCtaTitle: "هل تقدم خدمات رعاية صحية؟",
      providerCtaBody:
        "انضم إلى اكتشاف دكتور مسقط حتى يتمكن الناس من العثور على خدماتك حسب الفئة والمدينة والمنطقة.",
      providerCtaButton: "انضم إلى اكتشاف دكتور مسقط",
      cards: [
        {
          name: "رعاية الأسنان",
          category: "فئة خدمة",
          location: "عُمان · مناطق متعددة",
          hours: "تختلف ساعات مقدمي الرعاية",
          description:
            "اكتشف مقدمي رعاية الأسنان والمراكز حسب المدينة والمنطقة، ثم أكد الخدمات مباشرة.",
          tags: ["أطباء أسنان", "عيادات أسنان", "مراكز"],
          meta: ["ابحث عن مقدمي رعاية"],
        },
        {
          name: "تحاليل مختبر",
          category: "تشخيص",
          location: "عُمان · مرشحات مدينة",
          hours: "أكد التوقيت مع المختبر",
          description:
            "استخدم اكتشاف المختبرات للعثور على مقدمي التشخيص وتأكيد تعليمات التحضير مباشرة.",
          tags: ["مختبرات", "تحاليل دم", "تشخيص"],
          meta: ["لا نصيحة طبية"],
        },
        {
          name: "خدمات صيدلية",
          category: "صيدليات",
          location: "عُمان · مرشحات منطقة",
          hours: "اتصل قبل الاعتماد على الساعات",
          description:
            "اعثر على قوائم الصيدليات وأكد توفر الأدوية مباشرة مع الصيدلية.",
          tags: ["صيدليات", "وسم توصيل", "دعم وصفة"],
          meta: ["التوفر غير مضمون"],
        },
        {
          name: "رعاية الحيوانات",
          category: "عيادات بيطرية",
          location: "مسقط وعُمان",
          hours: "أكد مباشرة",
          description:
            "تصفح فئات اكتشاف عيادات الحيوانات وانتقل إلى قوائم مقدمي الرعاية المعتمدة عند توفرها.",
          tags: ["عيادات حيوانات", "بيطري", "اتجاهات"],
          meta: ["فئة معاينة"],
        },
      ],
    },
  },
  search: {
    en: {
      title: "Search DrMuscat",
      subtitle:
        "Search healthcare providers, services, areas, and articles across Oman using one discovery-first interface.",
      searchPlaceholder:
        "Search doctors, clinics, pharmacies, labs, services, areas, or articles",
      category: "Result type",
      chips: [
        "All",
        "Doctors",
        "Centers",
        "Pharmacies",
        "Labs",
        "Services",
        "Articles",
      ],
      searchTabs: [
        "All",
        "Doctors",
        "Centers",
        "Pharmacies",
        "Labs",
        "Services",
        "Articles",
      ],
      resultsTitle: "Grouped discovery results",
      resultsNote:
        "Search results are grouped preview cards. They link only to existing route families and avoid fake rankings.",
      sponsoredTitle: "Sponsored search visibility preview",
      sponsoredBody:
        "Future approved sponsored results can appear with clear labeling and without influencing organic medical quality signals.",
      inListSponsoredTitle: "Sponsored search result slot",
      sidebarSponsoredTitle: "Featured in search",
      sidebarSponsoredBody:
        "Future paid visibility for approved providers matching the selected type, city, or area.",
      groupedResultsTitle: "Results grouped by type",
      groupedResults: [
        {
          label: "Providers",
          body: "Approved clinics, centers, pharmacies, and labs can appear here.",
        },
        {
          label: "Doctors",
          body: "Doctor profiles can be grouped by specialty and area after approval.",
        },
        {
          label: "Services",
          body: "Service categories help users move into relevant discovery pages.",
        },
        {
          label: "Areas",
          body: "Area suggestions use the selected city and do not mix city values.",
        },
        {
          label: "Articles",
          body: "Health guides link to editorial pages for general discovery information only.",
        },
      ],
      seoTitle:
        "Search healthcare providers, services, areas, and guides in Oman",
      seoParagraphs: [
        "DrMuscat search is designed to connect users with healthcare discovery pages across doctors, clinics, pharmacies, labs, services, areas, and articles in Oman.",
        "The search experience uses city and area filters to keep local discovery organized while avoiding fake rankings, fake review counts, or unsupported availability claims.",
        "Search results should be treated as discovery starting points. Confirm provider details directly before visiting or making healthcare decisions.",
      ],
      faqTitle: "Search FAQ",
      faqs: [
        {
          q: "How does DrMuscat search work?",
          a: "This frontend search preview groups discovery content by type and route family.",
        },
        {
          q: "Can I search by area?",
          a: "Yes. Choose a city first, then use dependent area options for that city.",
        },
        {
          q: "Can I search by service?",
          a: "Service chips can guide users to relevant provider categories and discovery pages.",
        },
        {
          q: "Are search results medical rankings?",
          a: "No. Sponsored and organic previews are not medical quality rankings.",
        },
        {
          q: "Why should I confirm details directly?",
          a: "Provider hours, availability, prices, credentials, and services can change and should be confirmed directly.",
        },
      ],
      providerCtaTitle: "Can’t find your center?",
      providerCtaBody:
        "Request a listing review so future users can discover your provider profile through DrMuscat search.",
      providerCtaButton: "Request listing review",
      cards: [
        {
          name: "Doctors search preview",
          category: "Doctors",
          location: "Oman · specialty and area filters",
          hours: "Profile details after approval",
          description:
            "Search doctors by specialty, city, area, and language using safe preview cards.",
          tags: ["Doctors", "Specialties", "Areas"],
          meta: ["No reviews yet"],
        },
        {
          name: "Centers search preview",
          category: "Clinics and centers",
          location: "Oman · category filters",
          hours: "Confirm directly",
          description:
            "Find center discovery pages and approved listings by category and location.",
          tags: ["Centers", "Services", "Claim support"],
          meta: ["Preview listing"],
        },
        {
          name: "Pharmacies and labs preview",
          category: "Pharmacies / Labs",
          location: "Oman · city filters",
          hours: "Call before relying on details",
          description:
            "Route users into pharmacy and lab discovery without making availability or diagnosis claims.",
          tags: ["Pharmacies", "Labs", "Directions"],
          meta: ["No fake guarantees"],
        },
        {
          name: "Articles and guides preview",
          category: "Articles",
          location: "DrMuscat health guides",
          hours: "General information only",
          description:
            "Search health guides for discovery help, checklists, and non-medical guidance.",
          tags: ["Articles", "Guides", "General information"],
          meta: ["Not medical advice"],
        },
      ],
    },
    ar: {
      title: "ابحث في دكتور مسقط",
      subtitle:
        "ابحث عن مقدمي الرعاية والخدمات والمناطق والمقالات في عُمان عبر واجهة واحدة تركّز على الاكتشاف.",
      searchPlaceholder:
        "ابحث عن أطباء أو عيادات أو صيدليات أو مختبرات أو خدمات أو مناطق أو مقالات",
      category: "نوع النتيجة",
      chips: [
        "الكل",
        "الأطباء",
        "المراكز",
        "الصيدليات",
        "المختبرات",
        "الخدمات",
        "المقالات",
      ],
      searchTabs: [
        "الكل",
        "الأطباء",
        "المراكز",
        "الصيدليات",
        "المختبرات",
        "الخدمات",
        "المقالات",
      ],
      resultsTitle: "نتائج اكتشاف مجمعة",
      resultsNote:
        "نتائج البحث بطاقات معاينة مجمعة. ترتبط فقط بعائلات مسارات قائمة وتتجنب التصنيفات المزيفة.",
      sponsoredTitle: "معاينة ظهور بحث ممول",
      sponsoredBody:
        "يمكن أن تظهر نتائج ممولة معتمدة مستقبلاً بوسم واضح ودون التأثير على إشارات الجودة الطبية العضوية.",
      inListSponsoredTitle: "موضع نتيجة بحث ممولة",
      sidebarSponsoredTitle: "مميز في البحث",
      sidebarSponsoredBody:
        "ظهور مدفوع مستقبلي لمقدمي رعاية معتمدين يطابقون النوع أو المدينة أو المنطقة المحددة.",
      groupedResultsTitle: "نتائج مجمعة حسب النوع",
      groupedResults: [
        {
          label: "مقدمو الرعاية",
          body: "يمكن أن تظهر هنا العيادات والمراكز والصيدليات والمختبرات المعتمدة.",
        },
        {
          label: "الأطباء",
          body: "يمكن تجميع ملفات الأطباء حسب التخصص والمنطقة بعد الاعتماد.",
        },
        {
          label: "الخدمات",
          body: "تساعد فئات الخدمات المستخدمين على الانتقال إلى صفحات اكتشاف ذات صلة.",
        },
        {
          label: "المناطق",
          body: "تستخدم اقتراحات المناطق المدينة المحددة ولا تخلط قيم المدن.",
        },
        {
          label: "المقالات",
          body: "ترتبط الأدلة الصحية بصفحات تحريرية للمعلومات العامة فقط.",
        },
      ],
      seoTitle: "البحث عن مقدمي الرعاية والخدمات والمناطق والأدلة في عُمان",
      seoParagraphs: [
        "تم تصميم بحث دكتور مسقط لربط المستخدمين بصفحات اكتشاف الرعاية الصحية عبر الأطباء والعيادات والصيدليات والمختبرات والخدمات والمناطق والمقالات في عُمان.",
        "تستخدم تجربة البحث مرشحات المدينة والمنطقة للحفاظ على تنظيم الاكتشاف المحلي مع تجنب التصنيفات المزيفة أو أعداد المراجعات المختلقة أو ادعاءات التوفر غير المدعومة.",
        "يجب التعامل مع نتائج البحث كبداية للاكتشاف. أكد تفاصيل مقدم الرعاية مباشرة قبل الزيارة أو اتخاذ قرارات صحية.",
      ],
      faqTitle: "أسئلة البحث",
      faqs: [
        {
          q: "كيف يعمل بحث دكتور مسقط؟",
          a: "تجمع معاينة البحث الأمامية محتوى الاكتشاف حسب النوع وعائلة المسار.",
        },
        {
          q: "هل يمكنني البحث حسب المنطقة؟",
          a: "نعم. اختر المدينة أولاً، ثم استخدم خيارات المنطقة التابعة لتلك المدينة.",
        },
        {
          q: "هل يمكنني البحث حسب الخدمة؟",
          a: "يمكن لوسوم الخدمات توجيه المستخدمين إلى فئات مقدمي الرعاية وصفحات الاكتشاف ذات الصلة.",
        },
        {
          q: "هل نتائج البحث تصنيفات طبية؟",
          a: "لا. المعاينات الممولة والعضوية ليست تصنيفات لجودة الرعاية الطبية.",
        },
        {
          q: "لماذا يجب تأكيد التفاصيل مباشرة؟",
          a: "قد تتغير ساعات مقدم الرعاية والتوفر والأسعار والاعتمادات والخدمات ويجب تأكيدها مباشرة.",
        },
      ],
      providerCtaTitle: "لا تجد مركزك؟",
      providerCtaBody:
        "اطلب مراجعة قائمة حتى يتمكن المستخدمون مستقبلاً من اكتشاف ملف مقدم الرعاية الخاص بك عبر بحث دكتور مسقط.",
      providerCtaButton: "اطلب مراجعة القائمة",
      cards: [
        {
          name: "معاينة بحث الأطباء",
          category: "الأطباء",
          location: "عُمان · مرشحات تخصص ومنطقة",
          hours: "تفاصيل الملف بعد الاعتماد",
          description:
            "ابحث عن الأطباء حسب التخصص والمدينة والمنطقة واللغة باستخدام بطاقات معاينة آمنة.",
          tags: ["أطباء", "تخصصات", "مناطق"],
          meta: ["لا توجد مراجعات بعد"],
        },
        {
          name: "معاينة بحث المراكز",
          category: "العيادات والمراكز",
          location: "عُمان · مرشحات فئة",
          hours: "أكد مباشرة",
          description:
            "اعثر على صفحات اكتشاف المراكز والقوائم المعتمدة حسب الفئة والموقع.",
          tags: ["مراكز", "خدمات", "دعم مطالبة"],
          meta: ["قائمة معاينة"],
        },
        {
          name: "معاينة الصيدليات والمختبرات",
          category: "صيدليات / مختبرات",
          location: "عُمان · مرشحات مدينة",
          hours: "اتصل قبل الاعتماد على التفاصيل",
          description:
            "وجّه المستخدمين إلى اكتشاف الصيدليات والمختبرات دون ادعاءات توفر أو تشخيص.",
          tags: ["صيدليات", "مختبرات", "اتجاهات"],
          meta: ["لا ضمانات مزيفة"],
        },
        {
          name: "معاينة المقالات والأدلة",
          category: "مقالات",
          location: "أدلة دكتور مسقط الصحية",
          hours: "معلومات عامة فقط",
          description:
            "ابحث في الأدلة الصحية للمساعدة في الاكتشاف وقوائم التحقق والإرشادات غير الطبية.",
          tags: ["مقالات", "أدلة", "معلومات عامة"],
          meta: ["ليست نصيحة طبية"],
        },
      ],
    },
  },
} as const satisfies Record<
  DiscoveryKind,
  Record<SupportedLocale, Omit<PageCopy, keyof typeof common.en>>
>;

const relatedDiscoveryKinds: readonly DiscoveryKind[] = [
  "doctors",
  "centers",
  "pharmacies",
  "labs",
  "services",
  "search",
];

const articleLinks = {
  en: [
    {
      title: "How to use DrMuscat to find healthcare in Oman",
      slug: "how-to-use-drmuscat",
    },
    {
      title: "Choosing an area before comparing clinics",
      slug: "choosing-an-area-before-comparing-clinics",
    },
    {
      title: "Understanding common lab test listings",
      slug: "understanding-lab-test-listings",
    },
  ],
  ar: [
    {
      title: "كيفية استخدام دكتور مسقط لاكتشاف الرعاية الصحية",
      slug: "how-to-use-drmuscat",
    },
    {
      title: "اختيار المنطقة قبل مقارنة العيادات",
      slug: "choosing-an-area-before-comparing-clinics",
    },
    {
      title: "فهم قوائم الفحوصات المخبرية الشائعة",
      slug: "understanding-lab-test-listings",
    },
  ],
} as const satisfies Record<
  SupportedLocale,
  readonly { title: string; slug: string }[]
>;

function mergeCopy(locale: SupportedLocale, kind: DiscoveryKind): PageCopy {
  return { ...common[locale], ...pages[kind][locale] } as PageCopy;
}

function profileHrefForCard(
  locale: SupportedLocale,
  country: SupportedCountry,
  kind: DiscoveryKind,
  index: number,
) {
  const slugs: Record<DiscoveryKind, readonly string[]> = {
    doctors: [
      "doctor-profile-preview",
      "pediatrics-profile-preview",
      "dental-doctor-preview",
      "physiotherapy-profile-preview",
    ],
    centers: [
      "medical-center-preview",
      "dental-clinic-preview",
      "wellness-provider-preview",
      "pet-clinic-preview",
    ],
    pharmacies: [
      "pharmacy-preview",
      "delivery-pharmacy-preview",
      "wellness-pharmacy-preview",
      "24-hour-label-preview",
    ],
    labs: [
      "medical-lab-preview",
      "home-sample-preview",
      "diagnostic-center-preview",
      "lab-package-preview",
    ],
    services: ["dental-care", "lab-tests", "pharmacy-services", "pet-care"],
    search: [
      "doctor-profile-preview",
      "medical-center-preview",
      "pharmacy-preview",
      "lab-tests",
    ],
  };
  const slug = slugs[kind][index] ?? slugs[kind][0] ?? "medical-center-preview";
  if (kind === "doctors" || (kind === "search" && index === 0))
    return publicDoctorDetailRoute(locale, country, slug);
  return publicCenterDetailRoute(locale, country, slug);
}

export function DiscoveryPage2026({
  locale,
  country,
  kind,
  liveContent,
}: Props) {
  const [selectedCity, setSelectedCity] = useState("Muscat");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedChip, setSelectedChip] = useState("");
  const [actionNotice, setActionNotice] = useState("");
  const copy = useMemo(() => mergeCopy(locale, kind), [locale, kind]);
  const areaOptions = useMemo(
    () => getAreaOptionsForCity2026(locale, selectedCity),
    [locale, selectedCity],
  );
  const selectedAreaLabel = selectedArea || copy.allAreas;
  const isArabic = locale === "ar";
  const baseRoute = homeRoute(locale, country);
  const listRoute = publicListYourCenterRoute(locale, country);
  const providerRoute = publicProviderRoute(locale, country);
  const supportHref = drMuscatSupportWhatsAppUrl(locale);
  const relatedAreaOptions = areaOptions.slice(0, 8);
  const relatedRoutes = relatedDiscoveryKinds.map((slug) => ({
    slug,
    href: publicDiscoveryRoute(locale, country, slug),
    label:
      slug === "doctors"
        ? isArabic
          ? "الأطباء"
          : "Doctors"
        : slug === "centers"
          ? isArabic
            ? "المراكز"
            : "Centers"
          : slug === "pharmacies"
            ? isArabic
              ? "الصيدليات"
              : "Pharmacies"
            : slug === "labs"
              ? isArabic
                ? "المختبرات"
                : "Labs"
              : slug === "services"
                ? isArabic
                  ? "الخدمات"
                  : "Services"
                : isArabic
                  ? "البحث"
                  : "Search",
  }));

  return (
    <main dir={isArabic ? "rtl" : "ltr"} className="bg-slate-50 text-slate-950">
      <section className="overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.16),transparent_34%),linear-gradient(135deg,#f8fafc,#ffffff_45%,#ecfeff)] px-4 py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <nav
            aria-label={isArabic ? "مسار الصفحة" : "Breadcrumb"}
            className="mb-5 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500"
          >
            <Link href={baseRoute} className="hover:text-teal-700">
              {copy.breadcrumb}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-800">{copy.title}</span>
          </nav>

          <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div>
              <p className="mb-3 inline-flex rounded-full border border-teal-100 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-teal-700 shadow-sm">
                {copy.eyebrow}
              </p>
              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                {copy.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-650">
                {copy.subtitle}
              </p>
              <p className="mt-4 max-w-3xl rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-900">
                {copy.trustNote}
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/80 bg-white/90 p-4 shadow-2xl shadow-teal-900/10 backdrop-blur sm:p-5">
              <label
                className="text-sm font-black text-slate-700"
                htmlFor={`${kind}-search`}
              >
                {isArabic ? "بحث" : "Search"}
              </label>
              <input
                id={`${kind}-search`}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
                placeholder={copy.searchPlaceholder}
                type="search"
              />
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <label className="text-sm font-bold text-slate-600">
                  {copy.country}
                  <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm">
                    {countryOptions2026[locale].map((option) => (
                      <option
                        key={option.code}
                        value={option.code}
                        disabled={!option.active}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-bold text-slate-600">
                  {copy.city}
                  <select
                    value={selectedCity}
                    onChange={(event) => {
                      setSelectedCity(event.target.value);
                      setSelectedArea("");
                    }}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm"
                  >
                    {omanCityOptions2026[locale].map((city) => (
                      <option key={city.value} value={city.value}>
                        {city.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-bold text-slate-600">
                  {copy.area}
                  <select
                    value={selectedArea}
                    onChange={(event) => setSelectedArea(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm"
                  >
                    <option value="">{copy.allAreas}</option>
                    {areaOptions.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div
                className="mt-4 flex flex-wrap gap-2"
                aria-label={copy.category}
              >
                {copy.chips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setSelectedChip(chip)}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition ${selectedChip === chip ? "bg-teal-700 text-white shadow-lg shadow-teal-900/20" : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-teal-200 hover:bg-teal-50"}`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="rounded-[2rem] border border-teal-100 bg-white p-5 shadow-xl shadow-teal-900/5 lg:flex lg:items-center lg:justify-between lg:gap-6">
            <div>
              <div className="mb-3 inline-flex rounded-full bg-teal-700 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-white">
                {copy.sponsored}
              </div>
              <h2 className="text-2xl font-black text-slate-950">
                {copy.sponsoredTitle}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-650">
                {copy.sponsoredBody}
              </p>
              <p className="mt-3 max-w-3xl rounded-2xl bg-teal-50 px-4 py-3 text-sm font-semibold leading-6 text-teal-950">
                {copy.sponsoredDisclaimer}
              </p>
            </div>
            <Link
              href={providerRoute}
              className="mt-4 inline-flex shrink-0 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-900/15 transition hover:bg-teal-800 lg:mt-0"
            >
              {copy.sponsoredCta}
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
            <div className="space-y-5">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    {copy.resultsTitle}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {copy.resultsNote}
                  </p>
                </div>
                <label className="mt-4 block text-sm font-bold text-slate-600 sm:mt-0 sm:min-w-56">
                  {copy.sort}
                  <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm">
                    {copy.sorts.map((sort) => (
                      <option key={sort}>{sort}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-4">
                {copy.cards.map((card, index) => (
                  <div key={card.name}>
                    <article className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-900/10">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-slate-600">
                          {copy.samplePreview}
                        </span>
                        <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-800">
                          {card.category}
                        </span>
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-900">
                          {copy.noReviews}
                        </span>
                      </div>
                      <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
                        <div>
                          <h3 className="text-2xl font-black text-slate-950">
                            {card.name}
                          </h3>
                          <p className="mt-2 text-sm font-bold text-slate-600">
                            {card.location} · {card.hours}
                          </p>
                          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-650">
                            {card.description}
                          </p>
                          {card.serviceNote ? (
                            <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
                              {card.serviceNote}
                            </p>
                          ) : null}
                          <div className="mt-4 flex flex-wrap gap-2">
                            {card.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                            {card.meta.map((item) => (
                              <span key={item}>{item}</span>
                            ))}
                            <span>{copy.reviewsModerated}</span>
                          </div>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2 lg:w-56 lg:grid-cols-2 lg:self-center">
                          <Link
                            href={profileHrefForCard(
                              locale,
                              country,
                              kind,
                              index,
                            )}
                            className="col-span-2 min-h-11 rounded-full bg-teal-800 px-4 py-3 text-center text-sm font-black text-white shadow-sm transition hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                          >
                            {copy.view}
                          </Link>
                          <button
                            type="button"
                            onClick={() => setActionNotice(copy.actionNotice)}
                            className="min-h-11 rounded-full bg-emerald-600 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                          >
                            {copy.whatsapp}
                          </button>
                          <button
                            type="button"
                            onClick={() => setActionNotice(copy.actionNotice)}
                            className="min-h-11 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:border-teal-200 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                          >
                            {copy.call}
                          </button>
                          <button
                            type="button"
                            onClick={() => setActionNotice(copy.actionNotice)}
                            className="col-span-2 min-h-11 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:border-teal-200 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                          >
                            {copy.directions}
                          </button>
                        </div>
                      </div>
                    </article>
                    {index === 2 ? (
                      <article className="mt-4 rounded-[2rem] border border-dashed border-teal-300 bg-teal-50/80 p-5 shadow-sm">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-teal-800">
                          {copy.sponsored}
                        </span>
                        <h3 className="mt-3 text-xl font-black text-slate-950">
                          {copy.inListSponsoredTitle}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-650">
                          {copy.sponsoredDisclaimer}
                        </p>
                      </article>
                    ) : null}
                  </div>
                ))}
              </div>

              {liveContent ? (
                <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
                  {liveContent}
                </div>
              ) : null}

              <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-2xl font-black text-slate-950">
                  {copy.emptyTitle}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-650">
                  {copy.emptyBody}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={listRoute}
                    className="rounded-full bg-teal-700 px-4 py-2 text-sm font-black text-white hover:bg-teal-800"
                  >
                    {copy.providerCtaButton}
                  </Link>
                  <a
                    href={supportHref}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-50"
                  >
                    {isArabic ? "دعم واتساب" : "WhatsApp support"}
                  </a>
                </div>
              </div>
            </div>

            <aside className="space-y-5">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5 lg:sticky lg:top-24">
                <span className="rounded-full bg-teal-700 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-white">
                  {copy.sponsored}
                </span>
                <h2 className="mt-3 text-xl font-black text-slate-950">
                  {copy.sidebarSponsoredTitle}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-650">
                  {copy.sidebarSponsoredBody}
                </p>
                <p className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-600">
                  {copy.sponsoredDisclaimer}
                </p>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-xl font-black text-slate-950">
                  {copy.nearbyTitle}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {selectedCity} · {selectedAreaLabel}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {relatedAreaOptions.map((area) => (
                    <button
                      type="button"
                      key={area}
                      onClick={() => setSelectedArea(area)}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:border-teal-200 hover:bg-teal-50"
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          {copy.groupedResults ? (
            <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">
                {copy.groupedResultsTitle}
              </h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
                {copy.groupedResults.map((group) => (
                  <article
                    key={group.label}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <h3 className="font-black text-slate-950">{group.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {group.body}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          <section className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">
                {copy.categoryTitle}
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {relatedRoutes.map((route) => (
                  <Link
                    key={route.slug}
                    href={route.href}
                    className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-black text-slate-700 hover:border-teal-200 hover:bg-teal-50"
                  >
                    {route.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">
                {copy.relatedArticlesTitle}
              </h2>
              <div className="mt-4 grid gap-3">
                {articleLinks[locale].map((article) => (
                  <Link
                    key={article.slug}
                    href={publicArticleDetailRoute(
                      locale,
                      country,
                      article.slug,
                    )}
                    className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:border-teal-200 hover:bg-teal-50"
                  >
                    {article.title}
                  </Link>
                ))}
                <Link
                  href={publicArticlesRoute(locale, country)}
                  className="rounded-3xl bg-slate-950 px-4 py-3 text-sm font-black text-white hover:bg-teal-800"
                >
                  {isArabic ? "تصفح كل المقالات" : "Browse all articles"}
                </Link>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-3xl font-black text-slate-950">
              {copy.seoTitle}
            </h2>
            <div className="mt-4 grid gap-4 text-sm leading-7 text-slate-650 lg:grid-cols-3">
              {copy.seoParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {relatedRoutes.slice(0, 5).map((route) => (
                <Link
                  key={route.slug}
                  href={route.href}
                  className="rounded-full bg-teal-50 px-4 py-2 text-sm font-black text-teal-800 hover:bg-teal-100"
                >
                  {route.label}
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-3xl font-black text-slate-950">
              {copy.faqTitle}
            </h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {copy.faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-3xl border border-slate-200 bg-slate-50 p-4 open:bg-white open:shadow-sm"
                >
                  <summary className="cursor-pointer list-none text-base font-black text-slate-950 marker:hidden">
                    {faq.q}
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-slate-650">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/20 sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-8">
            <div>
              <h2 className="text-3xl font-black">{copy.providerCtaTitle}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                {copy.providerCtaBody}
              </p>
            </div>
            <Link
              href={listRoute}
              className="mt-5 inline-flex rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-lg transition hover:bg-teal-50 lg:mt-0"
            >
              {copy.providerCtaButton}
            </Link>
          </section>

          <section className="rounded-[2rem] border border-amber-100 bg-amber-50 p-5 text-amber-950 shadow-sm">
            <h2 className="text-xl font-black">{copy.safetyTitle}</h2>
            <p className="mt-2 text-sm font-semibold leading-7">
              {copy.safety}
            </p>
          </section>

          {actionNotice ? (
            <p
              role="status"
              className="rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm font-bold text-teal-900"
            >
              {actionNotice}
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
