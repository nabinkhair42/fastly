import { useUserDetails } from '@/hooks/users/useUserMutations';
import { useUploadThing } from '@/lib/apis/uploadthing/uploadThing';
import { userService } from '@/services/userService';
import { useCallback } from 'react';
import toast from 'react-hot-toast';

export function useAvatarUpload() {
  const { startUpload, isUploading } = useUploadThing('avatarUploader', {
    onClientUploadComplete: res => {
      console.log('Files: ', res);
      toast.success('Upload completed');
    },
    onUploadError: (error: Error) => {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error.message}`);
    },
  });
  const { refetch } = useUserDetails();

  const uploadAvatar = useCallback(
    async (file: File) => {
      try {
        // Upload file to UploadThing
        const uploadedFiles = await startUpload([file]);

        if (!uploadedFiles || uploadedFiles.length === 0) {
          throw new Error('Upload failed');
        }

        const uploadedFile = uploadedFiles[0];

        // Update user avatar in database
        await userService.updateAvatar(uploadedFile.ufsUrl);

        // Refetch user details to get updated avatar
        await refetch();

        toast.success('Avatar updated successfully!');

        return uploadedFile.ufsUrl;
      } catch (error) {
        console.error('Avatar upload failed:', error);
        toast.error('Failed to upload avatar. Please try again.');
        throw error;
      }
    },
    [startUpload, refetch]
  );

  const deleteAvatar = useCallback(async () => {
    try {
      // Delete avatar from database
      await userService.deleteAvatar();

      // Refetch user details to get updated avatar
      await refetch();

      toast.success('Avatar removed successfully!');
    } catch (error) {
      console.error('Avatar deletion failed:', error);
      toast.error('Failed to remove avatar. Please try again.');
      throw error;
    }
  }, [refetch]);

  return {
    uploadAvatar,
    deleteAvatar,
    isUploading,
  };
}
