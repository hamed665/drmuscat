import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { headers } from 'next/headers';
import { isSupportedLocale, localeDirection } from '@/lib/i18n/config';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'DrMuscat',
  description: 'DrMuscat foundation'
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const localeHeader = (await headers()).get('x-drmuscat-locale');
  const locale = localeHeader && isSupportedLocale(localeHeader) ? localeHeader : 'en';

  return (
    <html lang={locale} dir={localeDirection(locale)}>
      <body>{children}</body>
    </html>
  );
}
