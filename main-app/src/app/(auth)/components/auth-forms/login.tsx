'use client';

import { OAuthButtons } from '@/app/(auth)/components/oauth-buttons';
import { Badge } from '@/components/ui/badge';
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
import { useLogin } from '@/hooks/auth/use-auth-mutations';
import { useLastUsedProvider } from '@/hooks/auth/use-last-used-provider';
import { useSafeRedirect } from '@/hooks/auth/use-safe-redirect';
import { useSession } from '@/hooks/auth/use-session';
import { handleOAuthError } from '@/lib/auth/oauth-error-handler';
import { AuthMethod } from '@/types/user';
import { loginSchema } from '@/zod/authValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Fingerprint } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLogin();
  const { isLastUsed } = useLastUsedProvider();
  const { isAuthenticated } = useSession();

  const redirectTo = useSafeRedirect('/dashboard');

  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    hasRedirectedRef.current = false;
  }, []);

  // Handle OAuth error messages
  useEffect(() => {
    const error = searchParams.get('error');
    handleOAuthError(error);
  }, [searchParams]);
  useEffect(() => {
    if (isAuthenticated && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      router.replace(redirectTo);
    }
  }, [isAuthenticated, redirectTo, router]);

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
      // Redirect will be handled by the auth effect above once the session updates
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
          <Fingerprint className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
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
                    <Input type="email" placeholder="Enter your email" {...field} />
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
              className="w-full relative"
              disabled={loginMutation.isPending}
              loading={loginMutation.isPending}
              loadingText="Logging In"
            >
              Log In
              {isLastUsed(AuthMethod.EMAIL) && (
                <Badge className="absolute right-1 top-1" variant={'secondary'}>
                  Last Used
                </Badge>
              )}
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
          <span className="text-sm text-muted-foreground">Or sign in with</span>
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
  );
}
