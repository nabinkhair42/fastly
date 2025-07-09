import { Separator } from '@/components/ui/separator';
import { Settings } from 'lucide-react';
import { AccountForm } from './account-form';

export default function SettingsAccountPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 px-6">
        <div className="bg-muted p-2 rounded-md">
          <Settings className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-medium">Account</h3>
          <p className="text-sm text-muted-foreground">
            Update your account settings. Set your preferred language and
            timezone.
          </p>
        </div>
      </div>
      <Separator />
      <AccountForm />
    </div>
  );
}
