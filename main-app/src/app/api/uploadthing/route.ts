import { uploadRouter } from "@/lib/apis/uploadthing/core";
import { createRouteHandler } from "uploadthing/next";

export const { GET, POST } = createRouteHandler({
  router: uploadRouter,
});
