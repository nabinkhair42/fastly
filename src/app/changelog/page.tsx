import ChangelogPage from '@/components/changelog';
import SiteHeader from '@/components/marketing/site-header';
import { Footer } from 'react-day-picker';

const page = () => {
  return (
    <>
      <SiteHeader />
      <main>
        <ChangelogPage />
      </main>
      <Footer />{' '}
    </>
  );
};

export default page;
