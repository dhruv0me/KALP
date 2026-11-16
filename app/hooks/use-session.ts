import { useActionQuery } from "@agent-native/core/client/hooks";

export interface SessionState {
  authenticated: boolean;
  email: string | null;
  role?: string | null;
  name?: string | null;
  profileImageUrl?: string | null;
  verificationStatus?: string | null;
}

export function useSession() {
  const query = useActionQuery("get-session", {});
  const data = query.data as SessionState | undefined;
  return {
    authenticated: data?.authenticated ?? false,
    email: data?.email ?? null,
    role: data?.role ?? null,
    name: data?.name ?? null,
    profileImageUrl: data?.profileImageUrl ?? null,
    verificationStatus: data?.verificationStatus ?? null,
    isAdmin: data?.role === "admin" || data?.role === "super_admin",
    isLoading: query.isLoading,
  };
}
