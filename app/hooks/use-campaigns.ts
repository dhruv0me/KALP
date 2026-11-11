import { useActionQuery } from "@agent-native/core/client/hooks";
import type { Campaign, PlatformStatsData } from "@/lib/campaigns";

export function useCampaigns() {
  const query = useActionQuery("list-campaigns", {});
  return {
    campaigns: (query.data ?? []) as Campaign[],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export function useCampaign(id: string | undefined) {
  const query = useActionQuery("get-campaign", { id: id ?? "" });
  const result = query.data as { campaign?: Campaign | null } | undefined;
  return {
    campaign: result?.campaign ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export function usePlatformStats() {
  const query = useActionQuery("get-platform-stats", {});
  return {
    stats: (query.data ?? null) as PlatformStatsData | null,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

