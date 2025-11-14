import FAQ from "@/components/marketing/faq";
import FeatureGrid from "@/components/marketing/features";
import Hero from "@/components/marketing/hero";
import IntegrationsSection from "@/components/marketing/tech-stack";

const LandingPage = () => {
  return (
    <>
      <Hero />
      <FeatureGrid />
      <IntegrationsSection />
      <FAQ />
    </>
  );
};

export default LandingPage;
