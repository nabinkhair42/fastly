import crypto from "node:crypto";
import { requireAuth } from "@/lib/auth/auth-middleware";
import dbConnect from "@/lib/config/db-connect";
import { handleApiError } from "@/lib/utils/error-handler";
import { logApiError } from "@/lib/utils/logger";
import { sendAppError, sendNotFound, sendSuccess } from "@/lib/utils/response";
import { validateAndSanitize } from "@/lib/utils/validators";
import { UserAuthModel, UserModel } from "@/models/users";
import type { UpdateUserDetailsRequest } from "@/types/api";
import { updateUserDetailsSchema } from "@/zod/usersUpdate";
import type { NextRequest } from "next/server";

const normalizeLocationInput = (
  location: UpdateUserDetailsRequest["location"] | undefined,
): UpdateUserDetailsRequest["location"] => {
  if (location === null || location === undefined) {
    return null;
  }

  const trimmed = {
    address: location.address?.trim() ?? "",
    city: location.city?.trim() ?? "",
    state: location.state?.trim() ?? "",
    country: location.country?.trim() ?? "",
    zipCode: location.zipCode?.trim() ?? "",
  };

  const hasValues = Object.values(trimmed).some((value) => value.length > 0);

  return hasValues ? trimmed : null;
};

/**
 * GET /api/(users)/user-details
 * Fetch authenticated user details
 * @param request - NextRequest with authorization header
 * @returns User profile details
 */
export async function GET(request: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    await dbConnect();

    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const user = await UserModel.findOne({ userAuth: authResult.user?.userId });
    if (!user) {
      return sendNotFound("User profile not found", requestId);
    }

    const userAuth = await UserAuthModel.findOne({ _id: user.userAuth });

    return sendSuccess(
      "User details fetched successfully",
      {
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
          authMethod: userAuth?.authMethod,
          hasPassword: Boolean(userAuth?.password),
        },
      },
      requestId,
    );
  } catch (error) {
    logApiError("/api/user-details", error, { method: "GET" });
    const appError = handleApiError(error, {
      endpoint: "/api/user-details",
      method: "GET",
    });
    return sendAppError(appError, requestId);
  }
}

/**
 * POST /api/(users)/user-details
 * Update authenticated user details
 * @param request - NextRequest with authorization header and update data in body
 * @returns Updated user confirmation
 */
export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    await dbConnect();

    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    // Parse and validate request body
    const requestData = await request.json();
    const {
      firstName,
      lastName,
      bio,
      socialAccounts,
      preferences,
      dob,
      location,
    } = validateAndSanitize(requestData, updateUserDetailsSchema);

    // Find user by authenticated user ID
    const user = await UserModel.findOne({ userAuth: authResult.user?.userId });
    if (!user) {
      return sendNotFound("User profile not found", requestId);
    }

    const updateFields: UpdateUserDetailsRequest = {};

    // Build update fields only if changed
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
      updateFields.socialAccounts = socialAccounts.map((account) => ({
        url: account.url,
        provider: account.provider || "website",
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
      if (
        JSON.stringify(normalizedLocation) !== JSON.stringify(currentLocation)
      ) {
        updateFields.location = normalizedLocation;
      }
    }

    // Check if there are changes
    if (Object.keys(updateFields).length === 0) {
      return sendSuccess(
        "No changes detected",
        { message: "Profile is up to date" },
        requestId,
      );
    }

    // Update user with changed fields
    await UserModel.findByIdAndUpdate(
      user._id,
      { $set: updateFields },
      { new: true, runValidators: true },
    );

    return sendSuccess(
      "User details updated successfully",
      { message: "Profile updated" },
      requestId,
    );
  } catch (error) {
    logApiError("/api/user-details", error, { method: "POST" });
    const appError = handleApiError(error, {
      endpoint: "/api/user-details",
      method: "POST",
    });
    return sendAppError(appError, requestId);
  }
}
