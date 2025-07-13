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
import { useForgotPassword } from '@/hooks/useAuthMutations';
import { forgotPasswordSchema } from '@/zod/authValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Lock, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaGithub, FaGoogle } from 'react-icons/fa6';
import { z } from 'zod';

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const forgotPasswordMutation = useForgotPassword();
  const [oauthError, setOauthError] = useState<{
    message: string;
    availableLoginMethods?: string[];
    canSetPassword?: boolean;
  } | null>(null);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setOauthError(null);
      await forgotPasswordMutation.mutateAsync(data);
      // Store email in localStorage for reset-password page
      localStorage.setItem('resetPasswordEmail', data.email);
      // Could redirect to a success page or show success message
    } catch (error: unknown) {
      console.error(error);
      // Check if this is an OAuth-related error
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: {
            data?: {
              message?: string;
              data?: {
                availableLoginMethods?: string[];
                canSetPassword?: boolean;
              };
            };
          };
        };
        if (axiosError.response?.data?.data?.availableLoginMethods) {
          setOauthError({
            message: axiosError.response.data.message || 'Authentication error',
            availableLoginMethods:
              axiosError.response.data.data.availableLoginMethods,
            canSetPassword: axiosError.response.data.data.canSetPassword,
          });
        }
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
            <Lock className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            Enter your email address and we&apos;ll send you a reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          {oauthError && (
            <div className="mb-4 p-4 border border-orange-200 bg-orange-50 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-3 flex-1">
                  <p className="text-orange-800">{oauthError.message}</p>
                  {oauthError.availableLoginMethods &&
                    oauthError.availableLoginMethods.length > 0 && (
                      <div>
                        <p className="font-medium mb-2 text-orange-800">
                          Available sign-in methods:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {oauthError.availableLoginMethods.map(method => (
                            <div
                              key={method}
                              className="flex items-center gap-1 text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded"
                            >
                              {method === 'github' && (
                                <FaGithub className="h-3 w-3" />
                              )}
                              {method === 'google' && (
                                <FaGoogle className="h-3 w-3" />
                              )}
                              {method === 'email' && (
                                <Mail className="h-3 w-3" />
                              )}
                              <span className="capitalize">{method}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  {oauthError.canSetPassword && (
                    <p className="text-sm text-orange-700">
                      Tip: Sign in with your OAuth provider, then set up a
                      password in your account settings.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
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
                        placeholder="Enter your email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={forgotPasswordMutation.isPending}
                loading={forgotPasswordMutation.isPending}
                loadingText="Sending"
              >
                Send Reset Link
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center text-sm">
            <Button
              variant="link"
              className="p-0 font-normal"
              onClick={() => router.push('/log-in')}
            >
              Back to Sign In
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
