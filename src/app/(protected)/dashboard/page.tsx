import { generatePageMetadata } from '@/seo/seo';
import SettingsContent from './dashboard-content';

export const metadata = generatePageMetadata({
  title: 'Settings',
  description:
    'Manage your account settings, profile information, and preferences in SaaS Starter.',
  keywords: [
    'settings',
    'profile',
    'account management',
    'preferences',
    'user profile',
  ],
  canonical: '/settings',
  noIndex: true, // Don't index private settings pages
});

export default function SettingsPage() {
  return <SettingsContent />;
}
