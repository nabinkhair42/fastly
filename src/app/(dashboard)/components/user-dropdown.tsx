import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLogout } from '@/hooks/useAuthMutations';
import { useUserDetails } from '@/hooks/useUserMutations';
import { LogOut, Settings, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

const UserDropdown = () => {
  const { data: userDetails } = useUserDetails();
  const logoutMutation = useLogout();
  const router = useRouter();

  const avatarFallback =
    (userDetails?.data?.user?.firstName?.charAt(0) || '') +
    (userDetails?.data?.user?.lastName?.charAt(0) || '');

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userDetails?.data?.user?.avatar || ''} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/settings')}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/settings/account')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
