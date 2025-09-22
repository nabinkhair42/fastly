import CTA from '@/components/marketing/CTA';
import FAQ from '@/components/marketing/FAQ';
import FeatureGrid from '@/components/marketing/FeatureGrid';
import Footer from '@/components/marketing/Footer';
import Hero from '@/components/marketing/Hero';
import HowItWorks from '@/components/marketing/HowItWorks';
import SiteHeader from '@/components/marketing/SiteHeader';
import Testimonials from '@/components/marketing/Testimonials';
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
    </>
  );
}
