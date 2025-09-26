import FAQ from '@/components/marketing/faq';
import FeatureGrid from '@/components/marketing/feature-grid';
import Footer from '@/components/marketing/footer';
import Hero from '@/components/marketing/hero';
import SiteHeader from '@/components/marketing/site-header';
import IntegrationsSection from '@/components/marketing/tech-stack';

const LandingPage = () => {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <FeatureGrid />
        <IntegrationsSection />
        <FAQ />
      </main>
      <Footer />{' '}
    </>
  );
};

export default LandingPage;
