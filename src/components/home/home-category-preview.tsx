import Link from 'next/link';

type HomeCategoryPreviewProps = {
  title: string;
  subtitle: string;
  categories: readonly {
    key: string;
    label: string;
    description: string;
    accentClass: string;
    href?: string;
  }[];
  dir: 'ltr' | 'rtl';
};

export function HomeCategoryPreview({ title, subtitle, categories, dir }: HomeCategoryPreviewProps) {
  return (
    <section className="home-categories" dir={dir} aria-labelledby="home-categories-title">
      <div className="home-categories__head">
        <h2 id="home-categories-title">{title}</h2>
        <p>{subtitle}</p>
      </div>
      <div className="home-categories__grid">
        {categories.map((category) => {
          const href = category.href;

          if (!href) {
            return (
              <article key={category.key} className={`home-categories__card glass-soft ${category.accentClass}`}>
                <span className="home-categories__icon" aria-hidden="true" />
                <h3>{category.label}</h3>
                <p>{category.description}</p>
              </article>
            );
          }

          return (
            <Link
              key={category.key}
              href={href}
              className={`home-categories__card glass-soft ${category.accentClass}`}
              aria-label={category.label}
            >
              <span className="home-categories__icon" aria-hidden="true" />
              <h3>{category.label}</h3>
              <p>{category.description}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
