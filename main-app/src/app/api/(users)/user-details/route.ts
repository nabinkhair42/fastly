import { sendResponse } from '@/lib/apis/send-response';
import { requireAuth } from '@/lib/auth/auth-middleware';
import dbConnect from '@/lib/config/db-connect';
import { UserAuthModel, UserModel } from '@/models/users';
import { UpdateUserDetailsRequest } from '@/types/api';
import { updateUserDetailsSchema } from '@/zod/usersUpdate';
import { NextRequest } from 'next/server';

const normalizeLocationInput = (
  location: UpdateUserDetailsRequest['location'] | undefined
): UpdateUserDetailsRequest['location'] => {
  if (location === null || location === undefined) {
    return null;
  }

  const trimmed = {
    address: location.address?.trim() ?? '',
    city: location.city?.trim() ?? '',
    state: location.state?.trim() ?? '',
    country: location.country?.trim() ?? '',
    zipCode: location.zipCode?.trim() ?? '',
  };

  const hasValues = Object.values(trimmed).some(value => value.length > 0);

  return hasValues ? trimmed : null;
};

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const user = await UserModel.findOne({ userAuth: authResult.user!.userId });
    if (!user) {
      return sendResponse('User profile not found', 404);
    }

    const userAuth = await UserAuthModel.findOne({ _id: user.userAuth });

    const authMethod = userAuth?.authMethod;
    const hasPassword = Boolean(userAuth?.password);

    return sendResponse('User details fetched successfully', 200, {
      user: {
        _id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        location: user.location,
        socialAccounts: user.socialAccounts,
        bio: user.bio,
        preferences: user.preferences,
        dob: user.dob,
        hasChangedUsername: user.hasChangedUsername,
        authMethod: authMethod,
        hasPassword,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return sendResponse(errorMessage, 500, null, error);
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const requestData = await request.json();

    // Validate request body
    const validationResult = updateUserDetailsSchema.safeParse(requestData);
    if (!validationResult.success) {
      return sendResponse(validationResult.error.message, 400);
    }

    const { firstName, lastName, bio, socialAccounts, preferences, dob, location } =
      validationResult.data;

    // Find user by authenticated user ID
    const user = await UserModel.findOne({ userAuth: authResult.user!.userId });
    if (!user) {
      return sendResponse('User profile not found', 404);
    }

    const updateFields: UpdateUserDetailsRequest = {};
    // Update fields only if provided and different from current values
    if (firstName !== undefined && firstName.trim() !== user.firstName) {
      updateFields.firstName = firstName.trim();
    }
    if (lastName !== undefined && lastName.trim() !== user.lastName) {
      updateFields.lastName = lastName.trim();
    }
    if (bio !== undefined) {
      const trimmedBio = bio?.trim();
      updateFields.bio = trimmedBio || null;
    }
    if (socialAccounts !== undefined) {
      updateFields.socialAccounts = socialAccounts.map(account => ({
        url: account.url,
        provider: account.provider || 'website',
      }));
    }
    if (preferences !== undefined) {
      updateFields.preferences = preferences;
    }
    if (dob !== undefined) {
      updateFields.dob = dob;
    }
    if (location !== undefined) {
      const normalizedLocation = normalizeLocationInput(location);
      const currentLocation = normalizeLocationInput(user.location);
      if (JSON.stringify(normalizedLocation) !== JSON.stringify(currentLocation)) {
        updateFields.location = normalizedLocation;
      }
    }
    // Only update if there are actual changes
    if (Object.keys(updateFields).length === 0) {
      return sendResponse('No changes detected', 200);
    }

    // Update user with only the changed fields
    await UserModel.findByIdAndUpdate(
      user._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    return sendResponse('User details updated successfully', 200);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return sendResponse(errorMessage, 500, null, error);
  }
}
