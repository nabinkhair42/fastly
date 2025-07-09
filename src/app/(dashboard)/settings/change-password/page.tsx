import { Separator } from '@/components/ui/separator';
import { Fingerprint } from 'lucide-react';
import ChangePasswordForm from './change-password-form';

export default function SettingsChangePasswordPage() {
  return (
    <div className="space-y-6">
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
