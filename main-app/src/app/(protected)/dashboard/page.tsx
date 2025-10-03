import { generatePageMetadata } from '@/seo/seo';
import DashboardContent from './dashboard-content';

export const metadata = generatePageMetadata({
  title: 'Dashboard',
  description:
    'SaaS Starter Kit dashboard - Your development environment overview and getting started guide.',
  keywords: ['dashboard', 'saas starter', 'development', 'getting started', 'developer tools'],
  canonical: '/dashboard',
  noIndex: true, // Don't index private dashboard pages
});

export default function DashboardPage() {
  return <DashboardContent />;
}
