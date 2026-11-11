import { useActionQuery } from "@agent-native/core/client/hooks";

export interface SessionState {
  authenticated: boolean;
  email: string | null;
}

export function useSession() {
  const query = useActionQuery("get-session", {});
  const data = query.data as SessionState | undefined;
  return {
    authenticated: data?.authenticated ?? false,
    email: data?.email ?? null,
    isLoading: query.isLoading,
  };
}

