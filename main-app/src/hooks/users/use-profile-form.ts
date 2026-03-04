import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import type { z } from "zod";

import { useDebounce } from "@/hooks/ui/use-debounce";
import {
  useChangeUsername,
  useUpdateUserDetails,
  useUserDetails,
} from "@/hooks/users/use-user-mutations";
import { userService } from "@/services/user-service";
import type { UpdateUserDetailsRequest } from "@/types/api";
import { profileFormInputSchema } from "@/zod/usersUpdate";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

type ProfileFormValues = z.infer<typeof profileFormInputSchema>;
type ProfileFormLocation = NonNullable<ProfileFormValues["location"]>;

const EMPTY_LOCATION: ProfileFormLocation = {
  address: "",
  city: "",
  state: "",
  country: "",
  zipCode: "",
};

const locationFromUser = (
  location: Partial<ProfileFormLocation> | null | undefined,
): ProfileFormLocation => ({
  address: location?.address ?? "",
  city: location?.city ?? "",
  state: location?.state ?? "",
  country: location?.country ?? "",
  zipCode: location?.zipCode ?? "",
});

const normalizeLocation = (
  location: Partial<ProfileFormLocation> | null | undefined,
): ProfileFormLocation | null => {
  if (!location) {
    return null;
  }

  const trimmed: ProfileFormLocation = {
    address: location.address?.trim() ?? "",
    city: location.city?.trim() ?? "",
    state: location.state?.trim() ?? "",
    country: location.country?.trim() ?? "",
    zipCode: location.zipCode?.trim() ?? "",
  };

  const hasValues = Object.values(trimmed).some((value) => value.length > 0);

  return hasValues ? trimmed : null;
};

export function useProfileForm() {
  const { data: userDetails, isLoading } = useUserDetails();
  const updateUserDetails = useUpdateUserDetails();
  const changeUsername = useChangeUsername();

  const [usernameValue, setUsernameValue] = useState("");
  const debouncedUsername = useDebounce(usernameValue, 500);

  // Derive primitive values for dependency tracking
  const currentUsername = userDetails?.data?.user?.username ?? "";
  const hasChangedUsername = userDetails?.data?.user?.hasChangedUsername ?? false;

  // Use TanStack Query for username availability check
  const shouldCheckUsername =
    debouncedUsername.length >= 3 &&
    debouncedUsername !== currentUsername &&
    !hasChangedUsername;

  const usernameCheckQuery = useQuery({
    queryKey: ["username-availability", debouncedUsername],
    queryFn: () => userService.checkUsernameAvailability(debouncedUsername),
    enabled: shouldCheckUsername,
    retry: false,
    staleTime: 30 * 1000, // Cache availability checks for 30s
  });

  const usernameAvailable = !shouldCheckUsername
    ? null
    : usernameCheckQuery.isSuccess
      ? true
      : usernameCheckQuery.isError
        ? false
        : null;
  const checkingUsername = usernameCheckQuery.isFetching;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormInputSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      bio: "",
      socialAccounts: [],
      dob: undefined,
      location: { ...EMPTY_LOCATION },
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "socialAccounts",
    control: form.control,
  });

  // Update form when user details are loaded
  // Use primitive values as dependencies to avoid unnecessary re-renders
  const userId = userDetails?.data?.user?._id;
  const userFirstName = userDetails?.data?.user?.firstName ?? "";
  const userLastName = userDetails?.data?.user?.lastName ?? "";
  const userBio = userDetails?.data?.user?.bio ?? "";

  useEffect(() => {
    if (userId && userDetails?.data?.user) {
      const user = userDetails.data.user;
      const initialUsername = user.username || "";
      form.reset({
        firstName: userFirstName,
        lastName: userLastName,
        username: initialUsername,
        bio: userBio,
        socialAccounts:
          user.socialAccounts?.map((account) => ({
            provider: account.provider || "website",
            url: account.url,
          })) || [],
        dob: user.dob ? new Date(user.dob) : undefined,
        location: locationFromUser(user.location),
      });
      setUsernameValue(initialUsername);
    }
  }, [userId, userFirstName, userLastName, userBio, form, userDetails]);

  const updateOtherDetails = (data: ProfileFormValues) => {
    // Transform social accounts to the expected format
    const socialAccounts =
      data.socialAccounts?.map((account) => ({
        url: account.url,
        provider: account.provider,
      })) || [];

    const user = userDetails?.data?.user;
    const nextLocation = normalizeLocation(data.location);
    const currentLocation = normalizeLocation(locationFromUser(user?.location));
    const locationHasChanged =
      JSON.stringify(nextLocation) !== JSON.stringify(currentLocation);

    const payload: UpdateUserDetailsRequest = {
      firstName: data.firstName,
      lastName: data.lastName,
      bio: data.bio,
      socialAccounts,
      dob: data.dob,
    };

    if (locationHasChanged) {
      payload.location = nextLocation;
    }

    updateUserDetails.mutate(payload);
  };

  const handleSubmit = (data: ProfileFormValues) => {
    const user = userDetails?.data?.user;
    if (!user) {
      return;
    }

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
        },
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
