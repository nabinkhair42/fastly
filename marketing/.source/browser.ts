// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"customization.mdx": () => import("../content/docs/customization.mdx?collection=docs"), "database.mdx": () => import("../content/docs/database.mdx?collection=docs"), "deployment.mdx": () => import("../content/docs/deployment.mdx?collection=docs"), "index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "api-reference/auth-endpoints.mdx": () => import("../content/docs/api-reference/auth-endpoints.mdx?collection=docs"), "api-reference/index.mdx": () => import("../content/docs/api-reference/index.mdx?collection=docs"), "api-reference/session-endpoints.mdx": () => import("../content/docs/api-reference/session-endpoints.mdx?collection=docs"), "api-reference/user-endpoints.mdx": () => import("../content/docs/api-reference/user-endpoints.mdx?collection=docs"), "authentication/email-password.mdx": () => import("../content/docs/authentication/email-password.mdx?collection=docs"), "authentication/email-verification.mdx": () => import("../content/docs/authentication/email-verification.mdx?collection=docs"), "authentication/index.mdx": () => import("../content/docs/authentication/index.mdx?collection=docs"), "authentication/oauth-github.mdx": () => import("../content/docs/authentication/oauth-github.mdx?collection=docs"), "authentication/oauth-google.mdx": () => import("../content/docs/authentication/oauth-google.mdx?collection=docs"), "getting-started/environment-setup.mdx": () => import("../content/docs/getting-started/environment-setup.mdx?collection=docs"), "getting-started/installation.mdx": () => import("../content/docs/getting-started/installation.mdx?collection=docs"), }),
};
export default browserCollections;