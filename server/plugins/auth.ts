import { createAuthPlugin } from "@agent-native/core/server";

export default createAuthPlugin({
  rootAuth: false,
  workspaceAppPublicPaths: ["/", "/home", "/explore", "/campaigns", "/auth"],
  publicPaths: [
    "/_agent-native/actions/list-campaigns",
    "/_agent-native/actions/get-campaign",
    "/_agent-native/actions/get-platform-stats",
    "/_agent-native/actions/get-session",
  ],
});
