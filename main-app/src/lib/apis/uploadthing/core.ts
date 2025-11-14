import { authenticateToken } from "@/helpers/jwt-token";
import type { NextRequest } from "next/server";
import { type FileRouter, createUploadthing } from "uploadthing/next";
import { UTApi } from "uploadthing/server";

const f = createUploadthing();

/**
 * Extract user ID from request headers
 * @param request - NextRequest object
 * @returns User ID or throws error if not authenticated
 */
const getUserIdFromRequest = (request: NextRequest): string => {
  try {
    const decoded = authenticateToken(request);
    return decoded.userId;
  } catch {
    throw new Error("Unauthorized: Invalid or missing authentication token");
  }
};

// FileRouter for your app, can contain multiple FileRoutes
export const uploadRouter = {
  // Avatar uploader route
  avatarUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      // Authenticate user from request
      const userId = getUserIdFromRequest(req as unknown as NextRequest);
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code runs on your server after upload
      console.log("Avatar upload complete for userId:", metadata.userId);
      console.log("File URL:", file.ufsUrl);

      // Return data sent to client-side `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;

// Export UTApi instance for server-side operations like file deletion
export const utapi = new UTApi();
