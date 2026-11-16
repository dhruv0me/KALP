import { defineAction, fail } from "@agent-native/core/action";
import { getRequestUserEmail } from "@agent-native/core/server/request-context";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema } from "../server/db.js";
import { getAndRecordExchangeRate } from "../server/lib/exchange-rates.js";

const PRIVACY_PREFERENCES = ["public", "anonymous", "name_only"] as const;

export default defineAction({
  description:
    "Initiate a donation for an active campaign, calculating real currency conversion and creating an initial pending donation record.",
  schema: z.object({
    campaignId: z.string().trim().min(1).describe("The campaign ID"),
    amount: z
      .number()
      .int()
      .positive()
      .max(10_000_000)
      .describe("Donation amount in original currency"),
    currency: z
      .string()
      .trim()
      .max(10)
      .default("INR")
      .describe("Donation currency code (e.g. INR, USD, EUR, GBP)"),
    privacyPreference: z
      .enum(PRIVACY_PREFERENCES)
      .default("public")
      .describe("Donor display privacy preference"),
    donorName: z
      .string()
      .trim()
      .max(120)
      .optional()
      .describe("Optional donor name to display"),
  }),
  outputSchema: z.object({
    donationId: z.string(),
    transactionReference: z.string(),
    campaignId: z.string(),
    originalAmount: z.number(),
    originalCurrency: z.string(),
    convertedAmount: z.number(),
    baseCurrency: z.string(),
    exchangeRate: z.string(),
    paymentStatus: z.string(),
  }),
  run: async (input) => {
    const db = await getDb();
    const rows = await db
      .select()
      .from(schema.campaigns)
      .where(eq(schema.campaigns.id, input.campaignId))
      .limit(1);

    if (rows.length === 0 || !rows[0]) {
      fail("Campaign not found.", { statusCode: 404 });
    }
    const campaign = rows[0];

    // Security Gate: Only active campaigns can accept contributions
    if (campaign.status !== "active") {
      fail(
        `Campaign is currently ${campaign.status}. Contributions are only accepted for active, approved campaigns.`,
        { statusCode: 400 },
      );
    }

    const donorEmail = getRequestUserEmail()?.trim().toLowerCase() || null;
    const baseCurrency = (campaign.baseCurrency || campaign.currency || "INR").toUpperCase();
    const originalCurrency = input.currency.toUpperCase();

    // Calculate conversion rate & record historical exchange rate
    const { rate } = await getAndRecordExchangeRate(originalCurrency, baseCurrency);
    const convertedAmount = Math.max(1, Math.round(input.amount * rate));

    const donationId = `don_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const transactionReference = `txn_${Date.now()}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const now = new Date().toISOString();

    // Insert pending donation record (never fake or simulate success)
    await db.insert(schema.donations).values({
      id: donationId,
      donorId: null,
      donorEmail,
      donorName: input.donorName?.trim() || null,
      campaignId: input.campaignId,
      originalAmount: input.amount,
      originalCurrency,
      convertedAmount,
      baseCurrency,
      exchangeRateAtDonation: rate.toString(),
      paymentStatus: "pending",
      transactionReference,
      gatewayReference: null,
      privacyPreference: input.privacyPreference,
      createdAt: now,
    });

    // Record audit log
    await db.insert(schema.auditLogs).values({
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      actorEmail: donorEmail || "guest_donor",
      actionType: "DONATION_INITIATED",
      entityType: "donation",
      entityId: donationId,
      details: JSON.stringify({
        campaignId: input.campaignId,
        originalAmount: input.amount,
        originalCurrency,
        convertedAmount,
        baseCurrency,
        rate,
        transactionReference,
      }),
      ipAddress: null,
      createdAt: now,
    });

    return {
      donationId,
      transactionReference,
      campaignId: input.campaignId,
      originalAmount: input.amount,
      originalCurrency,
      convertedAmount,
      baseCurrency,
      exchangeRate: rate.toString(),
      paymentStatus: "pending",
    };
  },
});

