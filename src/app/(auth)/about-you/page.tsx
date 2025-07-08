'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSession } from '@/hooks/useSession';
import { useChangeUsername } from '@/hooks/useUserMutations';
import { changeUsernameSchema } from '@/zod/usersUpdate';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type UsernameFormData = z.infer<typeof changeUsernameSchema>;

export default function AboutYouPage() {
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated } = useSession();
  const changeUsernameMutation = useChangeUsername();

  const form = useForm<UsernameFormData>({
    resolver: zodResolver(changeUsernameSchema),
    defaultValues: {
      username: '',
    },
  });

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    router.push('/log-in');
    return null;
  }

  const onSubmit = async (data: UsernameFormData) => {
    try {
      await changeUsernameMutation.mutateAsync(data);
      // Redirect to users page after successful username setup
      router.push('/users');
    } catch (error) {
      console.error(error);
    }
  };

  const handleUsernameChange = async (username: string) => {
    if (username.length < 3) return;

    setIsCheckingUsername(true);
    // Simulate username availability check
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsCheckingUsername(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <User className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Welcome, {user?.firstName}!
          </CardTitle>
          <CardDescription>
            Let&apos;s set up your username to complete your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter your username"
                          {...field}
                          onChange={e => {
                            field.onChange(e);
                            handleUsernameChange(e.target.value);
                          }}
                        />
                        {isCheckingUsername && (
                          <div className="absolute right-3 top-3">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Your username can contain letters, numbers, and
                      underscores only. This can only be changed once after
                      account creation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={changeUsernameMutation.isPending}
                loading={changeUsernameMutation.isPending}
                loadingText="Setting"
              >
                Complete Setup
              </Button>
            </form>
          </Form>

          <div className="mt-6 rounded-lg bg-blue-50 p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Almost done!
              </span>
            </div>
            <p className="mt-1 text-sm text-blue-700">
              After setting your username, you&apos;ll be able to access your
              dashboard and start using the platform.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center text-sm">
            <Button
              variant="link"
              className="p-0 font-normal"
              onClick={() => router.push('/users')}
            >
              Back to Dashboard
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
