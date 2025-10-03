import { UserDropdown } from '@/app/(protected)/components/user-dropdown';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAuthMethod } from '@/hooks/users/use-user-mutations';
import { usePathname, useRouter } from 'next/navigation';
import { GiCube } from 'react-icons/gi';

export const AppSidebar = () => {
  const authMethod = useAuthMethod();
  const sidebarNavItems = getSidebarNavItems(authMethod);
  const pathname = usePathname();
  const router = useRouter();
  return (
    <Sidebar variant="inset">
      <SidebarHeader className="flex flex-row justify-between items-center ">
        <div className="flex items-center gap-2 pl-3">
          <GiCube height={20} width={20} />
          <span className="text-lg font-semibold">Fastly </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex flex-col justify-between h-full">
        <SidebarGroup>
          {/* Your App Important Pages Links */}
          <SidebarGroupLabel>App Links</SidebarGroupLabel>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarMenu>
            {sidebarNavItems.map(item => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={item.href === pathname}
                  onClick={() => router.push(item.href)}
                  className="cursor-pointer"
                >
                  {item.title}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserDropdown />
      </SidebarFooter>
    </Sidebar>
  );
};

const getSidebarNavItems = (authMethod: string) => {
  return [
    {
      title: 'Profile',
      href: '/dashboard',
    },
    {
      title: 'Edit Profile',
      href: '/edit-profile',
    },
    {
      title: 'Change Password',
      href: '/change-password',
      isDisabled: authMethod === 'email',
    },
    {
      title: 'Accounts',
      href: '/account',
    },
  ];
};
