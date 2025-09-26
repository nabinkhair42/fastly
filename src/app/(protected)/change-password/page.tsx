'use client';
import ChangePasswordForm from '@/app/(protected)/components/forms/change-password-form';
import { useAuthMethod } from '@/hooks/users/useUserMutations';
import { AuthMethod } from '@/types/user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function SettingsChangePasswordPage() {
  const authMethod = useAuthMethod();
  const router = useRouter();
  useEffect(() => {
    if (authMethod !== AuthMethod.EMAIL) {
      toast.error("OAuth doesn't support changing password");
      router.push('/dashboard');
    }
  }, [authMethod, router]);

  // Don't render the form if auth method is not EMAIL
  if (authMethod !== AuthMethod.EMAIL) {
    return null;
  }

  return (
    <div className="space-y-6">
      <ChangePasswordForm />
    </div>
  );
}
