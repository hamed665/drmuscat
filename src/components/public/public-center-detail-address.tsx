import { PublicCenterDetail } from '@/components/public/public-center-detail';
import type { PublicCatalogLocale, PublicCenterDetail as PublicCenterDetailData } from '@/lib/catalog/public-types';

type PublicCenterDetailAddressProps = {
  locale: PublicCatalogLocale;
  center: PublicCenterDetailData;
};

export function PublicCenterDetailAddress({ locale, center }: PublicCenterDetailAddressProps) {
  return <PublicCenterDetail locale={locale} center={center} />;
}
