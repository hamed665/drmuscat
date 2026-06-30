import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/seo/site";
import { listSitemapIncludedPublicUrlEntries } from "@/lib/seo/url-registry";
import { listPublicImportSitemapEntries } from "@/server/public/import-sitemap";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = listSitemapIncludedPublicUrlEntries().map((entry) => ({
    url: new URL(entry.canonicalPath, siteConfig.baseUrl).toString(),
    lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));

  const importEntries = await listPublicImportSitemapEntries();
  const importedEntries: MetadataRoute.Sitemap = importEntries.map((entry) => ({
    url: new URL(entry.pathname, siteConfig.baseUrl).toString(),
    lastModified: entry.lastModified,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticEntries, ...importedEntries];
}
