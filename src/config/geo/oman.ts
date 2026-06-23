export type GeoScope = 'core' | 'adjacent' | 'deferred' | 'excluded';

export type GeoLaunchPhase = 1 | 2 | 3 | 'deferred' | 'excluded';

export type OmanGovernorate = {
  slug: string;
  labelEn: string;
  labelAr: string;
  countryCode: 'OM';
  scope: GeoScope;
  publicLaunchPhase: GeoLaunchPhase;
  isMvp: boolean;
};

export type OmanWilayat = {
  slug: string;
  governorateSlug: string;
  labelEn: string;
  labelAr: string;
  scope: GeoScope;
  publicLaunchPhase: GeoLaunchPhase;
  isMvp: boolean;
};

export type OmanArea = {
  slug: string;
  governorateSlug: string;
  wilayatSlug: string;
  labelEn: string;
  labelAr: string;
  scope: GeoScope;
  publicLaunchPhase: GeoLaunchPhase;
  isMvp: boolean;
};

export const OMAN_GOVERNORATES: readonly OmanGovernorate[] = [
  { slug: 'muscat', labelEn: 'Muscat Governorate', labelAr: 'محافظة مسقط', countryCode: 'OM', scope: 'core', publicLaunchPhase: 1, isMvp: true },
  { slug: 'dhofar', labelEn: 'Dhofar Governorate', labelAr: 'محافظة ظفار', countryCode: 'OM', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'musandam', labelEn: 'Musandam Governorate', labelAr: 'محافظة مسندم', countryCode: 'OM', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'al-buraimi', labelEn: 'Al Buraimi Governorate', labelAr: 'محافظة البريمي', countryCode: 'OM', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'ad-dakhiliyah', labelEn: 'Ad Dakhiliyah Governorate', labelAr: 'محافظة الداخلية', countryCode: 'OM', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'ad-dhahirah', labelEn: 'Ad Dhahirah Governorate', labelAr: 'محافظة الظاهرة', countryCode: 'OM', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'al-batinah-north', labelEn: 'Al Batinah North Governorate', labelAr: 'محافظة شمال الباطنة', countryCode: 'OM', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'al-batinah-south', labelEn: 'Al Batinah South Governorate', labelAr: 'محافظة جنوب الباطنة', countryCode: 'OM', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'al-wusta', labelEn: 'Al Wusta Governorate', labelAr: 'محافظة الوسطى', countryCode: 'OM', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'ash-sharqiyah-north', labelEn: 'Ash Sharqiyah North Governorate', labelAr: 'محافظة شمال الشرقية', countryCode: 'OM', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'ash-sharqiyah-south', labelEn: 'Ash Sharqiyah South Governorate', labelAr: 'محافظة جنوب الشرقية', countryCode: 'OM', scope: 'core', publicLaunchPhase: 2, isMvp: false },
] as const;

export const OMAN_WILAYATS: readonly OmanWilayat[] = [
  { slug: 'al-amarat', governorateSlug: 'muscat', labelEn: 'Al Amarat', labelAr: 'العامرات', scope: 'core', publicLaunchPhase: 1, isMvp: true },
  { slug: 'bawshar', governorateSlug: 'muscat', labelEn: 'Bawshar', labelAr: 'بوشر', scope: 'core', publicLaunchPhase: 1, isMvp: true },
  { slug: 'muscat', governorateSlug: 'muscat', labelEn: 'Muscat', labelAr: 'مسقط', scope: 'core', publicLaunchPhase: 1, isMvp: true },
  { slug: 'muttrah', governorateSlug: 'muscat', labelEn: 'Muttrah', labelAr: 'مطرح', scope: 'core', publicLaunchPhase: 1, isMvp: true },
  { slug: 'qurayyat', governorateSlug: 'muscat', labelEn: 'Qurayyat', labelAr: 'قريات', scope: 'core', publicLaunchPhase: 1, isMvp: true },
  { slug: 'al-seeb', governorateSlug: 'muscat', labelEn: 'Al Seeb', labelAr: 'السيب', scope: 'core', publicLaunchPhase: 1, isMvp: true },
  { slug: 'salalah', governorateSlug: 'dhofar', labelEn: 'Salalah', labelAr: 'صلالة', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'taqah', governorateSlug: 'dhofar', labelEn: 'Taqah', labelAr: 'طاقة', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'mirbat', governorateSlug: 'dhofar', labelEn: 'Mirbat', labelAr: 'مرباط', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'thumrait', governorateSlug: 'dhofar', labelEn: 'Thumrait', labelAr: 'ثمريت', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'sadah', governorateSlug: 'dhofar', labelEn: 'Sadah', labelAr: 'سدح', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'rakhyut', governorateSlug: 'dhofar', labelEn: 'Rakhyut', labelAr: 'رخيوت', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'dhalkut', governorateSlug: 'dhofar', labelEn: 'Dhalkut', labelAr: 'ضلكوت', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'muqshin', governorateSlug: 'dhofar', labelEn: 'Muqshin', labelAr: 'مقشن', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'shalim-hallaniyat-islands', governorateSlug: 'dhofar', labelEn: 'Shalim and the Hallaniyat Islands', labelAr: 'شليم وجزر الحلانيات', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'al-mazyunah', governorateSlug: 'dhofar', labelEn: 'Al Mazyunah', labelAr: 'المزيونة', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'khasab', governorateSlug: 'musandam', labelEn: 'Khasab', labelAr: 'خصب', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'bukha', governorateSlug: 'musandam', labelEn: 'Bukha', labelAr: 'بخاء', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'dibba', governorateSlug: 'musandam', labelEn: 'Dibba', labelAr: 'دبا', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'madha', governorateSlug: 'musandam', labelEn: 'Madha', labelAr: 'مدحاء', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'al-buraimi', governorateSlug: 'al-buraimi', labelEn: 'Al Buraimi', labelAr: 'البريمي', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'mahdah', governorateSlug: 'al-buraimi', labelEn: 'Mahdah', labelAr: 'محضة', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'as-sunaynah', governorateSlug: 'al-buraimi', labelEn: 'As Sunaynah', labelAr: 'السنينة', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'nizwa', governorateSlug: 'ad-dakhiliyah', labelEn: 'Nizwa', labelAr: 'نزوى', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'samail', governorateSlug: 'ad-dakhiliyah', labelEn: 'Samail', labelAr: 'سمائل', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'bahla', governorateSlug: 'ad-dakhiliyah', labelEn: 'Bahla', labelAr: 'بهلاء', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'adam', governorateSlug: 'ad-dakhiliyah', labelEn: 'Adam', labelAr: 'أدم', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'al-hamra', governorateSlug: 'ad-dakhiliyah', labelEn: 'Al Hamra', labelAr: 'الحمراء', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'manah', governorateSlug: 'ad-dakhiliyah', labelEn: 'Manah', labelAr: 'منح', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'izki', governorateSlug: 'ad-dakhiliyah', labelEn: 'Izki', labelAr: 'إزكي', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'bidbid', governorateSlug: 'ad-dakhiliyah', labelEn: 'Bidbid', labelAr: 'بدبد', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'jabal-akhdar', governorateSlug: 'ad-dakhiliyah', labelEn: 'Jabal Akhdar', labelAr: 'الجبل الأخضر', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'ibri', governorateSlug: 'ad-dhahirah', labelEn: 'Ibri', labelAr: 'عبري', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'yanqul', governorateSlug: 'ad-dhahirah', labelEn: 'Yanqul', labelAr: 'ينقل', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'dhank', governorateSlug: 'ad-dhahirah', labelEn: 'Dhank', labelAr: 'ضنك', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'sohar', governorateSlug: 'al-batinah-north', labelEn: 'Sohar', labelAr: 'صحار', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'shinas', governorateSlug: 'al-batinah-north', labelEn: 'Shinas', labelAr: 'شناص', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'liwa', governorateSlug: 'al-batinah-north', labelEn: 'Liwa', labelAr: 'لوى', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'saham', governorateSlug: 'al-batinah-north', labelEn: 'Saham', labelAr: 'صحم', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'al-khaburah', governorateSlug: 'al-batinah-north', labelEn: 'Al Khaburah', labelAr: 'الخابورة', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'al-suwaiq', governorateSlug: 'al-batinah-north', labelEn: 'Al Suwaiq', labelAr: 'السويق', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'rustaq', governorateSlug: 'al-batinah-south', labelEn: 'Rustaq', labelAr: 'الرستاق', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'al-awabi', governorateSlug: 'al-batinah-south', labelEn: 'Al Awabi', labelAr: 'العوابي', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'nakhal', governorateSlug: 'al-batinah-south', labelEn: 'Nakhal', labelAr: 'نخل', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'wadi-al-maawil', governorateSlug: 'al-batinah-south', labelEn: 'Wadi Al Maawil', labelAr: 'وادي المعاول', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'barka', governorateSlug: 'al-batinah-south', labelEn: 'Barka', labelAr: 'بركاء', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'al-musannah', governorateSlug: 'al-batinah-south', labelEn: 'Al Musannah', labelAr: 'المصنعة', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'haima', governorateSlug: 'al-wusta', labelEn: 'Haima', labelAr: 'هيماء', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'mahout', governorateSlug: 'al-wusta', labelEn: 'Mahout', labelAr: 'محوت', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'al-duqm', governorateSlug: 'al-wusta', labelEn: 'Al Duqm', labelAr: 'الدقم', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'al-jazir', governorateSlug: 'al-wusta', labelEn: 'Al Jazir', labelAr: 'الجازر', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'ibra', governorateSlug: 'ash-sharqiyah-north', labelEn: 'Ibra', labelAr: 'إبراء', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'al-mudhaibi', governorateSlug: 'ash-sharqiyah-north', labelEn: 'Al Mudhaibi', labelAr: 'المضيبي', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'bidiya', governorateSlug: 'ash-sharqiyah-north', labelEn: 'Bidiya', labelAr: 'بدية', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'sinaw', governorateSlug: 'ash-sharqiyah-north', labelEn: 'Sinaw', labelAr: 'سناو', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'dima-wa-tayeen', governorateSlug: 'ash-sharqiyah-north', labelEn: 'Dima Wa Tayeen', labelAr: 'دماء والطائيين', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'al-qabil', governorateSlug: 'ash-sharqiyah-north', labelEn: 'Al Qabil', labelAr: 'القابل', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'wadi-bani-khalid', governorateSlug: 'ash-sharqiyah-north', labelEn: 'Wadi Bani Khalid', labelAr: 'وادي بني خالد', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'sur', governorateSlug: 'ash-sharqiyah-south', labelEn: 'Sur', labelAr: 'صور', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'jalan-bani-bu-ali', governorateSlug: 'ash-sharqiyah-south', labelEn: 'Jalan Bani Bu Ali', labelAr: 'جعلان بني بو علي', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'jalan-bani-bu-hassan', governorateSlug: 'ash-sharqiyah-south', labelEn: 'Jalan Bani Bu Hassan', labelAr: 'جعلان بني بو حسن', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'al-kamil-wal-wafi', governorateSlug: 'ash-sharqiyah-south', labelEn: 'Al Kamil Wal Wafi', labelAr: 'الكامل والوافي', scope: 'core', publicLaunchPhase: 2, isMvp: false },
  { slug: 'masirah', governorateSlug: 'ash-sharqiyah-south', labelEn: 'Masirah', labelAr: 'مصيرة', scope: 'core', publicLaunchPhase: 2, isMvp: false },
] as const;

export const OMAN_AREAS: readonly OmanArea[] = [
  { slug: 'al-khuwair', governorateSlug: 'muscat', wilayatSlug: 'bawshar', labelEn: 'Al Khuwair', labelAr: 'الخوير', scope: 'core', publicLaunchPhase: 1, isMvp: true },
  { slug: 'al-ghubrah', governorateSlug: 'muscat', wilayatSlug: 'bawshar', labelEn: 'Al Ghubrah', labelAr: 'الغبرة', scope: 'core', publicLaunchPhase: 1, isMvp: true },
  { slug: 'al-azaiba', governorateSlug: 'muscat', wilayatSlug: 'bawshar', labelEn: 'Al Azaiba', labelAr: 'العذيبة', scope: 'core', publicLaunchPhase: 1, isMvp: true },
  { slug: 'ghala', governorateSlug: 'muscat', wilayatSlug: 'bawshar', labelEn: 'Ghala', labelAr: 'غلا', scope: 'core', publicLaunchPhase: 1, isMvp: true },
  { slug: 'qurum', governorateSlug: 'muscat', wilayatSlug: 'bawshar', labelEn: 'Qurum', labelAr: 'القرم', scope: 'core', publicLaunchPhase: 1, isMvp: true },
  { slug: 'madinat-sultan-qaboos', governorateSlug: 'muscat', wilayatSlug: 'bawshar', labelEn: 'Madinat Sultan Qaboos', labelAr: 'مدينة السلطان قابوس', scope: 'core', publicLaunchPhase: 1, isMvp: true },
  { slug: 'ruwi', governorateSlug: 'muscat', wilayatSlug: 'muttrah', labelEn: 'Ruwi', labelAr: 'روي', scope: 'core', publicLaunchPhase: 1, isMvp: true },
  { slug: 'muttrah', governorateSlug: 'muscat', wilayatSlug: 'muttrah', labelEn: 'Muttrah', labelAr: 'مطرح', scope: 'core', publicLaunchPhase: 1, isMvp: true },
  { slug: 'al-hail', governorateSlug: 'muscat', wilayatSlug: 'al-seeb', labelEn: 'Al Hail', labelAr: 'الحيل', scope: 'core', publicLaunchPhase: 1, isMvp: true },
  { slug: 'al-khoud', governorateSlug: 'muscat', wilayatSlug: 'al-seeb', labelEn: 'Al Khoud', labelAr: 'الخوض', scope: 'core', publicLaunchPhase: 1, isMvp: true },
  { slug: 'al-mawaleh', governorateSlug: 'muscat', wilayatSlug: 'al-seeb', labelEn: 'Al Mawaleh', labelAr: 'الموالح', scope: 'core', publicLaunchPhase: 1, isMvp: true },
  { slug: 'al-seeb', governorateSlug: 'muscat', wilayatSlug: 'al-seeb', labelEn: 'Al Seeb', labelAr: 'السيب', scope: 'core', publicLaunchPhase: 1, isMvp: true },
] as const;

export const OMAN_GEO_REGISTRY = {
  governorates: OMAN_GOVERNORATES,
  wilayats: OMAN_WILAYATS,
  areas: OMAN_AREAS,
} as const;
