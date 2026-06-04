import Link from 'next/link';
import type { CategoryTone2026 } from '@/components/public-2026/home/HomeCopy2026';

type CategoryCard2026Props = { title: string; description: string; href: string; tone: CategoryTone2026 };

const toneClass: Record<CategoryTone2026, string> = {
  teal: 'from-[var(--dm-teal-100)] to-white text-dm-brand-strong',
  mint: 'from-[rgba(91,190,177,0.18)] to-white text-dm-brand-strong',
  gold: 'from-[var(--dm-gold-100)] to-white text-[var(--dm-gold-700)]',
  aqua: 'from-[rgba(91,190,177,0.15)] to-white text-dm-brand-strong',
  soft: 'from-dm-bg-soft to-white text-dm-text-soft'
};

export function CategoryCard2026({ title, description, href, tone }: CategoryCard2026Props) {
  return (
    <Link href={href} className="dm2026-category-link block h-full text-inherit no-underline">
      <article className="dm2026-category-card h-full rounded-[1.45rem] border border-dm-border bg-white p-4 shadow-dm-sm transition hover:-translate-y-1 hover:shadow-dm-md">
        <span className={`mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${toneClass[tone]}`} aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-current" />
        </span>
        <h3 className="text-base font-bold text-dm-text">{title}</h3>
        <p className="mt-1 text-sm leading-5 text-dm-text-soft">{description}</p>
      </article>
    </Link>
  );
}
