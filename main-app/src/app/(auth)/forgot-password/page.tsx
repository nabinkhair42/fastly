import { ForgotPasswordForm } from '@/app/(auth)/components/auth-forms';
import { generatePageMetadata } from '@/seo/seo';

export const metadata = generatePageMetadata({
  title: 'Reset Password',
  description: 'Forgot your password? Reset your Fastly account password quickly and securely.',
  keywords: ['forgot password', 'reset password', 'password recovery', 'account recovery'],
  canonical: '/forgot-password',
  noIndex: true, // Don't index password reset pages
});

export default function ForgotPasswordPage() {
  return (
    <div className="flex items-center justify-center">
      <ForgotPasswordForm />
    </div>
  );
}
