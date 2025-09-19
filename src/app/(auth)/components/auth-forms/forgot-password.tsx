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
import { useForgotPassword } from '@/hooks/auth/useAuthMutations';
import { forgotPasswordSchema } from '@/zod/authValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const router = useRouter();
  const forgotPasswordMutation = useForgotPassword();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPasswordMutation.mutateAsync(data);
      // Store email in localStorage for reset-password page
      localStorage.setItem('resetPasswordEmail', data.email);
      // Could redirect to a success page or show success message
    } catch (error) {
      console.error(error);
    }
  };

  return (
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
  );
}
