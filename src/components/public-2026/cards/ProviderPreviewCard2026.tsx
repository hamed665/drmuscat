import Link from 'next/link';
import type { Home2026Copy } from '@/components/public-2026/home/HomeCopy2026';

type ProviderPreviewCard2026Props = {
  title: string;
  specialty: string;
  description: string;
  href: string;
  actions: Home2026Copy['actions'];
};

export function ProviderPreviewCard2026({ title, specialty, description, href, actions }: ProviderPreviewCard2026Props) {
  return (
    <article className="dm2026-provider-card group flex h-full flex-col overflow-hidden rounded-[1.65rem] border border-dm-border bg-white shadow-dm-sm transition hover:-translate-y-1 hover:shadow-dm-lg">
      <div className="dm2026-provider-card__media relative min-h-32 bg-[linear-gradient(135deg,var(--dm-teal-50),#fff,var(--dm-gold-100))] p-5">
        <div className="absolute inset-4 rounded-[1.25rem] border border-white/80 bg-white/40" aria-hidden="true" />
        <span className="relative inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-dm-brand-strong shadow-dm-sm">{specialty}</span>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-dm-text">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-dm-text-soft">{description}</p>
        </div>
        <div className="mt-auto grid gap-2">
          <Link href={href} className="dm2026-action dm2026-action--profile inline-flex min-h-10 items-center justify-center rounded-full bg-dm-brand px-4 text-sm font-bold text-white shadow-dm-sm transition hover:bg-dm-brand-strong">
            {actions.viewProfile}
          </Link>
          <div className="grid grid-cols-3 gap-2" aria-label={actions.unavailable}>
            <button type="button" disabled className="dm2026-action dm2026-action--whatsapp min-h-10 rounded-full bg-[#1FA458] px-3 text-xs font-bold text-white opacity-90">
              {actions.whatsapp}
            </button>
            <button type="button" disabled className="dm2026-action min-h-10 rounded-full border border-dm-border bg-white px-3 text-xs font-bold text-dm-brand-strong">
              {actions.call}
            </button>
            <button type="button" disabled className="dm2026-action min-h-10 rounded-full border border-dm-border bg-dm-bg-soft px-3 text-xs font-bold text-dm-text-soft">
              {actions.directions}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
