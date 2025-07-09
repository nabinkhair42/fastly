import { Metadata } from 'next';

import { SidebarNav } from './components/sidebar-nav';

export const metadata: Metadata = {
  title: 'Forms',
  description: 'Advanced form example using react-hook-form and Zod.',
};

const sidebarNavItems = [
  {
    title: 'Profile',
    href: '/settings',
  },
  {
    title: 'Account',
    href: '/settings/account',
  },
  {
    title: 'Change Password',
    href: '/settings/change-password',
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="space-y-6 p-10 pb-16 max-w-5xl mx-auto">
      <div className="flex flex-col lg:flex-row border rounded-xl overflow-hidden min-h-[500px]">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 bg-sidebar border-none lg:border-r p-4 lg:rounded-l-xl rounded-t-xl lg:rounded-t-none">
          <SidebarNav items={sidebarNavItems} />
        </aside>

        {/* Main Content */}
        <div className="flex-1 py-8 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
