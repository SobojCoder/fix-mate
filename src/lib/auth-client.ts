import { createAuthClient } from "better-auth/react"
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins"
import { auth } from "./auth"

// `inferAdditionalFields<typeof auth>` pulls in the server schema so fields
// declared in `lib/auth.ts` (e.g. `user.additionalFields.role`) are typed here.
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [inferAdditionalFields<typeof auth>()],
})