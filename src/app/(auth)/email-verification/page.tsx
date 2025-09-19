import { EmailVerificationForm } from '@/app/(auth)/components/auth-forms';
import { generatePageMetadata } from '@/seo/seo';

export const metadata = generatePageMetadata({
  title: 'Verify Email',
  description:
    'Verify your email address to complete your SaaS Starter account setup and access all features.',
  keywords: [
    'email verification',
    'verify email',
    'account verification',
    'email confirmation',
  ],
  canonical: '/email-verification',
  noIndex: true, // Don't index verification pages
});

export default function EmailVerificationPage() {
  return (
    <div className="flex items-center justify-center">
      <EmailVerificationForm />
    </div>
  );
}
