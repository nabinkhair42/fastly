'use client';

import { ActionDialog } from '@/components/ui/ActionDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAvatarCrop } from '@/hooks/ui/useAvatarCrop';
import { useAvatarUpload } from '@/hooks/users/useAvatarUpload';
import { useUserDetails } from '@/hooks/users/useUserMutations';
import { Edit, RotateCcw, RotateCw, Trash2, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

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

  const handleUpload = async (croppedImageBlob: Blob) => {
    try {
      // Convert blob to file
      const file = new File([croppedImageBlob], 'avatar.png', {
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
              <Upload className="h-4 w-4 mr-2" />
              Upload a photo
            </DropdownMenuItem>
            {defaultAvatar && (
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2 text-destructive" />
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
            <ImageCropper
              file={selectedFile}
              onCrop={handleUpload}
              onClose={handleClose}
              isUploading={isUploading}
            />
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

function ImageCropper({
  file,
  onCrop,
  onClose,
  isUploading,
}: {
  file: File;
  onCrop: (croppedImage: Blob) => void;
  onClose: () => void;
  isUploading: boolean;
}) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const {
    crop,
    setCrop,
    completedCrop,
    setCompletedCrop,
    rotation,
    setRotation,
    rotateLeft,
    rotateRight,
    imageRef,
    getCroppedImageBlob,
  } = useAvatarCrop();

  // Load image when file changes
  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || '');
      });
      reader.readAsDataURL(file);
    }
  }, [file]);

  const handleCropAndUpload = async () => {
    try {
      const croppedImageBlob = await getCroppedImageBlob();
      onCrop(croppedImageBlob);
    } catch (error) {
      console.error('Failed to crop image:', error);
    }
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Crop your new profile picture</h2>
      </div>

      {/* Crop Area */}
      <div className="p-4 flex items-center justify-center">
        {imageSrc && (
          <ReactCrop
            crop={crop}
            onChange={c => setCrop(c)}
            onComplete={c => setCompletedCrop(c)}
            aspect={1}
            circularCrop
            className="max-w-full max-h-[50vh] flex items-center justify-center"
          >
            {/* Using forwardRef with Image requires custom implementation */}
            {/* We need to keep using img here because ReactCrop expects a standard img element */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imageRef as React.RefObject<HTMLImageElement>}
              src={imageSrc}
              alt="Crop preview"
              className="max-w-full max-h-96 object-contain"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: 'transform 0.3s ease',
              }}
            />
          </ReactCrop>
        )}
      </div>

      {/* Rotation Controls */}
      <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-center gap-4">
          <span className="text-sm text-gray-600">Rotate:</span>
          <Button
            variant="outline"
            size="sm"
            onClick={rotateLeft}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-center">
            {rotation}°
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={rotateRight}
            className="flex items-center gap-2"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          {rotation !== 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRotation(0)}
              className="text-gray-500 hover:text-gray-700"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center p-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleCropAndUpload}
          disabled={isUploading || !completedCrop}
          loading={isUploading}
          loadingText="Uploading"
        >
          Upload
        </Button>
      </div>
    </div>
  );
}
