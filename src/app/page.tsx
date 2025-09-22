import CTA from '@/components/marketing/cta';
import FAQ from '@/components/marketing/faq';
import FeatureGrid from '@/components/marketing/feature-grid';
import Hero from '@/components/marketing/hero';
import HowItWorks from '@/components/marketing/how-it-works';
import PageShell from '@/components/marketing/page-shell';
import SiteHeader from '@/components/marketing/site-header';
import Testimonials from '@/components/marketing/testimonials';
import { siteConfig } from '@/seo/metadata';
import type { Metadata } from 'next';
import { Footer } from 'react-day-picker';

export const metadata: Metadata = {
  title: `Next Gen – ${siteConfig.name}`,
  description: siteConfig.description,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <PageShell>
      <SiteHeader />
      <main>
        <Hero />
        <FeatureGrid />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </PageShell>
  );
}
