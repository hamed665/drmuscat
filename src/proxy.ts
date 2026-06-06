import { NextRequest, NextResponse } from 'next/server';

const supportedLocales = new Set(['en', 'ar']);
const supportedCountries = new Set(['om']);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  const [, locale, country] = pathname.split('/');

  if (locale && supportedLocales.has(locale)) {
    requestHeaders.set('x-drmuscat-locale', locale);
  }

  if (country && supportedCountries.has(country)) {
    requestHeaders.set('x-drmuscat-country', country);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api).*)']
};
