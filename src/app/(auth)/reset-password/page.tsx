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
import { useResetPassword } from '@/hooks/useAuthMutations';
import { resetPasswordRequestSchema } from '@/zod/authValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type ResetPasswordFormData = z.infer<typeof resetPasswordRequestSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetPasswordMutation = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordRequestSchema),
    defaultValues: {
      email: '',
      resetToken: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    // Get token from URL query parameter
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      form.setValue('resetToken', tokenFromUrl);
    } else {
      // If no token, redirect to forgot password
      router.push('/forgot-password');
    }

    // Get email from localStorage (if available from forgot password page)
    const storedEmail = localStorage.getItem('resetPasswordEmail');
    if (storedEmail) {
      setEmail(storedEmail);
      form.setValue('email', storedEmail);
    }
  }, [searchParams, form, router]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPasswordMutation.mutateAsync(data);
      // Clear stored email
      localStorage.removeItem('resetPasswordEmail');
      // Redirect to login page after successful reset
      router.push('/log-in');
    } catch (error) {
      console.error(error);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground">
                Invalid or missing reset token. Please request a new password
                reset.
              </p>
              <Button
                onClick={() => router.push('/forgot-password')}
                className="mt-4"
              >
                Go to Forgot Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
            <Lock className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Reset Your Password
          </CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
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
                        placeholder="Enter your email address"
                        {...field}
                        value={email}
                        onChange={e => {
                          setEmail(e.target.value);
                          field.onChange(e);
                        }}
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
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your new password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your new password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
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
                disabled={resetPasswordMutation.isPending}
                loading={resetPasswordMutation.isPending}
                loadingText="Resetting"
              >
                Reset Password
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
