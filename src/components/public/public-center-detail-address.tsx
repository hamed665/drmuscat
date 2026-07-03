import { PublicCenterDetail } from '@/components/public/public-center-detail';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { PublicCatalogLocale, PublicCenterDetail as PublicCenterDetailData } from '@/lib/catalog/public-types';

type PublicCenterDetailAddressProps = {
  locale: PublicCatalogLocale;
  center: PublicCenterDetailData;
};

type LocationAddressRow = {
  id: string;
  address_line1_en: string | null;
  address_line1_ar: string | null;
  address_line2_en: string | null;
  address_line2_ar: string | null;
  landmark_en: string | null;
  landmark_ar: string | null;
  postal_code: string | null;
};

function withLocationAddresses(center: PublicCenterDetailData, rows: LocationAddressRow[]): PublicCenterDetailData {
  const addressesById = new Map(rows.map((row) => [row.id, row]));
  const locations = center.locations.map((location) => {
    const row = addressesById.get(location.id);
    if (!row) return location;

    return {
      ...location,
      addressLine1En: row.address_line1_en,
      addressLine1Ar: row.address_line1_ar,
      addressLine2En: row.address_line2_en,
      addressLine2Ar: row.address_line2_ar,
      landmarkEn: row.landmark_en,
      landmarkAr: row.landmark_ar,
      postalCode: row.postal_code
    };
  });
  const location = center.location ? locations.find((item) => item.id === center.location?.id) ?? center.location : null;

  return { ...center, location, locations };
}

export async function PublicCenterDetailAddress({ locale, center }: PublicCenterDetailAddressProps) {
  const locationIds = center.locations.map((location) => location.id);
  if (locationIds.length === 0) return <PublicCenterDetail locale={locale} center={center} />;

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('center_locations')
    .select('id,address_line1_en,address_line1_ar,address_line2_en,address_line2_ar,landmark_en,landmark_ar,postal_code')
    .in('id', locationIds)
    .eq('is_active', true)
    .is('deleted_at', null);

  if (error || !data) return <PublicCenterDetail locale={locale} center={center} />;

  return <PublicCenterDetail locale={locale} center={withLocationAddresses(center, data as LocationAddressRow[])} />;
}
