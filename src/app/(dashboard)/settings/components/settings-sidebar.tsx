import UserDropdown from '@/app/(dashboard)/components/user-dropdown';
import { Logo } from '@/components/ui/logo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAuthMethod } from '@/hooks/users/useUserMutations';
import { Lock, Pencil, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

const SettingSidebar = () => {
  const authMethod = useAuthMethod();
  const sidebarNavItems = getSidebarNavItems(authMethod);
  const pathname = usePathname();
  const router = useRouter();
  return (
    <Sidebar>
      <SidebarHeader className="p-3 flex flex-row justify-between items-center border-b h-13">
        <div className="flex items-center gap-2">
          <Logo variant="colored" height={20} width={20} />
          <span className="text-lg font-semibold">Settings</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="h-svh">
        <SidebarGroup>
          <SidebarMenu>
            {sidebarNavItems.map(item => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={item.href === pathname}
                  onClick={() => router.push(item.href)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">{item.icon}</div>

                  {item.title}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <UserDropdown />
      </SidebarFooter>
    </Sidebar>
  );
};

export default SettingSidebar;

const getSidebarNavItems = (authMethod: string) => {
  return [
    {
      title: 'Profile',
      href: '/settings',
      icon: <User className="h-4 w-4" />,
    },
    {
      title: 'Accounts',
      href: '/settings/account',
      icon: <Lock className="h-4 w-4" />,
    },
    {
      title: 'Edit Profile',
      href: '/settings/edit-profile',
      icon: <Pencil className="h-4 w-4" />,
    },
    {
      title: 'Change Password',
      href: '/settings/change-password',
      icon: <Lock className="h-4 w-4" />,
      isDisabled: authMethod === 'email',
    },
  ];
};
