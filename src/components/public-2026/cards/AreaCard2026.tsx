import Link from 'next/link';

type AreaCard2026Props = { title: string; href: string; label: string };

export function AreaCard2026({ title, href, label }: AreaCard2026Props) {
  return (
    <Link href={href} className="dm2026-area-card group rounded-[1.45rem] border border-dm-border bg-white p-5 text-inherit no-underline shadow-dm-sm transition hover:-translate-y-1 hover:shadow-dm-md">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-dm-bg-soft text-dm-brand-strong" aria-hidden="true">⌖</span>
      <h3 className="mt-4 text-xl font-bold text-dm-text">{title}</h3>
      <span className="mt-3 inline-flex text-sm font-bold text-dm-brand-strong group-hover:underline">{label}</span>
    </Link>
  );
}
