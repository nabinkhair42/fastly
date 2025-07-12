'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAvatarCrop } from '@/hooks/useAvatarCrop';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';
import { useUserDetails } from '@/hooks/useUserMutations';
import { Edit, Trash2, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export function UploadAvatar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { data: userDetails } = useUserDetails();
  const { uploadAvatar, isUploading } = useAvatarUpload();
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
              Upload a photo...
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Remove photo
            </DropdownMenuItem>
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
        <Button variant="ghost" size="sm" onClick={onClose}>
          ×
        </Button>
      </div>

      {/* Crop Area */}
      <div className="p-4">
        {imageSrc && (
          <ReactCrop
            crop={crop}
            onChange={c => setCrop(c)}
            onComplete={c => setCompletedCrop(c)}
            aspect={1}
            circularCrop
            className="max-w-full"
          >
            {/* Using forwardRef with Image requires custom implementation */}
            {/* We need to keep using img here because ReactCrop expects a standard img element */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imageRef as React.RefObject<HTMLImageElement>}
              src={imageSrc}
              alt="Crop preview"
              className="max-w-full max-h-96 object-contain"
            />
          </ReactCrop>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center p-4 border-t">
        <Button variant="outline" onClick={onClose} disabled={isUploading}>
          Cancel
        </Button>
        <Button
          onClick={handleCropAndUpload}
          disabled={isUploading || !completedCrop}
        >
          {isUploading
            ? 'Setting new profile picture...'
            : 'Set new profile picture'}
        </Button>
      </div>
    </div>
  );
}
