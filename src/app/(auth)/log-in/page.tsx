import { LoginForm } from '@/app/(auth)/components/auth-forms';
import { generatePageMetadata } from '@/seo/seo';

export const metadata = generatePageMetadata({
  title: 'Log In',
  description:
    'Sign in to your SaaS Starter account to access your dashboard and manage your application.',
  keywords: ['login', 'sign in', 'authentication', 'account access'],
  canonical: '/log-in',
});

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
