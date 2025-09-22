import { CreateAccountForm } from '@/app/(auth)/components/auth-forms';
import { generatePageMetadata } from '@/seo/seo';

export const metadata = generatePageMetadata({
  title: 'Create Account',
  description:
    'Create a new Fastly account to get started with our modern SaaS platform. Sign up in seconds and access all features.',
  keywords: [
    'create account',
    'sign up',
    'register',
    'new user',
    'registration',
  ],
  canonical: '/create-account',
});

export default function CreateAccountPage() {
  return (
    <div className="flex items-center justify-center">
      <CreateAccountForm />
    </div>
  );
}
