import { userQueryKeys } from "@/hooks/users/use-user-mutations";
import { useUploadThing } from "@/lib/apis/uploadthing";
import { tokenManager } from "@/lib/config/token-manager";
import { userService } from "@/services/user-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useAvatarUpload() {
  const { startUpload, isUploading } = useUploadThing("avatarUploader", {
    headers: () => {
      const token = tokenManager.getAccessToken();
      return token ? { Authorization: `Bearer ${token}` } : ({} as Record<string, string>);
    },
  });
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      // Upload file to UploadThing
      const uploadedFiles = await startUpload([file]);

      if (!uploadedFiles || uploadedFiles.length === 0) {
        throw new Error("Upload failed");
      }

      const uploadedFile = uploadedFiles[0];

      // Update user avatar in database
      await toast.promise(userService.updateAvatar(uploadedFile.ufsUrl), {
        loading: "Updating avatar",
        success: (response) => response.message,
        error: (response) => response.message,
      });

      return uploadedFile.ufsUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.userDetails });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await toast.promise(userService.deleteAvatar(), {
        loading: "Removing avatar",
        success: (response) => response.message,
        error: (response) => response.message,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.userDetails });
    },
  });

  return {
    uploadAvatar: uploadMutation.mutateAsync,
    deleteAvatar: deleteMutation.mutateAsync,
    isUploading: isUploading || uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
