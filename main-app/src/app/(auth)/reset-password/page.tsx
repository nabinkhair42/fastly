import { ResetPasswordForm } from '@/app/(auth)/components/auth-forms';
import { generatePageMetadata } from '@/seo/seo';

export const metadata = generatePageMetadata({
  title: 'Reset Password',
  description:
    'Set a new password for your Fastly account. Complete your password reset process securely.',
  keywords: ['reset password', 'new password', 'password change', 'account security'],
  canonical: '/reset-password',
  noIndex: true, // Don't index password reset pages
});

export default function ResetPasswordPage() {
  return (
    <div className="flex items-center justify-center">
      <ResetPasswordForm />
    </div>
  );
}
