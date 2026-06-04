type ArticleCard2026Props = { category: string; title: string; description: string; readTime: string };

export function ArticleCard2026({ category, title, description, readTime }: ArticleCard2026Props) {
  return (
    <article className="dm2026-article-card h-full overflow-hidden rounded-[1.65rem] border border-dm-border bg-white shadow-dm-sm">
      <div className="grid h-36 place-items-center bg-[linear-gradient(135deg,var(--dm-teal-50),#fff,var(--dm-gold-100))]">
        <span className="rounded-full border border-white/80 bg-white/85 px-3 py-1 text-xs font-bold text-dm-brand-strong shadow-dm-sm">{category}</span>
      </div>
      <div className="p-5">
        <span className="text-xs font-bold text-dm-text-muted">{readTime}</span>
        <h3 className="mt-2 text-xl font-bold tracking-tight text-dm-text">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-dm-text-soft">{description}</p>
      </div>
    </article>
  );
}
