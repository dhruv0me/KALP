import { eq } from "drizzle-orm";
import { getDb, schema } from "../db";

export type UserRole = "user" | "coordinator" | "admin" | "super_admin";

export interface UserProfile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  country: string | null;
  preferredLanguage: string;
  accountStatus: string;
  verificationStatus: string;
  role: UserRole;
  createdAt: string;
}

/**
 * Get or initialize user profile from database.
 * If user does not exist in `kalp_users`, initializes their profile with role 'user'.
 * Standard users can never self-assign admin roles.
 */
export async function getOrCreateUserProfile(email: string): Promise<UserProfile> {
  const normalizedEmail = email.trim().toLowerCase();
  const db = await getDb();

  const existing = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, normalizedEmail))
    .limit(1);

  if (existing.length > 0 && existing[0]) {
    const u = existing[0];
    return {
      id: u.id,
      email: u.email,
      firstName: u.firstName ?? null,
      lastName: u.lastName ?? null,
      profileImageUrl: u.profileImageUrl ?? null,
      country: u.country ?? null,
      preferredLanguage: u.preferredLanguage ?? "en",
      accountStatus: u.accountStatus,
      verificationStatus: u.verificationStatus,
      role: (u.role as UserRole) || "user",
      createdAt: u.createdAt,
    };
  }

  // Create new user profile with default 'user' role
  const newId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const now = new Date().toISOString();
  const newUser = {
    id: newId,
    email: normalizedEmail,
    firstName: null,
    lastName: null,
    profileImageUrl: null,
    country: null,
    preferredLanguage: "en",
    accountStatus: "active",
    verificationStatus: "unverified",
    role: "user" as const, // Never allow self-assigned admin
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(schema.users).values(newUser);

  return {
    id: newUser.id,
    email: newUser.email,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    profileImageUrl: newUser.profileImageUrl,
    country: newUser.country,
    preferredLanguage: newUser.preferredLanguage,
    accountStatus: newUser.accountStatus,
    verificationStatus: newUser.verificationStatus,
    role: newUser.role,
    createdAt: newUser.createdAt,
  };
}

/**
 * Returns true if the user has an admin or super_admin role.
 */
export async function isAdmin(email: string | null | undefined): Promise<boolean> {
  if (!email) return false;
  const user = await getOrCreateUserProfile(email);
  return user.role === "admin" || user.role === "super_admin";
}

/**
 * Throws an error if the user is not an administrator.
 */
export async function assertAdmin(email: string | null | undefined): Promise<UserProfile> {
  if (!email) {
    throw new Error("Authentication required. Please sign in.");
  }
  const user = await getOrCreateUserProfile(email);
  if (user.role !== "admin" && user.role !== "super_admin") {
    throw new Error("Unauthorized. Administrative privileges required.");
  }
  return user;
}

/**
 * Throws an error if user is suspended or banned.
 */
export async function assertActiveUser(email: string | null | undefined): Promise<UserProfile> {
  if (!email) {
    throw new Error("Authentication required. Please sign in.");
  }
  const user = await getOrCreateUserProfile(email);
  if (user.accountStatus !== "active") {
    throw new Error(`Your account status is ${user.accountStatus}. Access denied.`);
  }
  return user;
}

