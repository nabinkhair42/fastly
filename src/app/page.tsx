import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import Link from 'next/link';

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-center mb-8">
        <Logo
          width={80}
          height={80}
          variant="colored"
          className="mx-auto mb-6"
        />
        <h1 className="text-4xl font-bold mb-2">Welcome to SaaS Starter</h1>
        <p className="text-lg text-muted-foreground">
          Modern SaaS foundation built with Next.js & TypeScript
        </p>
      </div>
      <div className="flex gap-4">
        <Button variant="outline" asChild>
          <Link href="/log-in">Log in</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/create-account">Create account</Link>
        </Button>
      </div>
    </div>
  );
};

export default page;
