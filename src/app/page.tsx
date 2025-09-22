import FAQ from '@/components/marketing/faq';
import FeatureGrid from '@/components/marketing/feature-grid';
import Footer from '@/components/marketing/footer';
import Hero from '@/components/marketing/hero';
import HowItWorks from '@/components/marketing/how-it-works';
import SiteHeader from '@/components/marketing/site-header';
import TechStack from '@/components/marketing/tech-stack';
import Testimonials from '@/components/marketing/testimonials';
import { siteConfig } from '@/seo/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Next Gen – ${siteConfig.name}`,
  description: siteConfig.description,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      {' '}
      <SiteHeader />
      <main>
        <Hero />
        <TechStack />
        <FeatureGrid />
        <HowItWorks />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
