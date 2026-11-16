import { createGetDb } from "@agent-native/core/db";
import { registerIdentityColumns } from "@agent-native/core/org";
import * as schema from "../drizzle/schema";

registerIdentityColumns([
  {
    table: "kalp_users",
    column: "email",
    emailChange: "rekey",
    offboard: "delete",
    reason: "Primary account record for users in the platform.",
  },
  {
    table: "campaigns",
    column: "owner_email",
    emailChange: "rekey",
    offboard: "transfer",
    reason: "Campaign ownership transfers when a creator account is offboarded.",
  },
  {
    table: "campaign_members",
    column: "user_email",
    emailChange: "rekey",
    offboard: "delete",
    reason: "Campaign member team membership.",
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
  {
    table: "donations",
    column: "donor_email",
    emailChange: "rekey",
    offboard: "retain",
    reason: "Donation financial records are permanently retained for campaign audits.",
  },
  {
    table: "campaign_expenses",
    column: "submitted_by_email",
    emailChange: "rekey",
    offboard: "retain",
    reason: "Expense claims and receipts are retained for financial auditability.",
  },
  {
    table: "campaign_updates",
    column: "author_email",
    emailChange: "rekey",
    offboard: "retain",
    reason: "Public campaign updates are retained for project timeline history.",
  },
  {
    table: "campaign_documents",
    column: "uploader_email",
    emailChange: "rekey",
    offboard: "retain",
    reason: "Official campaign verification documents are retained for legal audit.",
  },
  {
    table: "complaints",
    column: "reporter_email",
    emailChange: "rekey",
    offboard: "retain",
    reason: "Complaint records are retained for regulatory and dispute audits.",
  },
  {
    table: "refund_requests",
    column: "donor_email",
    emailChange: "rekey",
    offboard: "retain",
    reason: "Refund requests are retained for transaction accounting.",
  },
  {
    table: "campaign_notifications",
    column: "user_email",
    emailChange: "rekey",
    offboard: "delete",
    reason: "User notifications are deleted on offboarding.",
  },
  {
    table: "campaign_reviews",
    column: "reviewer_email",
    emailChange: "rekey",
    offboard: "retain",
    reason: "Campaign reviews and ratings are retained.",
  },
  {
    table: "audit_logs",
    column: "actor_email",
    emailChange: "rekey",
    offboard: "retain",
    reason: "System and administrative audit logs are immutable.",
  },
]);

export const getDb = createGetDb(schema);
export { schema };
