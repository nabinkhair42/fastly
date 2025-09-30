import { generateSitemap } from '@/seo';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return generateSitemap() as MetadataRoute.Sitemap;
}
