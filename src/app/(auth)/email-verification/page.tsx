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
  FormMessage,
} from '@/components/ui/form';
import {
  useResendVerification,
  useVerifyEmail,
} from '@/hooks/auth/useAuthMutations';
import { verifyEmailSchema } from '@/zod/authValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, Mail, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';

type EmailVerificationFormData = z.infer<typeof verifyEmailSchema>;

export default function EmailVerificationPage() {
  const [email, setEmail] = useState('');
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();

  const verifyEmailMutation = useVerifyEmail(() => {
    // This callback runs after auth state is updated
    // Redirect to dashboard after successful verification
    router.push('/dashboard');
  });
  const resendVerificationMutation = useResendVerification();

  const form = useForm<EmailVerificationFormData>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: '',
      verificationCode: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    // Get email from localStorage (set in create-account page)
    const storedEmail = localStorage.getItem('verificationEmail');
    if (storedEmail) {
      setEmail(storedEmail);
      form.setValue('email', storedEmail);
    } else {
      // If no email stored, redirect to create-account
      router.push('/create-account');
    }
  }, [form, router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const onSubmit = async (data: EmailVerificationFormData) => {
    try {
      await verifyEmailMutation.mutateAsync(data);
      // Clear stored email
      localStorage.removeItem('verificationEmail');
      // Redirect will be handled in the mutation's onSuccess callback
    } catch (error) {
      console.error(error);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;

    try {
      await resendVerificationMutation.mutateAsync(email);
      setCountdown(60); // 60 second countdown
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
            <Mail className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Verify Your Email
          </CardTitle>
          <CardDescription>
            We&apos;ve sent a verification code to{' '}
            <span className="font-medium">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="verificationCode"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center justify-center">
                    <FormControl className="flex flex-col justify-center w-full">
                      <InputOTP
                        placeholder="Enter 6-digit code"
                        className="text-center text-lg w-full"
                        maxLength={6}
                        inputMode="numeric"
                        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                        {...field}
                      >
                        {' '}
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      Enter the 6-digit code sent to your email
                    </FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={verifyEmailMutation.isPending}
                loading={verifyEmailMutation.isPending}
                loadingText="Verifying"
              >
                Verify Email
              </Button>
            </form>
          </Form>

          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground flex items-center justify-center">
              Didn&apos;t receive the code?{' '}
              <Button
                variant="link"
                className="p-0 font-normal "
                onClick={handleResendCode}
                disabled={countdown > 0 || resendVerificationMutation.isPending}
              >
                {countdown > 0 ? (
                  `Resend in ${countdown}s`
                ) : resendVerificationMutation.isPending ? (
                  <>
                    <RotateCcw className="animate-spin" size={14} />
                    Sending...
                  </>
                ) : (
                  <>
                    <RotateCcw size={14} />
                    Resend code
                  </>
                )}
              </Button>
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center text-sm">
            <Button
              variant="link"
              className="p-0 font-normal"
              onClick={() => {
                localStorage.removeItem('verificationEmail');
                router.push('/create-account');
              }}
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Create Account
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
