import { defineAction, fail } from "@agent-native/core/action";
import { getRequestUserEmail } from "@agent-native/core/server/request-context";
import { z } from "zod";
import { getDb, schema } from "../server/db.js";
import {
  protectedProofSchema,
  restrictedDocumentSchema,
  sanitizeHttpUrl,
  serializeProtectedProofs,
  serializeRestrictedDocuments,
} from "../server/lib/campaign-protected.js";

const CAMPAIGN_CATEGORIES = [
  "Student Projects",
  "College Events",
  "Hackathon Projects",
  "College Startups",
] as const;

export default defineAction({
  description:
    "Create a new crowdfunding campaign owned by the authenticated user.",
  schema: z.object({
    title: z.string().trim().min(3).max(160).describe("Campaign title"),
    description: z
      .string()
      .trim()
      .min(10)
      .max(5000)
      .describe("Campaign description"),
    category: z.enum(CAMPAIGN_CATEGORIES).describe("Campaign category"),
    country: z.string().trim().min(2).max(100).describe("Country name"),
    imageUrl: z
      .string()
      .optional()
      .describe("Optional https cover image URL"),
    currency: z
      .string()
      .trim()
      .max(10)
      .optional()
      .describe("Optional currency code such as USD or INR"),
    targetAmount: z
      .number()
      .int()
      .positive()
      .max(1_000_000_000)
      .optional()
      .describe("Optional fundraising target amount"),
    deadline: z
      .string()
      .trim()
      .max(40)
      .optional()
      .describe("Optional campaign deadline date"),
    status: z
      .enum(["draft", "active"])
      .default("active")
      .describe("Campaign status: active or draft"),
    ownerName: z
      .string()
      .trim()
      .max(120)
      .optional()
      .describe("Optional creator display name"),
    ownerContact: z
      .string()
      .trim()
      .max(300)
      .optional()
      .describe("Protected owner contact instructions for signed-in users"),
    restrictedDocuments: z
      .array(restrictedDocumentSchema)
      .max(10)
      .optional()
      .describe("Optional restricted documents visible to signed-in users"),
    protectedProofs: z
      .array(protectedProofSchema)
      .max(10)
      .optional()
      .describe("Optional protected milestone proofs visible to signed-in users"),
  }),
  outputSchema: z.object({
    id: z.string(),
    title: z.string(),
    status: z.string(),
  }),
  run: async (input) => {
    const ownerEmail = getRequestUserEmail();
    if (!ownerEmail) {
      fail("Authentication is required to create a campaign.", {
        statusCode: 401,
      });
    }

    const safeImageUrl = sanitizeHttpUrl(input.imageUrl);
    if (input.imageUrl?.trim() && !safeImageUrl) {
      fail("Cover image URL must start with http:// or https://.", {
        statusCode: 400,
      });
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const normalizedCurrency =
      input.currency?.trim().toUpperCase() ||
      (input.targetAmount != null ? "USD" : null);

    const [created] = await getDb()
      .insert(schema.campaigns)
      .values({
        id,
        title: input.title,
        description: input.description,
        imageUrl: safeImageUrl,
        country: input.country,
        category: input.category,
        currency: normalizedCurrency,
        targetAmount: input.targetAmount ?? null,
        collectedAmount: null,
        donorCount: null,
        deadline: input.deadline?.trim() || null,
        status: input.status,
        ownerEmail,
        ownerName: input.ownerName?.trim() || null,
        ownerContact: input.ownerContact?.trim() || null,
        restrictedDocuments: serializeRestrictedDocuments(
          input.restrictedDocuments,
        ),
        protectedProofs: serializeProtectedProofs(input.protectedProofs),
        createdAt: now,
      })
      .returning({
        id: schema.campaigns.id,
        title: schema.campaigns.title,
        status: schema.campaigns.status,
      });

    if (!created) {
      fail("Unable to save campaign.", { statusCode: 500 });
    }
    return created;
  },
});
