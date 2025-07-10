import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useDebounce } from '@/hooks/useDebounce';
import {
  useChangeUsername,
  useUpdateUserDetails,
  useUserDetails,
} from '@/hooks/useUserMutations';
import { userService } from '@/services/userService';
import { profileFormInputSchema } from '@/zod/usersUpdate';

type ProfileFormValues = z.infer<typeof profileFormInputSchema>;

export function useProfileForm() {
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
    resolver: zodResolver(profileFormInputSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      bio: '',
      socialAccounts: [],
      dob: undefined,
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    name: 'socialAccounts',
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
        socialAccounts:
          user.socialAccounts?.map(account => ({
            provider: account.provider || 'website',
            url: account.url,
          })) || [],
        dob: user.dob ? new Date(user.dob) : undefined,
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

  const updateOtherDetails = (data: ProfileFormValues) => {
    // Transform social accounts to the expected format
    const socialAccounts =
      data.socialAccounts?.map(account => ({
        url: account.url,
        provider: account.provider,
      })) || [];

    updateUserDetails.mutate({
      firstName: data.firstName,
      lastName: data.lastName,
      bio: data.bio,
      socialAccounts,
      dob: data.dob,
    });
  };

  const handleSubmit = (data: ProfileFormValues) => {
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
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameValue(e.target.value);
  };

  const user = userDetails?.data?.user;
  const hasChangedUsername = user?.hasChangedUsername || false;
  const isSubmitDisabled =
    updateUserDetails.isPending ||
    changeUsername.isPending ||
    (!hasChangedUsername &&
      usernameValue !== user?.username &&
      usernameAvailable === false);

  return {
    // Form controls
    form,
    fields,
    append,
    remove,
    handleSubmit,

    // Loading states
    isLoading,
    isSubmitDisabled,
    isUpdating: updateUserDetails.isPending || changeUsername.isPending,

    // Username availability
    usernameValue,
    usernameAvailable,
    checkingUsername,
    handleUsernameChange,
    hasChangedUsername,

    // User data
    user,
  };
}
