import type { OurFileRouter } from "@/lib/apis/uploadthing/core";
import { generateReactHelpers } from "@uploadthing/react";

// Export UploadThing components and hooks
export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();
