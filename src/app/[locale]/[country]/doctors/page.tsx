const pageCopy = {
  en: {
    badge: 'Doctor discovery · Oman',
    title: 'Find doctors in Oman with DrMuscat.',
    body: 'A premium public discovery page prepared for approved doctor profiles, helpful guides, visibility slots, and reviewed offers.',
    search: 'Search doctors',
    provider: 'List your center',
    imageTitle: 'Image-ready hero space',
    imageBody: 'Prepared for a real approved doctor, clinic, or editorial image.',
    searchTitle: 'Search the published doctor list.',
    placeholder: 'Search doctor name or title…',
    emptyTitle: 'Doctor profiles are ready to appear here after approval.',
    emptyBody: 'No public doctor listings are published yet. Private or unreviewed records stay hidden.',
    ad: 'Sponsored placement',
    adTitle: 'Doctor visibility slots, clearly labeled.',
    offer: 'Special offers',
    offerTitle: 'Reviewed care offers can sit beside doctor discovery.',
    articles: 'Guides',
    articlesTitle: 'Helpful guides for choosing care.',
    faq: 'FAQ',
    faqTitle: 'Before using doctor discovery',
    safety: 'Discovery safety',
    chips: ['Pediatrics', 'Dermatology', 'Dentistry', 'Gynecology', 'ENT', 'Orthopedics'],
    safetyItems: ['Public discovery only', 'Informational only', 'Approved listings only']
  },
  ar: {
    badge: 'اكتشاف الأطباء · عُمان',
    title: 'ابحث عن أطباء في عُمان عبر DrMuscat.',
    body: 'صفحة اكتشاف عامة مميزة جاهزة لملفات الأطباء المعتمدة والأدلة ومساحات الظهور والعروض بعد المراجعة.',
    search: 'ابحث عن الأطباء',
    provider: 'أدرج مركزك',
    imageTitle: 'مساحة صورة جاهزة',
    imageBody: 'مجهزة لصورة طبيب أو عيادة أو صورة تحريرية معتمدة.',
    searchTitle: 'ابحث في قائمة الأطباء المنشورة.',
    placeholder: 'ابحث باسم الطبيب أو اللقب…',
    emptyTitle: 'ملفات الأطباء جاهزة للظهور هنا بعد الاعتماد.',
    emptyBody: 'لا توجد قوائم أطباء عامة منشورة بعد. تبقى السجلات الخاصة أو غير المراجعة مخفية.',
    ad: 'مساحة ممولة',
    adTitle: 'مساحات ظهور للأطباء مع تمييز واضح.',
    offer: 'عروض خاصة',
    offerTitle: 'يمكن للعروض المعتمدة أن تظهر بجانب اكتشاف الأطباء.',
    articles: 'أدلة',
    articlesTitle: 'أدلة مفيدة لاختيار الرعاية.',
    faq: 'أسئلة',
    faqTitle: 'قبل استخدام اكتشاف الأطباء',
    safety: 'سلامة الاكتشاف',
    chips: ['طب الأطفال', 'جلدية', 'أسنان', 'نساء وولادة', 'أنف وأذن وحنجرة', 'عظام'],
    safetyItems: ['اكتشاف عام فقط', 'معلومات فقط', 'قوائم معتمدة فقط']
  }
} as const;

type Params = { locale: string; country: string };

export default async function DoctorsPage({ params }: { params: Promise<Params> }) {
  const { locale, country } = await params;
  const safeLocale = locale === 'ar' ? 'ar' : 'en';
  const copy = pageCopy[safeLocale];
  const dir = safeLocale === 'ar' ? 'rtl' : 'ltr';

  return (
    <main className="dm2026-shell dm2026-doctors-page" dir={dir} data-country={country} data-locale={safeLocale}>
      <section className="dm2026-doctors-hero">
        <div className="dm2026-container dm2026-doctors-hero__grid">
          <div className="dm2026-glass dm2026-doctors-hero__copy">
            <span className="dm2026-badge">{copy.badge}</span>
            <h1>{copy.title}</h1>
            <p>{copy.body}</p>
            <div className="dm2026-doctors-hero__actions">
              <a className="dm2026-button dm2026-button-primary" href="#doctor-search">{copy.search}</a>
              <a className="dm2026-button dm2026-button-secondary" href={`/${safeLocale}/${country}/for-providers`}>{copy.provider}</a>
            </div>
          </div>

          <figure className="dm2026-card-glass dm2026-doctors-image-card">
            <div className="dm2026-doctors-image-slot">
              <figcaption className="dm2026-doctors-image-slot__copy">
                <strong>{copy.imageTitle}</strong>
                <span>{copy.imageBody}</span>
              </figcaption>
            </div>
          </figure>
        </div>
      </section>

      <section id="doctor-search" className="dm2026-container dm2026-doctors-search-section">
        <div className="dm2026-search-surface dm2026-doctors-search">
          <header className="dm2026-doctors-search__header">
            <span className="dm2026-badge">{copy.search}</span>
            <h2>{copy.searchTitle}</h2>
            <p>{copy.body}</p>
          </header>
          <form className="dm2026-doctors-search__row">
            <label className="sr-only" htmlFor="doctors-page-search">{copy.placeholder}</label>
            <input className="dm2026-input" id="doctors-page-search" placeholder={copy.placeholder} type="search" />
            <button className="dm2026-button dm2026-button-primary" type="button">{copy.search}</button>
          </form>
          <div className="dm2026-doctors-chip-row">
            {copy.chips.map((chip) => <span className="dm2026-doctors-chip" key={chip}>{chip}</span>)}
          </div>
        </div>
      </section>

      <section className="dm2026-container dm2026-doctors-results">
        <div className="dm2026-card-glass dm2026-doctors-empty">
          <h3>{copy.emptyTitle}</h3>
          <p>{copy.emptyBody}</p>
        </div>
      </section>

      <section className="dm2026-container dm2026-section">
        <div className="dm2026-doctors-compact-grid">
          <article className="dm2026-card-glass dm2026-doctors-module"><span className="dm2026-badge">{copy.ad}</span><h3>{copy.adTitle}</h3></article>
          <article className="dm2026-card-glass dm2026-doctors-module"><span className="dm2026-badge">{copy.offer}</span><h3>{copy.offerTitle}</h3></article>
        </div>
      </section>

      <section className="dm2026-container dm2026-section"><header className="dm2026-section-header dm2026-doctors-section-header"><span className="dm2026-badge">{copy.articles}</span><h2>{copy.articlesTitle}</h2></header></section>
      <section className="dm2026-container dm2026-section"><header className="dm2026-section-header dm2026-doctors-section-header"><span className="dm2026-badge">{copy.faq}</span><h2>{copy.faqTitle}</h2></header></section>
      <section className="dm2026-container"><div className="dm2026-glass dm2026-doctors-safety"><strong>{copy.safety}</strong><ul>{copy.safetyItems.map((item) => <li key={item}>{item}</li>)}</ul></div></section>
    </main>
  );
}
