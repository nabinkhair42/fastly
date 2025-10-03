'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from 'next-themes';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { ActiveSessions } from '@/app/(protected)/components/active-sessions';
import DashboardSkeleton from '@/app/(protected)/components/dashboard-skeleton';
import { DeleteUser } from '@/app/(protected)/components/delete-user';
import { Separator } from '@/components/ui/separator';
import { useUpdateUserDetails, useUserDetails } from '@/hooks/users/useUserMutations';
import { useFont } from '@/providers/RootProvider';
import { accountPreferencesSchema } from '@/zod/usersUpdate';

type AccountFormValues = z.infer<typeof accountPreferencesSchema>;

export function AccountForm() {
  const { theme, setTheme } = useTheme();
  const { font, setFont } = useFont();
  const { data: userDetails, isLoading } = useUserDetails();
  const updateUserDetails = useUpdateUserDetails();

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountPreferencesSchema),
    defaultValues: {
      theme: (theme as 'light' | 'dark' | 'system') || 'system',
      font: font || 'sans',
    },
    mode: 'onChange',
  });

  const watchedTheme = form.watch('theme');
  const watchedFont = form.watch('font');

  // Load values from database
  React.useEffect(() => {
    if (userDetails?.data?.user?.preferences) {
      const prefs = userDetails.data.user.preferences;
      form.reset({
        theme: (prefs.theme as 'light' | 'dark' | 'system') || 'system',
        font: (prefs.font as 'sans' | 'serif' | 'mono' | 'system') || 'sans',
      });
    }
  }, [userDetails, form]);

  function onSubmit(data: AccountFormValues) {
    updateUserDetails.mutate(
      {
        preferences: {
          theme: data.theme,
          font: data.font,
        },
      },
      {
        onSuccess: () => {
          // Update global state immediately for instant feedback
          setTheme(data.theme);
          setFont(data.font);
        },
      }
    );
  }

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="w-full max-w-md">
          <h3 className="font-medium">Account Settings</h3>
          <p className="text-muted-foreground text-sm">
            Manage your account preferences and settings.
          </p>
        </div>
        <div className="space-y-6 w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Theme Selection */}
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Theme</FormLabel>
                    <FormDescription>Select the theme for the dashboard.</FormDescription>
                    <FormMessage />
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={watchedTheme}
                      className="grid max-w-md grid-cols-2 gap-8 pt-2"
                    >
                      <FormItem>
                        <FormLabel
                          className={`[&:has([data-state=checked])>div]:border-primary flex flex-col items-start ${
                            watchedTheme === 'light' ? 'border-primary' : 'border-muted'
                          }`}
                        >
                          <FormControl>
                            <RadioGroupItem value="light" className="sr-only" />
                          </FormControl>
                          <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                            <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                              <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                                <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                                <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                              </div>
                              <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                                <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                                <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                              </div>
                              <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                                <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                                <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                              </div>
                            </div>
                          </div>
                          <span className="block w-full p-2 font-normal">Light</span>
                        </FormLabel>
                      </FormItem>

                      <FormItem>
                        <FormLabel
                          className={`[&:has([data-state=checked])>div]:border-primary flex flex-col items-start ${
                            watchedTheme === 'dark' ? 'border-primary' : 'border-muted'
                          }`}
                        >
                          <FormControl>
                            <RadioGroupItem value="dark" className="sr-only" />
                          </FormControl>
                          <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                            <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                              <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                                <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                              </div>
                              <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                <div className="h-4 w-4 rounded-full bg-slate-400" />
                                <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                              </div>
                              <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                <div className="h-4 w-4 rounded-full bg-slate-400" />
                                <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                              </div>
                            </div>
                          </div>
                          <span className="block w-full p-2 font-normal">Dark</span>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormItem>
                )}
              />

              {/* Font Selection */}
              <FormField
                control={form.control}
                name="font"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Font</FormLabel>
                    <FormDescription>Select the font for the dashboard.</FormDescription>
                    <FormMessage />
                    <Select onValueChange={field.onChange} value={watchedFont}>
                      <FormControl>
                        <SelectTrigger className="w-full max-w-xs">
                          <SelectValue placeholder="Select a font" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sans">Sans</SelectItem>
                        <SelectItem value="serif">Serif</SelectItem>
                        <SelectItem value="mono">Mono</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={updateUserDetails.isPending}
                loading={updateUserDetails.isPending}
                loadingText="Updating"
              >
                Update Preferences
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row">
        <div className="w-full max-w-md">
          <h3 className="font-medium">Active Sessions</h3>
          <p className="text-muted-foreground text-sm">
            Manage devices that have recently accessed your account.
          </p>
        </div>
        <div className="w-full">
          <ActiveSessions />
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row">
        <div className="w-full max-w-md">
          <h3 className="font-medium">Delete Account</h3>
          <p className="text-muted-foreground text-sm">
            Permanently delete your account and all associated data.
          </p>
        </div>
        <div className="space-y-6 w-full">
          <DeleteUser />
        </div>
      </div>
    </div>
  );
}
