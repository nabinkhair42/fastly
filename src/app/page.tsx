import LandingPage from '@/components/marketing';
import { siteConfig } from '@/seo/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return <LandingPage />;
}
