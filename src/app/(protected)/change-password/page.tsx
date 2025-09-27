'use client';

import ChangePasswordForm from '@/app/(protected)/components/forms/change-password-form';
import { useUserDetails } from '@/hooks/users/useUserMutations';
import { AuthMethod } from '@/types/user';

const METHOD_LABELS: Record<AuthMethod, string> = {
  [AuthMethod.EMAIL]: 'Email',
  [AuthMethod.GOOGLE]: 'Google',
  [AuthMethod.FACEBOOK]: 'Facebook',
  [AuthMethod.GITHUB]: 'GitHub',
};

export default function SettingsChangePasswordPage() {
  const { data, isLoading } = useUserDetails();
  const user = data?.data?.user;

  if (isLoading || !user) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-48 rounded-md bg-muted animate-pulse" />
        <div className="h-40 rounded-lg bg-muted animate-pulse" />
      </div>
    );
  }

  const authMethod = user.authMethod ?? AuthMethod.EMAIL;
  const hasPassword = Boolean(user.hasPassword);
  const providerLabel = METHOD_LABELS[authMethod as AuthMethod];

  const mode =
    hasPassword || authMethod === AuthMethod.EMAIL ? 'change' : 'create';

  return (
    <div className="space-y-6">
      <ChangePasswordForm mode={mode} providerLabel={providerLabel} />
    </div>
  );
}
