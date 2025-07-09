'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { CheckCircle, Loader2, Trash2, XCircle } from 'lucide-react';

import { useDebounce } from '@/hooks/useDebounce';
import {
  useChangeUsername,
  useUpdateUserDetails,
  useUserDetails,
} from '@/hooks/useUserMutations';
import { userService } from '@/services/userService';
import { profileFormSchema } from '@/zod/usersUpdate';
import { useEffect, useState } from 'react';

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const { data: userDetails, isLoading } = useUserDetails();
  const updateUserDetails = useUpdateUserDetails();
  const changeUsername = useChangeUsername();

  const [usernameValue, setUsernameValue] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const [checkingUsername, setCheckingUsername] = useState(false);
  const debouncedUsername = useDebounce(usernameValue, 500);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      bio: '',
      urls: [],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    name: 'urls',
    control: form.control,
  });

  // Update form when user details are loaded
  useEffect(() => {
    if (userDetails?.data?.user) {
      const user = userDetails.data.user;
      const initialUsername = user.username || '';
      form.reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: initialUsername,
        bio: user.bio || '',
        urls:
          user.socialAccounts?.map(account => ({ value: account.url })) || [],
      });
      setUsernameValue(initialUsername);
    }
  }, [userDetails, form]);

  // Check username availability when debounced value changes
  useEffect(() => {
    if (debouncedUsername && userDetails?.data?.user) {
      const currentUsername = userDetails.data.user.username;
      const hasChangedUsername = userDetails.data.user.hasChangedUsername;

      // Don't check if username hasn't changed or if user has already changed username
      if (debouncedUsername === currentUsername || hasChangedUsername) {
        setUsernameAvailable(null);
        return;
      }

      // Don't check if username is empty or too short
      if (debouncedUsername.length < 3) {
        setUsernameAvailable(null);
        return;
      }

      // Reset states before checking
      setCheckingUsername(true);
      setUsernameAvailable(null);

      // Use the service directly instead of the mutation hook
      userService
        .checkUsernameAvailability(debouncedUsername)
        .then(() => {
          setUsernameAvailable(true);
          setCheckingUsername(false);
        })
        .catch(() => {
          setUsernameAvailable(false);
          setCheckingUsername(false);
        });
    }
  }, [debouncedUsername, userDetails]);

  function onSubmit(data: ProfileFormValues) {
    const user = userDetails?.data?.user;
    if (!user) return;

    // Check if username has changed and user hasn't already changed it
    const usernameChanged = data.username !== user.username;
    const canChangeUsername = !user.hasChangedUsername;

    if (usernameChanged && canChangeUsername) {
      // Change username first, then update other details
      changeUsername.mutate(
        { username: data.username },
        {
          onSuccess: () => {
            // After username change, update other details
            updateOtherDetails(data);
          },
        }
      );
    } else {
      // Just update other details
      updateOtherDetails(data);
    }
  }

  function updateOtherDetails(data: ProfileFormValues) {
    // Transform URLs to social accounts format
    const socialAccounts =
      data.urls?.map(url => ({
        url: url.value,
        provider: 'website', // Default provider
      })) || [];

    updateUserDetails.mutate({
      firstName: data.firstName,
      lastName: data.lastName,
      bio: data.bio,
      socialAccounts,
    });
  }

  if (isLoading) {
    return <div className="px-6">Loading...</div>;
  }

  const user = userDetails?.data?.user;
  const hasChangedUsername = user?.hasChangedUsername || false;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-6">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormDescription>
                This is your first name. It will be displayed on your profile.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormDescription>
                This is your last name. It will be displayed on your profile.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="shadcn"
                    {...field}
                    disabled={hasChangedUsername}
                    onChange={e => {
                      field.onChange(e);
                      setUsernameValue(e.target.value);
                    }}
                  />
                  {!hasChangedUsername &&
                    usernameValue &&
                    usernameValue !== user?.username && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {checkingUsername ? (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        ) : usernameAvailable === true ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : usernameAvailable === false ? (
                          <XCircle className="h-4 w-4 text-red-500" />
                        ) : null}
                      </div>
                    )}
                </div>
              </FormControl>
              <FormDescription>
                {hasChangedUsername ? (
                  <span className="text-muted-foreground">
                    Username can only be changed once. You have already updated
                    your username.
                  </span>
                ) : (
                  <span className="text-muted-foreground">
                    You can change your username only once. Choose carefully.
                  </span>
                )}
              </FormDescription>
              {!hasChangedUsername &&
                usernameValue &&
                usernameValue !== user?.username && (
                  <div className="text-sm">
                    {checkingUsername ? (
                      <span className="text-muted-foreground">
                        Checking availability...
                      </span>
                    ) : usernameAvailable === true ? (
                      <span className="text-green-600">
                        ✓ Username is available
                      </span>
                    ) : usernameAvailable === false ? (
                      <span className="text-red-600">
                        ✗ Username is already taken
                      </span>
                    ) : null}
                  </div>
                )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your bio. It will be displayed on your profile.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`urls.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && 'sr-only')}>
                    URLs
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && 'sr-only')}>
                    Add links to your website, blog, or social media profiles.
                  </FormDescription>
                  <FormControl>
                    <div className="flex flex-row gap-2">
                      <Input
                        {...field}
                        className="flex-1 mt-2"
                        placeholder="https://example.com"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        className="mt-2"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ value: '' })}
          >
            Add URL
          </Button>
        </div>
        <Button
          type="submit"
          disabled={
            updateUserDetails.isPending ||
            changeUsername.isPending ||
            (!hasChangedUsername &&
              usernameValue !== user?.username &&
              usernameAvailable === false)
          }
        >
          {updateUserDetails.isPending || changeUsername.isPending
            ? 'Updating...'
            : 'Update profile'}
        </Button>
      </form>
    </Form>
  );
}
