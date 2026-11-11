import { defineAction } from "@agent-native/core/action";
import { getRequestUserEmail } from "@agent-native/core/server/request-context";
import { z } from "zod";

export default defineAction({
  description: "Return the current authenticated user's session status.",
  schema: z.object({}),
  outputSchema: z.object({
    authenticated: z.boolean(),
    email: z.string().nullable(),
  }),
  http: { method: "GET" },
  readOnly: true,
  requiresAuth: false,
  persistInBrowser: false,
  agentTool: false,
  run: async () => {
    const email = getRequestUserEmail() ?? null;
    return {
      authenticated: Boolean(email && email.trim().length > 0),
      email: email && email.trim().length > 0 ? email : null,
    };
  },
});

