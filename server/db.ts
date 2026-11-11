import { createGetDb } from "@agent-native/core/db";
import { registerIdentityColumns } from "@agent-native/core/org";
import * as schema from "../drizzle/schema";

registerIdentityColumns([
  {
    table: "campaigns",
    column: "owner_email",
    emailChange: "rekey",
    offboard: "transfer",
    reason: "Campaign ownership transfers when a creator account is offboarded.",
  },
  {
    table: "campaign_bookmarks",
    column: "user_email",
    emailChange: "rekey",
    offboard: "delete",
    reason: "Saved campaign bookmarks belong to the user and are removed on offboarding.",
  },
  {
    table: "campaign_comments",
    column: "author_email",
    emailChange: "rekey",
    offboard: "retain",
    reason: "Campaign comments are retained for audit and discussion continuity.",
  },
  {
    table: "campaign_chat_messages",
    column: "sender_email",
    emailChange: "rekey",
    offboard: "retain",
    reason: "Supporter group chat messages are retained for conversation continuity.",
  },
]);

export const getDb = createGetDb(schema);
export { schema };
