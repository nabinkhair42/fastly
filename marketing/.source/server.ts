// @ts-nocheck
import * as __fd_glob_16 from "../content/docs/getting-started/installation.mdx?collection=docs"
import * as __fd_glob_15 from "../content/docs/getting-started/environment-setup.mdx?collection=docs"
import * as __fd_glob_14 from "../content/docs/api-reference/user-endpoints.mdx?collection=docs"
import * as __fd_glob_13 from "../content/docs/api-reference/session-endpoints.mdx?collection=docs"
import * as __fd_glob_12 from "../content/docs/api-reference/index.mdx?collection=docs"
import * as __fd_glob_11 from "../content/docs/api-reference/auth-endpoints.mdx?collection=docs"
import * as __fd_glob_10 from "../content/docs/authentication/oauth-google.mdx?collection=docs"
import * as __fd_glob_9 from "../content/docs/authentication/oauth-github.mdx?collection=docs"
import * as __fd_glob_8 from "../content/docs/authentication/index.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/authentication/email-verification.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/authentication/email-password.mdx?collection=docs"
import * as __fd_glob_5 from "../content/docs/index.mdx?collection=docs"
import * as __fd_glob_4 from "../content/docs/deployment.mdx?collection=docs"
import * as __fd_glob_3 from "../content/docs/database.mdx?collection=docs"
import * as __fd_glob_2 from "../content/docs/customization.mdx?collection=docs"
import { default as __fd_glob_1 } from "../content/docs/getting-started/meta.json?collection=docs"
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/docs", {"meta.json": __fd_glob_0, "getting-started/meta.json": __fd_glob_1, }, {"customization.mdx": __fd_glob_2, "database.mdx": __fd_glob_3, "deployment.mdx": __fd_glob_4, "index.mdx": __fd_glob_5, "authentication/email-password.mdx": __fd_glob_6, "authentication/email-verification.mdx": __fd_glob_7, "authentication/index.mdx": __fd_glob_8, "authentication/oauth-github.mdx": __fd_glob_9, "authentication/oauth-google.mdx": __fd_glob_10, "api-reference/auth-endpoints.mdx": __fd_glob_11, "api-reference/index.mdx": __fd_glob_12, "api-reference/session-endpoints.mdx": __fd_glob_13, "api-reference/user-endpoints.mdx": __fd_glob_14, "getting-started/environment-setup.mdx": __fd_glob_15, "getting-started/installation.mdx": __fd_glob_16, });