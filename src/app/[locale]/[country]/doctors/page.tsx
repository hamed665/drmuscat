type Params = { locale: string; country: string };

type Copy = {
  badge: string;
  title: string;
  intro: string;
  primary: string;
  provider: string;
  whatsapp: string;
  searchBadge: string;
  searchTitle: string;
  searchText: string;
  placeholder: string;
  searchButton: string;
  quick: string;
  trustTitle: string;
  trustItems: readonly string[];
  chips: readonly string[];
};

const copy: Record<'en' | 'ar', Copy> = {
  en: {
    badge: 'Doctors in Oman',
    title: 'Find doctors in Oman.',
    intro: 'Browse doctors, specialties, clinics and care paths across Oman. DrMuscat is a public discovery platform, not medical advice.',
    primary: 'Search doctors',
    provider: 'List your center',
    whatsapp: 'WhatsApp',
    searchBadge: 'Doctor search',
    searchTitle: 'Search by doctor, specialty or area',
    searchText: 'Start with a doctor name, specialty, clinic or Muscat area. Public listings appear only after approval.',
    placeholder: 'Doctor name, specialty, clinic or area…',
    searchButton: 'Search',
    quick: 'Popular paths',
    trustTitle: 'Discovery safety',
    trustItems: ['Public discovery only', 'Not medical advice', 'Approved listings only'],
    chips: ['Pediatrics', 'Dermatology', 'Dentistry', 'Gynecology', 'ENT', 'Orthopedics', 'General Practice', 'Cardiology']
  },
  ar: {
    badge: 'الأطباء في عُمان',
    title: 'ابحث عن أطباء في عُمان.',
    intro: 'تصفح الأطباء والتخصصات والعيادات ومسارات الرعاية في عُمان. DrMuscat منصة اكتشاف عامة وليست نصيحة طبية.',
    primary: 'ابحث عن الأطباء',
    provider: 'أدرج مركزك',
    whatsapp: 'واتساب',
    searchBadge: 'بحث الأطباء',
    searchTitle: 'ابحث باسم الطبيب أو التخصص أو المنطقة',
    searchText: 'ابدأ باسم طبيب أو تخصص أو عيادة أو منطقة في مسقط. تظهر القوائم العامة بعد الاعتماد فقط.',
    placeholder: 'اسم الطبيب أو التخصص أو العيادة أو المنطقة…',
    searchButton: 'بحث',
    quick: 'مسارات شائعة',
    trustTitle: 'سلامة الاكتشاف',
    trustItems: ['اكتشاف عام فقط', 'ليست نصيحة طبية', 'قوائم معتمدة فقط'],
    chips: ['طب الأطفال', 'جلدية', 'أسنان', 'نساء وولادة', 'أنف وأذن وحنجرة', 'عظام', 'طب عام', 'قلب']
  }
};

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  const lang = locale === 'ar' ? 'ar' : 'en';
  return {
    title: lang === 'ar' ? 'الأطباء في عُمان | DrMuscat' : 'Doctors in Oman | DrMuscat',
    description: copy[lang].intro
  };
}

export default async function DoctorsPage({ params }: { params: Promise<Params> }) {
  const { locale, country } = await params;
  const lang = locale === 'ar' ? 'ar' : 'en';
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const t = copy[lang];
  const root = `/${lang}/${country}`;

  return (
    <main className="dm2026-shell doctors-a" dir={dir} data-locale={lang} data-country={country}>
      <style>{styles}</style>
      <section className="doctors-a__section" aria-labelledby="doctors-a-title">
        <div className="dm2026-container doctors-a__grid">
          <div className="dm2026-glass doctors-a__copy-card">
            <span className="dm2026-badge">{t.badge}</span>
            <h1 id="doctors-a-title">{t.title}</h1>
            <p>{t.intro}</p>
            <div className="doctors-a__actions">
              <a className="dm2026-button dm2026-button-primary" href="#doctors-a-search">{t.primary}</a>
              <a className="dm2026-button dm2026-button-secondary" href={`${root}/for-providers`}>{t.provider}</a>
              <button className="dm2026-button dm2026-button-secondary doctors-a__whatsapp" type="button">{t.whatsapp}</button>
            </div>
            <div className="dm2026-glass doctors-a__trust" aria-label={t.trustTitle}>
              <strong>{t.trustTitle}</strong>
              <ul>{t.trustItems.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>

          <aside id="doctors-a-search" className="dm2026-search-surface doctors-a__search-card" aria-label={t.searchTitle}>
            <header>
              <span className="dm2026-badge">{t.searchBadge}</span>
              <h2>{t.searchTitle}</h2>
              <p>{t.searchText}</p>
            </header>
            <form className="doctors-a__search-row">
              <label className="sr-only" htmlFor="doctors-a-q">{t.placeholder}</label>
              <input className="dm2026-input" id="doctors-a-q" name="q" placeholder={t.placeholder} type="search" />
              <button className="dm2026-button dm2026-button-primary" type="button">{t.searchButton}</button>
            </form>
            <div className="doctors-a__quick">
              <span className="dm2026-badge">{t.quick}</span>
              <div>{t.chips.map((chip) => <button className="doctors-a__chip" key={chip} type="button">{chip}</button>)}</div>
            </div>
            <div className="doctors-a__micro-trust" aria-label={t.trustTitle}>
              {t.trustItems.map((item) => <span key={item}>{item}</span>)}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

const styles = `
.doctors-a { min-block-size: 100svh; }
.doctors-a__section { min-block-size: calc(100svh - 5.6rem); display: grid; align-items: center; overflow: hidden; padding-block: clamp(0.8rem, 2vw, 1.25rem) clamp(0.9rem, 2.5vw, 1.45rem); }
.doctors-a__grid { display: grid; grid-template-columns: minmax(0, 0.88fr) minmax(22rem, 1.12fr); gap: clamp(0.85rem, 2vw, 1.25rem); align-items: start; }
.doctors-a__copy-card, .doctors-a__search-card { min-block-size: clamp(23rem, 56svh, 29rem); }
.doctors-a__copy-card { display: grid; align-content: center; gap: clamp(0.54rem, 1.1vw, 0.78rem); padding: clamp(0.95rem, 2vw, 1.42rem); }
.doctors-a__copy-card h1 { max-inline-size: 11.5ch; margin: 0; color: var(--dm-teal-950, #07302c); font-size: clamp(1.85rem, 3.3vw, 2.82rem); font-weight: 720; line-height: 1.05; letter-spacing: -0.038em; }
.doctors-a__copy-card p { max-inline-size: 34rem; margin: 0; color: var(--dm-color-text-muted, #66736f); font-size: clamp(0.86rem, 1vw, 0.96rem); line-height: 1.62; }
.doctors-a__actions { display: flex; flex-wrap: wrap; gap: 0.48rem; align-items: center; margin-block-start: 0.1rem; }
.doctors-a__whatsapp { color: var(--dm-teal-950, #07302c); border-color: rgba(14, 110, 100, 0.22); background: rgba(220, 238, 235, 0.72); }
.doctors-a__trust { display: grid; gap: 0.5rem; margin-block-start: 0.12rem; padding: 0.72rem 0.82rem; }
.doctors-a__trust strong { color: var(--dm-teal-950, #07302c); font-size: 0.88rem; font-weight: 760; }
.doctors-a__trust ul { display: flex; flex-wrap: wrap; gap: 0.34rem; margin: 0; padding: 0; list-style: none; }
.doctors-a__trust li, .doctors-a__chip, .doctors-a__micro-trust span { border: 1px solid rgba(14, 110, 100, 0.14); border-radius: var(--dm-radius-pill, 999px); background: rgba(239, 246, 244, 0.86); color: var(--dm-color-brand-strong, #0b6f63); font-size: 0.78rem; font-weight: 680; padding: 0.36rem 0.58rem; }
.doctors-a__search-card { display: grid; align-content: start; gap: clamp(0.62rem, 1.4vw, 0.9rem); padding: clamp(0.92rem, 2vw, 1.25rem); border-color: rgba(14, 110, 100, 0.16); background: radial-gradient(520px circle at 10% -20%, rgba(42, 161, 146, 0.13), transparent 48%), radial-gradient(420px circle at 95% 0%, rgba(201, 162, 75, 0.1), transparent 45%), rgba(255, 255, 255, 0.92); }
.doctors-a__search-card header { display: grid; gap: 0.32rem; }
.doctors-a__search-card h2 { max-inline-size: 15ch; margin: 0; color: var(--dm-teal-950, #07302c); font-size: clamp(1.2rem, 2.1vw, 1.72rem); font-weight: 690; line-height: 1.15; letter-spacing: -0.018em; }
.doctors-a__search-card p { max-inline-size: 42rem; margin: 0; color: var(--dm-color-text-muted, #66736f); font-size: 0.86rem; line-height: 1.55; }
.doctors-a__search-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 0.5rem; align-items: center; }
.doctors-a__quick { display: grid; gap: 0.45rem; }
.doctors-a__quick > div, .doctors-a__micro-trust { display: flex; flex-wrap: wrap; gap: 0.38rem; }
.doctors-a__chip { font: inherit; cursor: pointer; transition: transform 140ms ease, background-color 140ms ease, color 140ms ease, border-color 140ms ease; }
.doctors-a__chip:hover { transform: translateY(-1px); border-color: rgba(14, 110, 100, 0.32); background: rgba(220, 238, 235, 0.96); }
.doctors-a__micro-trust { margin-block-start: 0.1rem; }
[dir='rtl'] .doctors-a__copy-card h1, [dir='rtl'] .doctors-a__search-card h2 { letter-spacing: 0; line-height: 1.16; }
@media (max-width: 980px) { .doctors-a__section { min-block-size: auto; align-items: start; } .doctors-a__grid { grid-template-columns: 1fr; } .doctors-a__copy-card, .doctors-a__search-card { min-block-size: auto; } }
@media (max-width: 640px) { .doctors-a__search-row { grid-template-columns: 1fr; } .doctors-a__copy-card h1 { font-size: clamp(1.78rem, 8.6vw, 2.55rem); } .doctors-a__search-card h2 { max-inline-size: none; } }
`;
