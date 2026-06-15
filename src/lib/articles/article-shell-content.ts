import type { SupportedLocale } from '@/lib/i18n/config';

export type ArticleShellCard = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readingTime: string;
  mediaLabel: string;
};

export type ArticleShellFaq = {
  question: string;
  answer: string;
};

export type ArticleShellCategory = {
  title: string;
  description: string;
  shortLabel: string;
};

export type ArticleShellCopy = {
  eyebrow: string;
  heroTitle: string;
  heroIntro: string;
  primaryCta: string;
  secondaryCta: string;
  trustNote: string;
  filterLabel: string;
  categories: readonly ArticleShellCategory[];
  featuredLabel: string;
  latestLabel: string;
  sectionLabel: string;
  categorySectionTitle: string;
  faqTitle: string;
  faqIntro: string;
  faqs: readonly ArticleShellFaq[];
  newsletterTitle: string;
  newsletterBody: string;
  disclaimerTitle: string;
  disclaimerBody: string;
  viewGuide: string;
  imageReady: string;
  videoReady: string;
  cards: readonly ArticleShellCard[];
  detail: {
    badge: string;
    titlePrefix: string;
    excerpt: string;
    authorLabel: string;
    authorValue: string;
    reviewerLabel: string;
    reviewerValue: string;
    updatedLabel: string;
    updatedValue: string;
    readingLabel: string;
    readingValue: string;
    heroImage: string;
    heroCaption: string;
    videoTitle: string;
    videoBody: string;
    tocTitle: string;
    bodyTitle: string;
    bodyLead: string;
    bodySections: readonly string[];
    inlineImage: string;
    inlineCaption: string;
    relatedDoctors: string;
    relatedDoctorsBody: string;
    relatedCenters: string;
    relatedCentersBody: string;
    sponsored: string;
    featuredClinic: string;
    promotedDoctor: string;
    sponsoredBody: string;
    faqTitle: string;
    relatedArticles: string;
    backToArticles: string;
  };
};

export const articleShellContent: Record<SupportedLocale, ArticleShellCopy> = {
  en: {
    eyebrow: 'DrMuscat Articles',
    heroTitle: 'Practical health guides for choosing care in Oman',
    heroIntro:
      'A polished editorial shell for future reviewed guides about clinics, beauty, wellness, pharmacies, and labs. The content here is safe placeholder structure only, not medical advice.',
    primaryCta: 'Explore guides',
    secondaryCta: 'View featured guide',
    trustNote: 'Future published articles will require approved editorial review before going live.',
    filterLabel: 'Guide categories',
    categories: [
      { title: 'Dental', description: 'Clinic-choice questions, service pages, and booking preparation.', shortLabel: 'D' },
      { title: 'Dermatology / Beauty', description: 'Consultation preparation and provider information checklists.', shortLabel: 'DB' },
      { title: 'Clinics & Hospitals', description: 'How to understand services, locations, and care options.', shortLabel: 'CH' },
      { title: 'Wellness', description: 'Safe appointment-prep prompts for future wellness guides.', shortLabel: 'W' },
      { title: 'Pharmacies / Labs', description: 'Future explainers for practical service discovery in Oman.', shortLabel: 'PL' }
    ],
    featuredLabel: 'Featured guide shell',
    latestLabel: 'Latest editorial shells',
    sectionLabel: 'Image-ready guide cards',
    categorySectionTitle: 'Editorial categories prepared for review',
    faqTitle: 'Articles FAQ',
    faqIntro: 'Safe answers about how this article section will work after future content approval.',
    faqs: [
      { question: 'Are DrMuscat articles medical advice?', answer: 'No. They are informational guides and do not replace advice from a qualified healthcare professional.' },
      { question: 'Will articles include doctors and clinics?', answer: 'Future article pages can link to related doctors, centers, offers, and sponsored placements when approved.' },
      { question: 'Will videos be included?', answer: 'The article layout is prepared for YouTube/video guides in a later content phase.' },
      { question: 'Are sponsored placements labeled?', answer: 'Yes. Sponsored or promoted placements should be clearly labeled.' }
    ],
    newsletterTitle: 'Future article updates',
    newsletterBody: 'A future contact or newsletter experience can connect here after an approved backend phase. No subscription backend is active in this shell.',
    disclaimerTitle: 'Medical disclaimer',
    disclaimerBody:
      'These article pages are informational placeholders only. They do not diagnose, treat, prescribe, rank providers, or replace advice from a qualified healthcare professional.',
    viewGuide: 'View guide',
    imageReady: 'Image-ready',
    videoReady: 'Video-ready',
    cards: [
      {
        slug: 'how-to-choose-a-dental-clinic-in-muscat',
        category: 'Dental',
        title: 'How to choose a dental clinic in Muscat',
        excerpt: 'A future editorial checklist shell for comparing clinic information, location, services, and questions to ask before booking.',
        readingTime: '5 min shell',
        mediaLabel: 'Hero image slot'
      },
      {
        slug: 'what-to-check-before-booking-dermatology',
        category: 'Dermatology / Beauty',
        title: 'What to check before booking a dermatology consultation',
        excerpt: 'A safe structure for future non-diagnostic guidance about credentials, consultation goals, and provider information.',
        readingTime: '4 min shell',
        mediaLabel: 'Video-ready slot'
      },
      {
        slug: 'understanding-clinic-services-in-oman',
        category: 'Clinics & Hospitals',
        title: 'Understanding clinic services in Oman',
        excerpt: 'A future explainer shell for helping users read service pages and prepare practical questions for providers.',
        readingTime: '6 min shell',
        mediaLabel: 'Editorial image slot'
      },
      {
        slug: 'questions-before-a-wellness-treatment',
        category: 'Wellness',
        title: 'Questions to ask before a wellness treatment',
        excerpt: 'A placeholder guide pattern for appointment preparation without treatment instructions or outcome claims.',
        readingTime: '4 min shell',
        mediaLabel: 'Image-ready slot'
      }
    ],
    detail: {
      badge: 'Article shell',
      titlePrefix: 'Guide shell:',
      excerpt: 'This premium editorial shell reserves safe areas for reviewed copy, media, provider context, and sponsorship labels without publishing medical advice.',
      authorLabel: 'Author',
      authorValue: 'DrMuscat editorial team placeholder',
      reviewerLabel: 'Medical reviewer',
      reviewerValue: 'Pending approved review workflow',
      updatedLabel: 'Last updated',
      updatedValue: 'Set when real content is approved',
      readingLabel: 'Reading time',
      readingValue: '5 min placeholder',
      heroImage: 'Future hero image',
      heroCaption: 'Alt-text and caption-ready media slot for approved editorial imagery.',
      videoTitle: 'Video guide coming soon',
      videoBody: 'Future YouTube embed or thumbnail preview slot. No video API integration is active.',
      tocTitle: 'In this guide',
      bodyTitle: 'Future article body preview',
      bodyLead: 'Approved editorial content can later explain how to compare provider information, what questions to prepare, and when to speak directly with a qualified professional.',
      bodySections: ['Provider information checklist', 'Questions to prepare before booking', 'When to contact a qualified professional'],
      inlineImage: 'Inline editorial image',
      inlineCaption: 'Caption-ready image slot for future reviewed content.',
      relatedDoctors: 'Related doctors',
      relatedDoctorsBody: 'Future data-backed provider links can appear here after approval. No recommendations are active yet.',
      relatedCenters: 'Related centers',
      relatedCentersBody: 'Future center links can appear here after approval. No clinic recommendations are active yet.',
      sponsored: 'Sponsored',
      featuredClinic: 'Featured clinic',
      promotedDoctor: 'Promoted doctor',
      sponsoredBody: 'Future paid placements must remain clearly labeled and separated from editorial content.',
      faqTitle: 'Article FAQ',
      relatedArticles: 'Related article placeholders for future data-backed content.',
      backToArticles: 'Back to articles'
    }
  },
  ar: {
    eyebrow: 'مقالات DrMuscat',
    heroTitle: 'أدلة عملية لاختيار الرعاية في عُمان',
    heroIntro:
      'هيكل تحريري مصقول لأدلة مستقبلية مراجعة عن العيادات والتجميل والرفاهية والصيدليات والمختبرات. المحتوى هنا بنية آمنة فقط وليس نصيحة طبية.',
    primaryCta: 'استكشف الأدلة',
    secondaryCta: 'عرض الدليل المميز',
    trustNote: 'أي مقالات فعلية لاحقاً تحتاج مراجعة تحريرية معتمدة قبل النشر.',
    filterLabel: 'تصنيفات الأدلة',
    categories: [
      { title: 'الأسنان', description: 'أسئلة اختيار العيادات والخدمات والتحضير للحجز.', shortLabel: 'أس' },
      { title: 'الجلدية / التجميل', description: 'تحضير الاستشارة وقوائم التحقق من معلومات مقدم الخدمة.', shortLabel: 'جت' },
      { title: 'العيادات والمستشفيات', description: 'فهم الخدمات والمواقع وخيارات الرعاية.', shortLabel: 'عم' },
      { title: 'الرفاهية', description: 'أسئلة تحضير آمنة لأدلة الرفاهية المستقبلية.', shortLabel: 'رف' },
      { title: 'الصيدليات / المختبرات', description: 'شروحات مستقبلية لاكتشاف الخدمات العملية في عُمان.', shortLabel: 'صم' }
    ],
    featuredLabel: 'هيكل دليل مميز',
    latestLabel: 'أحدث الهياكل التحريرية',
    sectionLabel: 'بطاقات أدلة جاهزة للصور',
    categorySectionTitle: 'تصنيفات تحريرية جاهزة للمراجعة',
    faqTitle: 'أسئلة شائعة عن المقالات',
    faqIntro: 'إجابات آمنة حول طريقة عمل قسم المقالات بعد اعتماد المحتوى مستقبلاً.',
    faqs: [
      { question: 'هل مقالات DrMuscat نصيحة طبية؟', answer: 'لا. هي أدلة معلوماتية ولا تغني عن استشارة مختص صحي مؤهل.' },
      { question: 'هل ستتضمن المقالات أطباء وعيادات؟', answer: 'يمكن للصفحات المستقبلية ربط أطباء ومراكز وعروض ومساحات رعاية عند اعتماد ذلك.' },
      { question: 'هل ستتوفر فيديوهات؟', answer: 'تم تجهيز تصميم المقال لمساحات فيديو أو YouTube في مرحلة محتوى لاحقة.' },
      { question: 'هل يتم توضيح المحتوى الممول؟', answer: 'نعم. يجب تمييز أي مساحة رعاية أو ترويج بوضوح.' }
    ],
    newsletterTitle: 'تنبيهات المقالات لاحقاً',
    newsletterBody: 'يمكن ربط تجربة تواصل أو نشرة بريدية هنا في مرحلة خلفية معتمدة لاحقاً. لا توجد خدمة اشتراك مفعّلة في هذا الهيكل.',
    disclaimerTitle: 'تنبيه طبي',
    disclaimerBody:
      'هذه الصفحات هياكل معلوماتية فقط. لا تقدم تشخيصاً أو علاجاً أو وصفات أو ترتيباً لمقدمي الخدمة، ولا تغني عن استشارة مختص مؤهل.',
    viewGuide: 'عرض الدليل',
    imageReady: 'جاهز للصور',
    videoReady: 'جاهز للفيديو',
    cards: [
      {
        slug: 'how-to-choose-a-dental-clinic-in-muscat',
        category: 'الأسنان',
        title: 'كيف تختار عيادة أسنان في مسقط',
        excerpt: 'هيكل تحريري مستقبلي للمقارنة بين معلومات العيادات والموقع والخدمات والأسئلة قبل الحجز.',
        readingTime: 'هيكل ٥ دقائق',
        mediaLabel: 'مساحة صورة رئيسية'
      },
      {
        slug: 'what-to-check-before-booking-dermatology',
        category: 'الجلدية / التجميل',
        title: 'ما الذي يمكن التحقق منه قبل حجز استشارة جلدية',
        excerpt: 'بنية آمنة لمحتوى مستقبلي غير تشخيصي حول معلومات مقدم الخدمة وأهداف الاستشارة.',
        readingTime: 'هيكل ٤ دقائق',
        mediaLabel: 'مساحة فيديو لاحقاً'
      },
      {
        slug: 'understanding-clinic-services-in-oman',
        category: 'العيادات والمستشفيات',
        title: 'فهم خدمات العيادات في عُمان',
        excerpt: 'هيكل شرح مستقبلي يساعد المستخدمين على قراءة صفحات الخدمات وتجهيز أسئلة عملية.',
        readingTime: 'هيكل ٦ دقائق',
        mediaLabel: 'مساحة صورة تحريرية'
      },
      {
        slug: 'questions-before-a-wellness-treatment',
        category: 'الرفاهية',
        title: 'أسئلة قبل اختيار خدمة رفاهية',
        excerpt: 'نمط إرشادي مبدئي للتحضير للموعد دون تعليمات علاجية أو وعود بنتائج.',
        readingTime: 'هيكل ٤ دقائق',
        mediaLabel: 'مساحة صورة لاحقاً'
      }
    ],
    detail: {
      badge: 'هيكل مقال',
      titlePrefix: 'هيكل دليل:',
      excerpt: 'هيكل تحريري مصقول يحجز أماكن آمنة للنصوص المعتمدة والوسائط وسياق مقدمي الخدمة وعلامات الرعاية دون نشر نصائح طبية.',
      authorLabel: 'المؤلف',
      authorValue: 'فريق DrMuscat التحريري - مساحة مؤقتة',
      reviewerLabel: 'المراجع الطبي',
      reviewerValue: 'بانتظار مسار مراجعة معتمد',
      updatedLabel: 'آخر تحديث',
      updatedValue: 'يحدد عند اعتماد محتوى فعلي',
      readingLabel: 'مدة القراءة',
      readingValue: '٥ دقائق - مؤقت',
      heroImage: 'صورة رئيسية مستقبلية',
      heroCaption: 'مساحة وسائط جاهزة للنص البديل والتعليق عند اعتماد الصور.',
      videoTitle: 'فيديو إرشادي قريباً',
      videoBody: 'مساحة مستقبلية لتضمين YouTube أو معاينة مصغرة. لا يوجد تكامل API للفيديو حالياً.',
      tocTitle: 'داخل هذا الدليل',
      bodyTitle: 'معاينة أقسام المقال المستقبلية',
      bodyLead: 'يمكن للمحتوى المعتمد لاحقاً شرح كيفية مقارنة معلومات مقدمي الخدمة والأسئلة العملية ومتى يجب التواصل مع مختص مؤهل.',
      bodySections: ['قائمة تحقق لمعلومات مقدم الخدمة', 'أسئلة للتحضير قبل الحجز', 'متى تتواصل مع مختص مؤهل'],
      inlineImage: 'صورة تحريرية داخلية',
      inlineCaption: 'مساحة صورة جاهزة للتعليق في محتوى مستقبلي مراجع.',
      relatedDoctors: 'أطباء ذو صلة',
      relatedDoctorsBody: 'يمكن ظهور روابط أطباء معتمدة لاحقاً. لا توجد توصيات نشطة حالياً.',
      relatedCenters: 'مراكز ذات صلة',
      relatedCentersBody: 'يمكن ظهور روابط مراكز معتمدة لاحقاً. لا توجد توصيات عيادات نشطة حالياً.',
      sponsored: 'Sponsored',
      featuredClinic: 'Featured clinic',
      promotedDoctor: 'Promoted doctor',
      sponsoredBody: 'أي مساحات مدفوعة مستقبلية يجب أن تبقى واضحة ومنفصلة عن المحتوى التحريري.',
      faqTitle: 'أسئلة شائعة عن المقال',
      relatedArticles: 'مساحات مقالات ذات صلة لاحقاً عند توفر محتوى فعلي.',
      backToArticles: 'العودة إلى المقالات'
    }
  }
};

export function getArticleShellCard(locale: SupportedLocale, slug: string): ArticleShellCard {
  const fallback = articleShellContent[locale].cards[0];

  if (!fallback) {
    throw new Error('Article shell content requires at least one shell card.');
  }

  return articleShellContent[locale].cards.find((card) => card.slug === slug) ?? fallback;
}
