import { defineAction, fail } from "@agent-native/core/action";
import { getRequestUserEmail } from "@agent-native/core/server/request-context";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema } from "../server/db.js";
import {
  protectedProofSchema,
  restrictedDocumentSchema,
  sanitizeHttpUrl,
  serializeProtectedProofs,
  serializeRestrictedDocuments,
} from "../server/lib/campaign-protected.js";
import { getOrCreateUserProfile, isAdmin } from "../server/lib/auth-roles.js";

const CAMPAIGN_CATEGORIES = [
  "Student Projects",
  "College Events",
  "Hackathon Projects",
  "College Startups",
] as const;

function sanitizeText(str: string | null | undefined): string {
  if (!str) return "";
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function validateSecureUrl(rawUrl: string | null | undefined): string | null {
  if (!rawUrl || !rawUrl.trim()) return null;
  const trimmed = rawUrl.trim();
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return null;
    }
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === "169.254.169.254" ||
      hostname === "metadata.google.internal" ||
      hostname === "instance-data"
    ) {
      return null;
    }
    return trimmed;
  } catch {
    return null;
  }
}

const milestoneInputSchema = z.object({
  title: z.string().trim().min(3).max(160),
  description: z.string().trim().min(5).max(1000),
  proposedBudget: z.number().int().positive().max(1_000_000_000),
  deadline: z.string().trim().max(40).optional(),
});

export default defineAction({
  description:
    "Create a new crowdfunding campaign with milestones, coordinator details, and verification documents.",
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
    galleryImages: z
      .array(z.string().url())
      .max(6)
      .optional()
      .describe("Optional campaign gallery images"),
    currency: z
      .string()
      .trim()
      .max(10)
      .default("INR")
      .describe("Campaign base currency (e.g. INR, USD, EUR)"),
    targetAmount: z
      .number()
      .int()
      .positive()
      .max(1_000_000_000)
      .optional()
      .describe("Fundraising target amount in base currency"),
    deadline: z
      .string()
      .trim()
      .max(40)
      .optional()
      .describe("Optional campaign deadline date"),
    status: z
      .enum(["draft", "active", "submitted"])
      .default("draft")
      .optional()
      .describe("Campaign initial status"),
    submitForReview: z
      .boolean()
      .default(false)
      .optional()
      .describe("If true, submits campaign into Document Verification / Review queue"),
    ownerName: z
      .string()
      .trim()
      .max(120)
      .optional()
      .describe("Optional coordinator display name"),
    ownerContact: z
      .string()
      .trim()
      .max(300)
      .optional()
      .describe("Protected coordinator contact details for verified supporters"),
    coordinatorInstitution: z
      .string()
      .trim()
      .max(160)
      .optional()
      .describe("College, university, or institute name"),
    coordinatorIdNumber: z
      .string()
      .trim()
      .max(80)
      .optional()
      .describe("Student or faculty ID number (securely protected)"),
    teamMembers: z
      .array(
        z.object({
          email: z.string().email(),
          name: z.string().trim().max(120).optional(),
          role: z.enum(["coordinator", "co_organizer", "member"]).default("member"),
        }),
      )
      .max(2) // Creator + max 2 additional members = max 3 members per campaign
      .optional()
      .describe("Optional co-organizers (maximum 3 total members per campaign)"),
    milestones: z
      .array(milestoneInputSchema)
      .max(10)
      .optional()
      .describe("Optional project milestones and proposed budgets"),
    restrictedDocuments: z
      .array(restrictedDocumentSchema)
      .max(10)
      .optional()
      .describe("Optional verification and project documents"),
    protectedProofs: z
      .array(protectedProofSchema)
      .max(10)
      .optional()
      .describe("Optional protected milestone proofs"),
  }),
  outputSchema: z.object({
    id: z.string(),
    title: z.string(),
    status: z.string(),
    approvalStatus: z.string(),
  }),
  run: async (input) => {
    const rawOwnerEmail = getRequestUserEmail();
    if (!rawOwnerEmail) {
      fail("Authentication is required to create a campaign.", {
        statusCode: 401,
      });
    }
    const ownerEmail = rawOwnerEmail.trim().toLowerCase();

    // Verify user profile exists
    const userProfile = await getOrCreateUserProfile(ownerEmail);
    const db = await getDb();

    // Security Gate 1: Anti-abuse rate limiting / spam prevention
    const recent = await db
      .select({ createdAt: schema.campaigns.createdAt })
      .from(schema.campaigns)
      .where(eq(schema.campaigns.ownerEmail, ownerEmail))
      .orderBy(desc(schema.campaigns.createdAt))
      .limit(1);

    if (recent.length > 0 && recent[0]?.createdAt) {
      const lastCreatedTime = new Date(recent[0].createdAt).getTime();
      if (Date.now() - lastCreatedTime < 3000) {
        fail("Please wait a moment before creating another campaign.", {
          statusCode: 429,
        });
      }
    }

    // Security Gate 2: Input sanitization & XSS neutralization
    const safeTitle = sanitizeText(input.title);
    const safeDescription = sanitizeText(input.description);
    const safeCountry = sanitizeText(input.country);
    const safeOwnerName = sanitizeText(input.ownerName) || [userProfile.firstName, userProfile.lastName].filter(Boolean).join(" ") || null;
    
    // Security Gate 3: Credential protection for coordinator credentials
    const credentialParts: string[] = [];
    if (input.ownerContact?.trim()) {
      credentialParts.push(sanitizeText(input.ownerContact));
    }
    if (input.coordinatorInstitution?.trim()) {
      credentialParts.push(`Institution: ${sanitizeText(input.coordinatorInstitution)}`);
    }
    if (input.coordinatorIdNumber?.trim()) {
      // Securely store ID in protected credentials field
      credentialParts.push(`Verified ID: ${sanitizeText(input.coordinatorIdNumber)}`);
    }
    const safeOwnerContact = credentialParts.length > 0 ? credentialParts.join(" | ") : null;

    // Security Gate 4: URL and SSRF validation
    const safeImageUrl = validateSecureUrl(input.imageUrl);
    if (input.imageUrl?.trim() && !safeImageUrl) {
      fail("Cover image URL must be a valid public HTTP or HTTPS web address.", {
        statusCode: 400,
      });
    }

    const campaignId = `cmp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date().toISOString();

    const isAdminUser = await isAdmin(ownerEmail);
    // When published directly or created by admin, campaign is active so it displays immediately on explore!
    const isPublishing = input.status === "active" || isAdminUser;
    const finalStatus = isPublishing ? "active" : (input.submitForReview ? "submitted" : (input.status || "draft"));
    const finalApproval = isPublishing ? "approved" : (finalStatus === "submitted" ? "submitted" : "draft");

    // 1. Insert Campaign
    await db.insert(schema.campaigns).values({
      id: campaignId,
      title: safeTitle,
      description: safeDescription,
      imageUrl: safeImageUrl,
      galleryImages: input.galleryImages ? JSON.stringify(input.galleryImages) : null,
      category: input.category,
      country: safeCountry,
      currency: input.currency || "INR",
      baseCurrency: input.currency || "INR",
      targetAmount: input.targetAmount,
      collectedAmount: 0,
      donorCount: 0,
      deadline: input.deadline?.trim() || null,
      status: finalStatus,
      approvalStatus: finalApproval,
      coordinatorId: userProfile.id,
      ownerEmail,
      ownerName: safeOwnerName,
      ownerContact: safeOwnerContact,
      restrictedDocuments: serializeRestrictedDocuments(input.restrictedDocuments),
      protectedProofs: serializeProtectedProofs(input.protectedProofs),
      createdAt: now,
      updatedAt: now,
    });

    // 2. Insert Coordinator as Primary Campaign Member
    await db.insert(schema.campaignMembers).values({
      id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      campaignId,
      userId: userProfile.id,
      userEmail: ownerEmail,
      userName: safeOwnerName || ownerEmail,
      role: "coordinator",
      permissions: JSON.stringify(["manage_campaign", "manage_finances", "post_updates"]),
      createdAt: now,
    });

    // 3. Insert Additional Team Members (Enforce strict limit: max 3 members per campaign)
    if (input.teamMembers && input.teamMembers.length > 0) {
      const addedEmails = new Set<string>([ownerEmail]);
      for (const member of input.teamMembers) {
        const memberEmail = member.email.trim().toLowerCase();
        if (addedEmails.has(memberEmail)) continue;
        if (addedEmails.size >= 3) break; // Hard platform limit: 3 members

        addedEmails.add(memberEmail);
        await db.insert(schema.campaignMembers).values({
          id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          campaignId,
          userId: null,
          userEmail: memberEmail,
          userName: member.name?.trim() || memberEmail,
          role: member.role || "member",
          permissions: JSON.stringify(["post_updates", "view_documents"]),
          createdAt: now,
        });
      }
    }

    // 4. Insert Milestones if provided
    if (input.milestones && input.milestones.length > 0) {
      for (const m of input.milestones) {
        await db.insert(schema.campaignMilestones).values({
          id: `mls_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          campaignId,
          title: sanitizeText(m.title),
          description: sanitizeText(m.description),
          proposedBudget: m.proposedBudget,
          deadline: m.deadline?.trim() || null,
          completionStatus: "pending",
          approvalStatus: "pending",
          supportingDocuments: null,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    // 5. Create Immutable Audit Log Entry
    await db.insert(schema.auditLogs).values({
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      actorEmail: ownerEmail,
      actionType: "CAMPAIGN_CREATED",
      entityType: "campaign",
      entityId: campaignId,
      details: JSON.stringify({
        title: safeTitle,
        status: finalStatus,
        targetAmount: input.targetAmount,
        currency: input.currency || "INR",
        securityVerified: true,
      }),
      ipAddress: null,
      createdAt: now,
    });

    return {
      id: campaignId,
      title: safeTitle,
      status: finalStatus,
      approvalStatus: finalApproval,
    };
  },
});
