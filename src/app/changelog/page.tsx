import ChangelogPage from '@/components/changelog';
import Footer from '@/components/marketing/footer';
import SiteHeader from '@/components/marketing/navbar';

const page = () => {
  return (
    <>
      <SiteHeader />
      <main>
        <ChangelogPage />
      </main>
      <Footer />
    </>
  );
};

export default page;
