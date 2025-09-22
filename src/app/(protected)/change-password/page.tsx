'use client';
import ChangePasswordForm from '@/app/(protected)/components/forms/change-password-form';
import { useAuthMethod } from '@/hooks/users/useUserMutations';
import { AuthMethod } from '@/types/user';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
export default function SettingsChangePasswordPage() {
  const authMethod = useAuthMethod();
  const router = useRouter();

  if (authMethod !== AuthMethod.EMAIL) {
    toast.error('Email authentication is not supported for password change.');
    router.push('/dashboard');
  }

  return (
    <div
      className="space-y-6"
      style={{
        display: authMethod !== AuthMethod.EMAIL ? 'none' : 'block',
      }}
    >
      <ChangePasswordForm />
    </div>
  );
}
