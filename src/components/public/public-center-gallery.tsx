import type { PublicMediaImage } from '@/lib/catalog/public-types';

import { PublicCenterDetailSection } from './public-center-detail-section';

type PublicCenterGalleryProps = {
  title: string;
  images: PublicMediaImage[];
};

export function PublicCenterGallery({ title, images }: PublicCenterGalleryProps) {
  if (images.length === 0) return null;

  return (
    <PublicCenterDetailSection title={title}>
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" role="list">
        {images.map((image) => (
          <li key={image.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
            <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
              <img
                src={image.url}
                alt={image.altText}
                width={image.width ?? undefined}
                height={image.height ?? undefined}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          </li>
        ))}
      </ul>
    </PublicCenterDetailSection>
  );
}
