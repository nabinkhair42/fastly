import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/button';
const page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Welcome to the app</h1>
      <p className="text-lg">This is the home page</p>
      <div className="flex gap-4 mt-4">
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
