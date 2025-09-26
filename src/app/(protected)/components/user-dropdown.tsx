'use client';
import { ActionDialog } from '@/components/ui/action-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLogout } from '@/hooks/auth/useAuthMutations';
import { useUserDetails } from '@/hooks/users/useUserMutations';
import { ChevronRight, LogOut, LucideIcon, Settings, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface MenuItem {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  description: string;
  isVisible?: boolean;
}

export const UserDropdown = ({ avatarOnly }: { avatarOnly?: boolean }) => {
  const MenuList: MenuItem[] = [
    {
      label: 'Profile',
      icon: User,
      onClick: () => router.push('/edit-profile'),
      description: 'View and manage your profile information.',
    },
    {
      label: 'Account Settings',
      icon: Settings,
      onClick: () => router.push('/account'),
      description: 'View and manage your account settings.',
    },
    {
      label: 'Logout',
      icon: LogOut,
      onClick: () => setShowLogoutDialog(true),
      description: 'Logout of your account.',
    },
  ];

  const { data: userDetails } = useUserDetails();
  const logoutMutation = useLogout();
  const router = useRouter();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const avatarFallback =
    (userDetails?.data?.user?.firstName?.charAt(0) || '') +
    (userDetails?.data?.user?.lastName?.charAt(0) || '');

  const handleLogout = () => {
    logoutMutation.mutate();
    setShowLogoutDialog(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutDialog(false);
  };

  return (
    <>
      {showLogoutDialog && (
        <ActionDialog
          title="Logout"
          description="Are you sure you want to logout? This will end your current session."
          onConfirm={handleLogout}
          onCancel={handleLogoutCancel}
          confirmText="Logout"
          cancelText="Cancel"
          isActionDestructive={true}
          isLoading={logoutMutation.isPending}
          loadingText="Logging out..."
        />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          {avatarOnly ? (
            <Avatar className="h-8 w-8 cursor-pointer border">
              <AvatarImage src={userDetails?.data?.user?.avatar || ''} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="flex items-center gap-2 justify-between cursor-pointer rounded-md hover:bg-accent transition-colors p-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src={userDetails?.data?.user?.avatar || ''} />
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">
                    {userDetails?.data?.user?.firstName}{' '}
                    {userDetails?.data?.user?.lastName}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {userDetails?.data?.user?.username}
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {avatarOnly && (
            <DropdownMenuLabel>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userDetails?.data?.user?.avatar || ''} />
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium flex flex-col">
                  {userDetails?.data?.user?.firstName}{' '}
                  {userDetails?.data?.user?.lastName}
                  <span className="text-xs text-muted-foreground">
                    {userDetails?.data?.user?.username}
                  </span>
                </span>
              </div>
            </DropdownMenuLabel>
          )}
          {avatarOnly && <DropdownMenuSeparator />}
          {MenuList.filter(item => item.isVisible !== false).map(item => (
            <DropdownMenuItem key={item.label} onClick={item.onClick}>
              <item.icon className="mr-2 h-4 w-4" />
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
