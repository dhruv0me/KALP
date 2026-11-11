import { defineAction, fail } from "@agent-native/core/action";
import { getRequestUserEmail } from "@agent-native/core/server/request-context";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema } from "../server/db.js";
import {
  protectedProofSchema,
  restrictedDocumentSchema,
  sanitizeHttpUrl,
  serializeProtectedProofs,
  serializeRestrictedDocuments,
} from "../server/lib/campaign-protected.js";

export default defineAction({
  description:
    "Update an existing campaign owned by the authenticated user.",
  schema: z.object({
    id: z.string().trim().min(1).describe("Campaign ID"),
    title: z.string().trim().min(3).max(160).optional(),
    description: z.string().trim().min(10).max(5000).optional(),
    category: z
      .enum([
        "Student Projects",
        "College Events",
        "Hackathon Projects",
        "College Startups",
      ])
      .optional(),
    country: z.string().trim().min(2).max(100).optional(),
    imageUrl: z.string().nullable().optional(),
    currency: z.string().trim().max(10).nullable().optional(),
    targetAmount: z.number().int().positive().max(1_000_000_000).nullable().optional(),
    deadline: z.string().trim().max(40).nullable().optional(),
    status: z.enum(["draft", "active", "completed"]).optional(),
    ownerName: z.string().trim().max(120).nullable().optional(),
    ownerContact: z.string().trim().max(300).nullable().optional(),
    restrictedDocuments: z.array(restrictedDocumentSchema).max(10).optional(),
    protectedProofs: z.array(protectedProofSchema).max(10).optional(),
  }),
  outputSchema: z.object({
    id: z.string(),
    status: z.string(),
  }),
  run: async (input) => {
    const ownerEmail = getRequestUserEmail();
    if (!ownerEmail) {
      fail("Authentication is required.", { statusCode: 401 });
    }

    const db = getDb();
    const [existing] = await db
      .select({
        id: schema.campaigns.id,
        ownerEmail: schema.campaigns.ownerEmail,
      })
      .from(schema.campaigns)
      .where(eq(schema.campaigns.id, input.id))
      .limit(1);

    if (!existing) {
      fail("Campaign not found.", { statusCode: 404 });
    }
    if (existing.ownerEmail !== ownerEmail) {
      fail("Only the campaign owner can update this campaign.", {
        statusCode: 403,
      });
    }

    const patch: Partial<typeof schema.campaigns.$inferInsert> = {};
    if (input.title !== undefined) patch.title = input.title;
    if (input.description !== undefined) patch.description = input.description;
    if (input.category !== undefined) patch.category = input.category;
    if (input.country !== undefined) patch.country = input.country;
    if (input.imageUrl !== undefined) {
      if (input.imageUrl === null || !input.imageUrl.trim()) {
        patch.imageUrl = null;
      } else {
        const safeUrl = sanitizeHttpUrl(input.imageUrl);
        if (!safeUrl) {
          fail("Cover image URL must start with http:// or https://.", {
            statusCode: 400,
          });
        }
        patch.imageUrl = safeUrl;
      }
    }
    if (input.currency !== undefined) {
      patch.currency = input.currency?.trim().toUpperCase() || null;
    }
    if (input.targetAmount !== undefined) {
      patch.targetAmount = input.targetAmount;
    }
    if (input.deadline !== undefined) {
      patch.deadline = input.deadline?.trim() || null;
    }
    if (input.status !== undefined) patch.status = input.status;
    if (input.ownerName !== undefined) {
      patch.ownerName = input.ownerName?.trim() || null;
    }
    if (input.ownerContact !== undefined) {
      patch.ownerContact = input.ownerContact?.trim() || null;
    }
    if (input.restrictedDocuments !== undefined) {
      patch.restrictedDocuments = serializeRestrictedDocuments(
        input.restrictedDocuments,
      );
    }
    if (input.protectedProofs !== undefined) {
      patch.protectedProofs = serializeProtectedProofs(input.protectedProofs);
    }

    if (Object.keys(patch).length === 0) {
      const [current] = await db
        .select({ id: schema.campaigns.id, status: schema.campaigns.status })
        .from(schema.campaigns)
        .where(eq(schema.campaigns.id, input.id))
        .limit(1);
      return current ?? { id: input.id, status: "active" };
    }

    const [updated] = await db
      .update(schema.campaigns)
      .set(patch)
      .where(
        and(
          eq(schema.campaigns.id, input.id),
          eq(schema.campaigns.ownerEmail, ownerEmail),
        ),
      )
      .returning({
        id: schema.campaigns.id,
        status: schema.campaigns.status,
      });

    if (!updated) {
      fail("Unable to update campaign.", { statusCode: 500 });
    }
    return updated;
  },
});
