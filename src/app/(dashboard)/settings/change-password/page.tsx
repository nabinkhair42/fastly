'use client';
import { Separator } from '@/components/ui/separator';
import { useAuthMethod } from '@/hooks/useUserMutations';
import { AuthMethod } from '@/types/user';
import { Fingerprint } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ChangePasswordForm from './change-password-form';
import { toast } from 'sonner';
export default function SettingsChangePasswordPage() {
  const authMethod = useAuthMethod();
  const router = useRouter();

  if (authMethod !== AuthMethod.EMAIL) {
    toast.error('Email authentication is not supported for password change.');
    router.push('/settings');
  }

  return (
    <div
      className="space-y-6"
      style={{
        display: authMethod !== AuthMethod.EMAIL ? 'none' : 'block',
      }}
    >
      <div className="flex items-center gap-2 px-6">
        <div className="bg-muted p-2 rounded-md">
          <Fingerprint className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-medium">Change Password</h3>
          <p className="text-sm text-muted-foreground">
            Update your existing password to keep your account secure.
          </p>
        </div>
      </div>
      <Separator />
      <ChangePasswordForm />
    </div>
  );
}
