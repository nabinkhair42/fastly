import { Button } from '@/components/ui/button';
import { AudioWaveform } from 'lucide-react';
import { useRouter } from 'next/navigation';
import UserDropdown from './user-dropdown';

const ProtectedNavbar = () => {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Left Side: Logo */}
        <Button
          className="flex items-center gap-2"
          variant="link"
          onClick={() => router.push('/dashboard')}
        >
          <AudioWaveform className="w-6 h-6 text-primary" />
          <span className="text-xl font-semibold tracking-tight">NextGen</span>
        </Button>

        {/* Right Side: User Menu */}
        <UserDropdown />
      </div>
    </header>
  );
};

export default ProtectedNavbar;
