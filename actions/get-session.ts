import { defineAction } from "@agent-native/core/action";
import { getRequestUserEmail } from "@agent-native/core/server/request-context";
import { z } from "zod";
import { getOrCreateUserProfile } from "../server/lib/auth-roles";

export default defineAction({
  description: "Return the current authenticated user's session status and profile.",
  schema: z.object({}),
  outputSchema: z.object({
    authenticated: z.boolean(),
    email: z.string().nullable(),
    role: z.string().nullable(),
    name: z.string().nullable(),
    profileImageUrl: z.string().nullable(),
    verificationStatus: z.string().nullable(),
  }),
  http: { method: "GET" },
  readOnly: true,
  requiresAuth: false,
  persistInBrowser: false,
  agentTool: false,
  run: async () => {
    const rawEmail = getRequestUserEmail();
    const email = rawEmail && rawEmail.trim().length > 0 ? rawEmail.trim().toLowerCase() : null;

    if (!email) {
      return {
        authenticated: false,
        email: null,
        role: null,
        name: null,
        profileImageUrl: null,
        verificationStatus: null,
      };
    }

    try {
      const profile = await getOrCreateUserProfile(email);
      const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || null;
      return {
        authenticated: true,
        email: profile.email,
        role: profile.role,
        name: fullName,
        profileImageUrl: profile.profileImageUrl,
        verificationStatus: profile.verificationStatus,
      };
    } catch {
      return {
        authenticated: true,
        email,
        role: "user",
        name: null,
        profileImageUrl: null,
        verificationStatus: "unverified",
      };
    }
  },
});
