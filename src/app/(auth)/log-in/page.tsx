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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useLogin } from '@/hooks/auth/useAuthMutations';
import { handleOAuthError } from '@/lib/auth/oauthErrorHandler';
import { loginSchema } from '@/zod/authValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Fingerprint } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { OAuthButtons } from '../oauth-buttons';

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLogin();

  // Handle OAuth error messages
  useEffect(() => {
    const error = searchParams.get('error');
    handleOAuthError(error);
  }, [searchParams]);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
      // Redirect to users page after successful login
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
            <Fingerprint className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
                loading={loginMutation.isPending}
                loadingText="Logging In"
              >
                Log In
              </Button>
            </form>
          </Form>

          <div className="mt-4 flex items-center justify-end">
            <Button
              variant="link"
              className="px-0 font-normal"
              onClick={() => router.push('/forgot-password')}
            >
              Forgot password?
            </Button>
          </div>

          <div className="my-4 flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-sm text-muted-foreground">
              Or sign in with
            </span>
            <Separator className="flex-1" />
          </div>

          <OAuthButtons />
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center text-sm">
            Don&apos;t have an account?{' '}
            <Button
              variant="link"
              className="p-0 font-normal"
              onClick={() => router.push('/create-account')}
            >
              Create one
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
