'use client';

import { ActionDialog } from '@/components/ui/action-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ImageCrop,
  ImageCropContent,
  useImageCrop,
} from '@/components/ui/image-crop';
import { useAvatarUpload } from '@/hooks/users/useAvatarUpload';
import { useUserDetails } from '@/hooks/users/useUserMutations';
import { Edit, ImagePlay, Trash2, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

// Custom component that can access the ImageCrop context
const CropControls = ({
  isUploading,
  onClose,
}: {
  isUploading: boolean;
  onClose: () => void;
}) => {
  const { applyCrop, completedCrop } = useImageCrop();

  const handleUpload = async () => {
    if (completedCrop) {
      await applyCrop();
    }
  };

  return (
    <>
      <div className="flex justify-end gap-2 items-center w-full border-t p-4">
        <Button variant="destructive" onClick={onClose}>
          <X className="h-4 w-4" />
          Cancel
        </Button>
        <Button
          disabled={isUploading || !completedCrop}
          loading={isUploading}
          loadingText="Uploading"
          onClick={handleUpload}
        >
          <Upload className="h-4 w-4" />
          Upload
        </Button>
      </div>
    </>
  );
};

export function UploadAvatar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: userDetails } = useUserDetails();
  const { uploadAvatar, deleteAvatar, isUploading } = useAvatarUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultAvatar = userDetails?.data?.user?.avatar;
  const avatarFallback =
    (userDetails?.data?.user?.firstName?.charAt(0) || '') +
    (userDetails?.data?.user?.lastName?.charAt(0) || '');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setIsOpen(true);
    }
  };

  const handleUpload = async (croppedImageDataUrl: string) => {
    try {
      // Convert data URL to blob
      const response = await fetch(croppedImageDataUrl);
      const blob = await response.blob();

      // Convert blob to file
      const file = new File([blob], 'avatar.png', {
        type: 'image/png',
      });

      await uploadAvatar(file);
      setIsOpen(false);
      setSelectedFile(null);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedFile(null);
  };

  const handleDeleteAvatar = async () => {
    try {
      setIsDeleting(true);
      await deleteAvatar();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-foreground">Profile picture</div>

      <div className="relative w-fit">
        <Avatar className="h-20 w-20">
          <AvatarImage src={defaultAvatar || ''} />
          <AvatarFallback className="text-lg border">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="absolute rounded-full h-7 w-7 bottom-1 left-15 -translate-x-1/2 z-50"
          >
            <Button variant="outline" size="icon">
              <Edit className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4" />
              Upload a photo
            </DropdownMenuItem>
            {defaultAvatar && (
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
                <span className="text-destructive">Remove photo</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl p-0 gap-0">
          <DialogTitle className="sr-only">
            Crop your new profile picture
          </DialogTitle>
          {selectedFile && (
            <div>
              {/* Header */}
              <div className="flex border-b gap-2 p-4">
                <ImagePlay className="mt-1" />
                <div className="flex flex-col">
                  <h2 className="text-lg font-semibold">Upload Avatar</h2>
                  <p className="text-sm text-muted-foreground">
                    Crop and upload your new avatar
                  </p>
                </div>
              </div>

              {/* Crop Area */}
              <div className="flex justify-center flex-col">
                <ImageCrop
                  file={selectedFile}
                  onCrop={handleUpload}
                  aspect={1}
                  circularCrop
                  className="flex flex-col gap-2"
                >
                  <ImageCropContent className="max-h-[50vh]" />
                  <CropControls
                    isUploading={isUploading}
                    onClose={handleClose}
                  />
                </ImageCrop>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {showDeleteDialog && (
        <ActionDialog
          title="Remove Profile Picture"
          description="Are you sure you want to remove your profile picture? This action cannot be undone."
          onConfirm={handleDeleteAvatar}
          onCancel={() => setShowDeleteDialog(false)}
          confirmText="Delete"
          cancelText="Cancel"
          isActionDestructive={true}
          loadingText="Deleting"
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
