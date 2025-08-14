import { useRef, useState } from 'react';
import type { Crop, PixelCrop } from 'react-image-crop';

export function useAvatarCrop() {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [rotation, setRotation] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);

  const rotateLeft = () => setRotation(prev => (prev - 90) % 360);
  const rotateRight = () => setRotation(prev => (prev + 90) % 360);

  const getCroppedImageBlob = async (): Promise<Blob> => {
    if (!completedCrop || !imageRef.current) {
      throw new Error('Crop not completed or image not loaded');
    }

    const image = imageRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const pixelRatio = window.devicePixelRatio;
    canvas.width = Math.floor(completedCrop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(completedCrop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = 'high';

    // Get the original crop coordinates (before rotation)
    let cropX = completedCrop.x * scaleX;
    let cropY = completedCrop.y * scaleY;
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    // If there's rotation, we need to transform the coordinates
    if (rotation !== 0) {
      const imageCenterX = image.naturalWidth / 2;
      const imageCenterY = image.naturalHeight / 2;

      // Convert crop center to image coordinates
      const cropCenterX = cropX + cropWidth / 2;
      const cropCenterY = cropY + cropHeight / 2;

      // Transform crop center based on rotation
      const angle = (rotation * Math.PI) / 180;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      // Rotate the crop center around image center
      const dx = cropCenterX - imageCenterX;
      const dy = cropCenterY - imageCenterY;
      const rotatedX = imageCenterX + dx * cos - dy * sin;
      const rotatedY = imageCenterY + dx * sin + dy * cos;

      // Update crop coordinates to the rotated position
      cropX = rotatedX - cropWidth / 2;
      cropY = rotatedY - cropHeight / 2;
    }

    console.log('Cropping with rotation:', {
      rotation,
      originalCropX: completedCrop.x * scaleX,
      originalCropY: completedCrop.y * scaleY,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      imageWidth: image.naturalWidth,
      imageHeight: image.naturalHeight,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
    });

    ctx.save();

    // Draw the cropped portion of the image
    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    ctx.restore();

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        blob => {
          if (!blob) {
            reject(new Error('Failed to create blob'));
            return;
          }
          resolve(blob);
        },
        'image/png',
        0.9
      );
    });
  };

  return {
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
  };
}
