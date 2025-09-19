import { generatePageMetadata } from '@/seo/seo';
import DashboardContent from './DashboardContent';

export const metadata = generatePageMetadata({
  title: 'Dashboard',
  description:
    'Access your SaaS Starter dashboard to manage your account, view statistics, and configure settings.',
  keywords: ['dashboard', 'user profile', 'account management', 'statistics'],
  canonical: '/dashboard',
  noIndex: true, // Don't index private dashboard pages
});

export default function DashboardPage() {
  return <DashboardContent />;
}
