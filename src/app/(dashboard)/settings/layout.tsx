import { Metadata } from 'next';

import { Fingerprint, Settings, UserCheck2Icon, UserPen } from 'lucide-react';
import { SidebarNav } from './components/sidebar-nav';

export const metadata: Metadata = {
  title: 'User Settings',
  description: 'User settings for the dashboard.',
};

const sidebarNavItems = [
  {
    icon: <Settings className="h-4 w-4" />,
    title: 'Profile',
    href: '/settings',
  },
  {
    icon: <UserPen className="h-4 w-4" />,
    title: 'Edit Profile',
    href: '/settings/edit-profile',
  },
  {
    icon: <UserCheck2Icon className="h-4 w-4" />,
    title: 'Account',
    href: '/settings/account',
  },
  {
    icon: <Fingerprint className="h-4 w-4" />,
    title: 'Change Password',
    href: '/settings/change-password',
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="space-y-6 p-4 pb-16 max-w-5xl mx-auto">
      <div className="flex flex-col lg:flex-row border rounded-xl overflow-hidden min-h-[500px]">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 bg-sidebar p-4 lg:rounded-l-xl rounded-t-xl lg:rounded-t-none border-b lg:border-b-0 lg:border-r">
          <SidebarNav items={sidebarNavItems} />
        </aside>

        {/* Main Content */}
        <div className="flex-1 py-8 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
