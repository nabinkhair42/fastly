import { Separator } from '@/components/ui/separator';
import { User } from 'lucide-react';
import { ProfileForm } from './profile-form';

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6 ">
      <div className="flex items-center gap-2 px-6">
        <div className="bg-muted p-2 rounded-md">
          <User className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-medium">Profile</h3>
          <p className="text-sm text-muted-foreground">
            This is how others will see you on the site.
          </p>
        </div>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  );
}
