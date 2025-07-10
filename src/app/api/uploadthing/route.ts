import { uploadRouter } from '@/lib/uploadthing/core';
import { createRouteHandler } from 'uploadthing/next';

export const { GET, POST } = createRouteHandler({
  router: uploadRouter,
});
