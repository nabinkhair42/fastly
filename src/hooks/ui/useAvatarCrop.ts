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
  const imageRef = useRef<HTMLImageElement>(null);

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

    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;

    const centerX = image.naturalWidth / 2;
    const centerY = image.naturalHeight / 2;

    ctx.save();

    ctx.translate(-cropX, -cropY);
    ctx.translate(centerX, centerY);
    ctx.translate(-centerX, -centerY);
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight
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
    imageRef,
    getCroppedImageBlob,
  };
}
