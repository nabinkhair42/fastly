import { generateReactHelpers } from '@uploadthing/react';
import type { OurFileRouter } from './uploadthing/core';

// Export UploadThing components and hooks
export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();
