'use client';

import { Button } from '@/components/ui/button';
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
import { useChangePassword } from '@/hooks/users/useUserMutations';
import { changePasswordSchema, setPasswordSchema } from '@/zod/usersUpdate';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import {
  useForm,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import { z } from 'zod';

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
type CreatePasswordValues = z.infer<typeof setPasswordSchema>;

type ChangePasswordFormProps =
  | { mode: 'change'; providerLabel?: string }
  | { mode: 'create'; providerLabel?: string };

export default function ChangePasswordForm(props: ChangePasswordFormProps) {
  if (props.mode === 'create') {
    return <CreatePasswordForm providerLabel={props.providerLabel} />;
  }

  return <UpdatePasswordForm providerLabel={props.providerLabel} />;
}

function UpdatePasswordForm({}: { providerLabel?: string }) {
  const { mutate: changePassword, isPending } = useChangePassword();
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const onSubmit = (values: ChangePasswordValues) => {
    changePassword(values);
  };

  return (
    <PasswordFormLayout
      title="Change Password"
      description="Change your account password regularly to enhance security."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? 'text' : 'password'}
                      {...field}
                    />
                    <ToggleButton
                      isActive={showCurrentPassword}
                      onClick={() => setShowCurrentPassword(prev => !prev)}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Enter your current password to change it.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <PasswordFields
            control={form.control}
            showNewPassword={showNewPassword}
            onToggleShowNewPassword={() => setShowNewPassword(prev => !prev)}
          />

          <Button
            type="submit"
            disabled={isPending}
            loading={isPending}
            loadingText="Changing Password..."
          >
            Change Password
          </Button>
        </form>
      </Form>
    </PasswordFormLayout>
  );
}

function CreatePasswordForm({ providerLabel }: { providerLabel?: string }) {
  const { mutate: changePassword, isPending } = useChangePassword();
  const form = useForm<CreatePasswordValues>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const [showNewPassword, setShowNewPassword] = useState(false);

  const onSubmit = (values: CreatePasswordValues) => {
    changePassword(values);
  };

  return (
    <PasswordFormLayout
      title="Add a Password"
      description={
        providerLabel
          ? `You currently sign in with ${providerLabel}. Set a password to unlock email sign-in and account recovery.`
          : 'Set a password to unlock email sign-in and account recovery.'
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <PasswordFields
            control={form.control}
            showNewPassword={showNewPassword}
            onToggleShowNewPassword={() => setShowNewPassword(prev => !prev)}
          />

          <Button
            type="submit"
            disabled={isPending}
            loading={isPending}
            loadingText="Saving Password"
          >
            Save Password
          </Button>
        </form>
      </Form>
    </PasswordFormLayout>
  );
}

function PasswordFormLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      <div className="w-full max-w-md">
        <h3 className="font-medium">{title}</h3>
        <p className="text-muted-foreground text-sm whitespace-pre-line">
          {description}
        </p>
      </div>
      <div className="space-y-6 w-full">{children}</div>
    </div>
  );
}

function PasswordFields<
  TFieldValues extends FieldValues & {
    newPassword: string;
    confirmPassword: string;
  },
>({
  control,
  showNewPassword,
  onToggleShowNewPassword,
}: {
  control: Control<TFieldValues>;
  showNewPassword: boolean;
  onToggleShowNewPassword: () => void;
}) {
  return (
    <>
      <FormField
        control={control}
        name={'newPassword' as Path<TFieldValues>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>New Password</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  {...field}
                />
                <ToggleButton
                  isActive={showNewPassword}
                  onClick={onToggleShowNewPassword}
                />
              </div>
            </FormControl>
            <FormDescription>
              Choose a strong password with at least 8 characters, including
              letters, numbers, and symbols.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={'confirmPassword' as Path<TFieldValues>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm Password</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  {...field}
                />
                <ToggleButton
                  isActive={showNewPassword}
                  onClick={onToggleShowNewPassword}
                />
              </div>
            </FormControl>
            <FormDescription>Re-enter the new password.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

function ToggleButton({
  isActive,
  onClick,
}: {
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
      onClick={onClick}
    >
      {isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </Button>
  );
}
