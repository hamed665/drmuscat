type Params = { locale: string; country: string };

type Copy = {
  badge: string;
  title: string;
  body: string;
  primaryCta: string;
  providerCta: string;
  mediaLabel: string;
  mediaTitle: string;
  mediaBody: string;
  searchBadge: string;
  searchTitle: string;
  searchBody: string;
  placeholder: string;
  searchButton: string;
  quickPaths: string;
  trustTitle: string;
  trustItems: readonly string[];
  filters: readonly string[];
};

const copyByLocale: Record<'en' | 'ar', Copy> = {
  en: {
    badge: 'Doctor discovery · Oman',
    title: 'Find doctors in Oman with a premium DrMuscat experience.',
    body:
      'Section one builds the top discovery experience only: a refined hero, real image-ready space, premium search surface, and safe trust cues. Public doctor cards, FAQ, articles, ads and offers stay for the next sections.',
    primaryCta: 'Search doctors',
    providerCta: 'List your center',
    mediaLabel: 'Image slot',
    mediaTitle: 'Real provider image area',
    mediaBody:
      'Prepared for an approved doctor, clinic, or editorial image. Decorative SVG stays subtle and does not replace the photo area.',
    searchBadge: 'Doctor search',
    searchTitle: 'Start with name, specialty, or care path.',
    searchBody:
      'The UI is ready for doctor search and future data-backed filters. Nothing here invents doctors, ratings, reviews, prices, or availability.',
    placeholder: 'Search doctor name, specialty, clinic, or area…',
    searchButton: 'Search',
    quickPaths: 'Popular paths',
    trustTitle: 'Discovery safety',
    trustItems: ['Public discovery only', 'Not medical advice', 'Approved listings only', 'Confirm details with providers'],
    filters: ['Pediatrics', 'Dermatology', 'Dentistry', 'Gynecology', 'ENT', 'Orthopedics', 'General Practice', 'Cardiology']
  },
  ar: {
    badge: 'اكتشاف الأطباء · عُمان',
    title: 'ابحث عن أطباء في عُمان بتجربة DrMuscat مميزة.',
    body:
      'يبني القسم الأول تجربة الاكتشاف العلوية فقط: واجهة بطل أنيقة، مساحة صورة حقيقية، بحث زجاجي مميز، وملاحظات ثقة آمنة. بطاقات الأطباء والأسئلة والمقالات والإعلانات والعروض تبقى للأقسام التالية.',
    primaryCta: 'ابحث عن الأطباء',
    providerCta: 'أدرج مركزك',
    mediaLabel: 'مساحة صورة',
    mediaTitle: 'منطقة صورة لمقدم خدمة حقيقي',
    mediaBody:
      'مجهزة لصورة طبيب أو عيادة أو صورة تحريرية معتمدة. تبقى رسومات SVG زخرفية وخفيفة ولا تستبدل مساحة الصورة.',
    searchBadge: 'بحث الأطباء',
    searchTitle: 'ابدأ بالاسم أو التخصص أو مسار الرعاية.',
    searchBody:
      'الواجهة جاهزة للبحث عن الأطباء وفلاتر مستقبلية مرتبطة بالبيانات. لا يتم اختراع أطباء أو تقييمات أو أسعار أو توفر.',
    placeholder: 'ابحث باسم الطبيب أو التخصص أو العيادة أو المنطقة…',
    searchButton: 'بحث',
    quickPaths: 'مسارات شائعة',
    trustTitle: 'سلامة الاكتشاف',
    trustItems: ['اكتشاف عام فقط', 'ليست نصيحة طبية', 'قوائم معتمدة فقط', 'أكّد التفاصيل مع مقدمي الخدمة'],
    filters: ['طب الأطفال', 'جلدية', 'أسنان', 'نساء وولادة', 'أنف وأذن وحنجرة', 'عظام', 'طب عام', 'قلب']
  }
};

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  const safeLocale = locale === 'ar' ? 'ar' : 'en';
  const copy = copyByLocale[safeLocale];

  return {
    title: safeLocale === 'ar' ? 'الأطباء في عُمان | DrMuscat' : 'Doctors in Oman | DrMuscat',
    description: copy.body
  };
}

function PremiumDoctorGlyph() {
  return (
    <svg aria-hidden="true" className="dm-doctors-a__glyph" viewBox="0 0 168 168" focusable="false">
      <defs>
        <linearGradient id="doctorGlyphStroke" x1="22" x2="144" y1="24" y2="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--dm-teal-700)" />
          <stop offset="0.58" stopColor="var(--dm-teal-400)" />
          <stop offset="1" stopColor="var(--dm-gold-500)" />
        </linearGradient>
        <radialGradient id="doctorGlyphGlow" cx="50%" cy="45%" r="62%">
          <stop offset="0" stopColor="rgba(255,255,255,0.86)" />
          <stop offset="1" stopColor="rgba(42,161,146,0.08)" />
        </radialGradient>
      </defs>
      <circle cx="84" cy="84" r="76" fill="url(#doctorGlyphGlow)" />
      <path d="M44 42v35c0 24 34 24 34 0V42M78 77c5 34 52 39 62 10" fill="none" stroke="url(#doctorGlyphStroke)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="10" />
      <circle cx="140" cy="87" r="10" fill="var(--dm-teal-800)" />
      <path d="M34 124h29l8-18 14 36 13-25h36" fill="none" stroke="var(--dm-gold-500)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7" />
      <path d="M37 41h16M68 41h16" fill="none" stroke="rgba(7,48,44,0.28)" strokeLinecap="round" strokeWidth="5" />
    </svg>
  );
}

function ImageSlotSymbol() {
  return (
    <svg aria-hidden="true" className="dm-doctors-a__image-symbol" viewBox="0 0 180 140" focusable="false">
      <path d="M24 104c22-35 45-45 68-28 14 10 24 13 39-5 11-14 19-17 29-10" fill="none" stroke="rgba(14,110,100,0.35)" strokeLinecap="round" strokeWidth="8" />
      <circle cx="58" cy="48" r="17" fill="rgba(201,162,75,0.28)" />
      <rect x="14" y="18" width="152" height="104" rx="26" fill="none" stroke="rgba(14,110,100,0.22)" strokeDasharray="7 10" strokeWidth="3" />
    </svg>
  );
}

export default async function DoctorsPage({ params }: { params: Promise<Params> }) {
  const { locale, country } = await params;
  const safeLocale = locale === 'ar' ? 'ar' : 'en';
  const copy = copyByLocale[safeLocale];
  const dir = safeLocale === 'ar' ? 'rtl' : 'ltr';
  const rootPath = `/${safeLocale}/${country}`;

  return (
    <main className="dm2026-shell dm-doctors-a" dir={dir} data-country={country} data-locale={safeLocale}>
      <style>{styles}</style>

      <section className="dm-doctors-a__section" aria-labelledby="doctors-a-title">
        <div className="dm2026-container dm-doctors-a__grid">
          <div className="dm2026-glass dm-doctors-a__hero-card">
            <span className="dm2026-badge dm-doctors-a__badge">{copy.badge}</span>
            <h1 id="doctors-a-title">{copy.title}</h1>
            <p>{copy.body}</p>
            <div className="dm-doctors-a__actions">
              <a className="dm2026-button dm2026-button-primary" href="#doctor-search-a">{copy.primaryCta}</a>
              <a className="dm2026-button dm2026-button-secondary" href={`${rootPath}/for-providers`}>{copy.providerCta}</a>
            </div>
            <div className="dm2026-glass dm-doctors-a__trust" aria-label={copy.trustTitle}>
              <strong>{copy.trustTitle}</strong>
              <ul>
                {copy.trustItems.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>

          <figure className="dm2026-card-glass dm-doctors-a__media-card">
            <div className="dm-doctors-a__media-window">
              <ImageSlotSymbol />
              <PremiumDoctorGlyph />
              <figcaption>
                <span className="dm2026-badge">{copy.mediaLabel}</span>
                <strong>{copy.mediaTitle}</strong>
                <small>{copy.mediaBody}</small>
              </figcaption>
            </div>
          </figure>
        </div>
      </section>

      <section id="doctor-search-a" className="dm2026-container dm-doctors-a__search-wrap" aria-labelledby="doctors-a-search-title">
        <div className="dm2026-search-surface dm-doctors-a__search">
          <header>
            <span className="dm2026-badge">{copy.searchBadge}</span>
            <h2 id="doctors-a-search-title">{copy.searchTitle}</h2>
            <p>{copy.searchBody}</p>
          </header>
          <form className="dm-doctors-a__search-row">
            <label className="sr-only" htmlFor="doctors-a-input">{copy.placeholder}</label>
            <input className="dm2026-input" id="doctors-a-input" name="q" placeholder={copy.placeholder} type="search" />
            <button className="dm2026-button dm2026-button-primary" type="button">{copy.searchButton}</button>
          </form>
          <div className="dm-doctors-a__quick-paths">
            <span className="dm2026-badge">{copy.quickPaths}</span>
            <div>
              {copy.filters.map((filter) => <button className="dm-doctors-a__chip" key={filter} type="button">{filter}</button>)}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const styles = `
.dm-doctors-a {
  min-block-size: 100vh;
}

.dm-doctors-a__section {
  position: relative;
  overflow: hidden;
  padding-block: clamp(1.35rem, 3vw, 2.5rem) clamp(1.6rem, 5vw, 3.6rem);
}

.dm-doctors-a__section::before,
.dm-doctors-a__section::after {
  content: "";
  position: absolute;
  pointer-events: none;
  border-radius: 999px;
  filter: blur(6px);
}

.dm-doctors-a__section::before {
  inline-size: min(40vw, 32rem);
  block-size: min(40vw, 32rem);
  inset-block-start: -16rem;
  inset-inline-start: -8rem;
  background: radial-gradient(circle, rgba(42, 161, 146, 0.18), transparent 64%);
}

.dm-doctors-a__section::after {
  inline-size: min(38vw, 30rem);
  block-size: min(38vw, 30rem);
  inset-block-start: -10rem;
  inset-inline-end: -7rem;
  background: radial-gradient(circle, rgba(201, 162, 75, 0.13), transparent 62%);
}

.dm-doctors-a__grid {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(18rem, 0.82fr);
  gap: clamp(1rem, 3vw, 2rem);
  align-items: stretch;
}

.dm-doctors-a__hero-card {
  display: grid;
  align-content: center;
  gap: 0.9rem;
  padding: clamp(1.15rem, 3vw, 2rem);
}

.dm-doctors-a__hero-card h1 {
  max-inline-size: 13ch;
  margin: 0;
  color: var(--dm-teal-950, #07302c);
  font-size: clamp(2.15rem, 5.8vw, 4.8rem);
  font-weight: 720;
  line-height: 0.99;
  letter-spacing: -0.045em;
}

.dm-doctors-a__hero-card p {
  max-inline-size: 44rem;
  margin: 0;
  color: var(--dm-color-text-muted, #66736f);
  font-size: clamp(0.96rem, 1.4vw, 1.08rem);
  line-height: 1.7;
}

.dm-doctors-a__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  align-items: center;
  margin-block-start: 0.25rem;
}

.dm-doctors-a__trust {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-block-start: 0.55rem;
  padding: 0.82rem 0.9rem;
}

.dm-doctors-a__trust strong {
  color: var(--dm-teal-950, #07302c);
  font-weight: 760;
}

.dm-doctors-a__trust ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0.42rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.dm-doctors-a__trust li,
.dm-doctors-a__chip {
  border: 1px solid rgba(14, 110, 100, 0.14);
  border-radius: var(--dm-radius-pill, 999px);
  background: rgba(239, 246, 244, 0.86);
  color: var(--dm-color-brand-strong, #0b6f63);
  font-size: 0.82rem;
  font-weight: 680;
  padding: 0.42rem 0.68rem;
}

.dm-doctors-a__media-card {
  min-block-size: clamp(19rem, 34vw, 27rem);
  padding: clamp(0.78rem, 1.8vw, 1.1rem);
}

.dm-doctors-a__media-window {
  position: relative;
  min-block-size: 100%;
  display: grid;
  align-items: end;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.82);
  border-radius: var(--dm-radius-xl, 1.375rem);
  background:
    radial-gradient(420px circle at 78% 18%, rgba(201, 162, 75, 0.18), transparent 48%),
    linear-gradient(135deg, rgba(239, 246, 244, 0.96), rgba(255, 255, 255, 0.76));
}

.dm-doctors-a__media-window::before {
  content: "";
  position: absolute;
  inset: 1rem;
  border: 1px dashed rgba(14, 110, 100, 0.24);
  border-radius: calc(var(--dm-radius-xl, 1.375rem) - 0.35rem);
}

.dm-doctors-a__image-symbol {
  position: absolute;
  inline-size: min(50%, 18rem);
  inset-block-start: 14%;
  inset-inline-start: 10%;
  opacity: 0.9;
}

.dm-doctors-a__glyph {
  position: absolute;
  inline-size: min(44%, 14rem);
  inset-block-start: 16%;
  inset-inline-end: 10%;
  filter: drop-shadow(0 18px 35px rgba(11, 40, 38, 0.14));
}

.dm-doctors-a__media-window figcaption {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 0.35rem;
  margin: clamp(1rem, 2vw, 1.35rem);
  padding: 0.95rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.76);
  border-radius: var(--dm-radius-lg, 1rem);
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 12px 30px rgba(11, 40, 38, 0.08);
}

.dm-doctors-a__media-window strong {
  color: var(--dm-teal-950, #07302c);
  font-size: 1rem;
  font-weight: 760;
}

.dm-doctors-a__media-window small {
  color: var(--dm-color-text-muted, #66736f);
  font-size: 0.84rem;
  line-height: 1.55;
}

.dm-doctors-a__search-wrap {
  padding-block-end: clamp(2rem, 5vw, 4rem);
}

.dm-doctors-a__search {
  max-inline-size: 72rem;
  margin-inline: auto;
  border-color: rgba(14, 110, 100, 0.16);
  background:
    radial-gradient(520px circle at 10% -18%, rgba(42, 161, 146, 0.13), transparent 48%),
    radial-gradient(420px circle at 95% 0%, rgba(201, 162, 75, 0.11), transparent 45%),
    rgba(255, 255, 255, 0.92);
}

.dm-doctors-a__search header {
  display: grid;
  gap: 0.35rem;
}

.dm-doctors-a__search h2 {
  margin: 0;
  color: var(--dm-teal-950, #07302c);
  font-size: clamp(1.15rem, 2.2vw, 1.65rem);
  font-weight: 680;
  line-height: 1.16;
  letter-spacing: -0.018em;
}

.dm-doctors-a__search p {
  max-inline-size: 48rem;
  margin: 0;
  color: var(--dm-color-text-muted, #66736f);
  font-size: 0.9rem;
  line-height: 1.6;
}

.dm-doctors-a__search-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.5rem;
  align-items: center;
}

.dm-doctors-a__quick-paths {
  display: grid;
  gap: 0.55rem;
}

.dm-doctors-a__quick-paths > div {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.dm-doctors-a__chip {
  font: inherit;
  cursor: pointer;
  transition: transform 140ms ease, background-color 140ms ease, color 140ms ease, border-color 140ms ease;
}

.dm-doctors-a__chip:hover {
  transform: translateY(-1px);
  border-color: rgba(14, 110, 100, 0.32);
  background: rgba(220, 238, 235, 0.96);
}

[dir='rtl'] .dm-doctors-a__hero-card h1,
[dir='rtl'] .dm-doctors-a__search h2 {
  letter-spacing: 0;
  line-height: 1.12;
}

@media (max-width: 920px) {
  .dm-doctors-a__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .dm-doctors-a__search-row {
    grid-template-columns: 1fr;
  }

  .dm-doctors-a__hero-card h1 {
    font-size: clamp(2.05rem, 11vw, 3.1rem);
  }

  .dm-doctors-a__media-card {
    min-block-size: 18rem;
  }
}
`;
