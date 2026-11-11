import { fail } from "@agent-native/core/action";
import { eq } from "drizzle-orm";
import { PUBLIC_CAMPAIGN_STATUSES } from "../../actions/list-campaigns.js";
import { getDb, schema } from "../db.js";

export async function requireVisibleCampaign(
  campaignId: string,
  userEmail: string,
) {
  const [campaign] = await getDb()
    .select({
      id: schema.campaigns.id,
      status: schema.campaigns.status,
      ownerEmail: schema.campaigns.ownerEmail,
      ownerName: schema.campaigns.ownerName,
      ownerContact: schema.campaigns.ownerContact,
      restrictedDocuments: schema.campaigns.restrictedDocuments,
      protectedProofs: schema.campaigns.protectedProofs,
    })
    .from(schema.campaigns)
    .where(eq(schema.campaigns.id, campaignId))
    .limit(1);

  const isOwner = campaign?.ownerEmail === userEmail;
  const isPublic =
    campaign != null &&
    (PUBLIC_CAMPAIGN_STATUSES as readonly string[]).includes(campaign.status);

  if (!campaign || (!isPublic && !isOwner)) {
    fail("Campaign not found.", { statusCode: 404 });
  }

  return { campaign, isOwner };
}
