import { useUserDetails } from "@/hooks/users/use-user-mutations";
import { useUploadThing } from "@/lib/apis/uploadthing";
import { userService } from "@/services/user-service";
import { useCallback } from "react";
import toast from "react-hot-toast";

export function useAvatarUpload() {
  const { startUpload, isUploading } = useUploadThing("avatarUploader");
  const { refetch } = useUserDetails();

  const uploadAvatar = useCallback(
    async (file: File) => {
      try {
        // Upload file to UploadThing
        const uploadedFiles = await startUpload([file]);

        if (!uploadedFiles || uploadedFiles.length === 0) {
          throw new Error("Upload failed");
        }

        const uploadedFile = uploadedFiles[0];

        // Update user avatar in database with toast.promise
        await toast.promise(userService.updateAvatar(uploadedFile.ufsUrl), {
          loading: "Updating avatar",
          success: (response) => response.message,
          error: (response) => response.message,
        });

        // Refetch user details to get updated avatar
        await refetch();

        return uploadedFile.ufsUrl;
      } catch (error) {
        console.error("Avatar upload failed:", error);
        throw error;
      }
    },
    [startUpload, refetch],
  );

  const deleteAvatar = useCallback(async () => {
    try {
      // Delete avatar from database with toast.promise
      await toast.promise(userService.deleteAvatar(), {
        loading: "Removing avatar",
        success: (response) => response.message,
        error: (response) => response.message,
      });

      // Refetch user details to get updated avatar
      await refetch();
    } catch (error) {
      console.error("Avatar deletion failed:", error);
      throw error;
    }
  }, [refetch]);

  return {
    uploadAvatar,
    deleteAvatar,
    isUploading,
  };
}
