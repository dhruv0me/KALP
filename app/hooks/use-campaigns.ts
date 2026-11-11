import {
  useActionMutation,
  useActionQuery,
} from "@agent-native/core/client/hooks";
import type {
  Campaign,
  CampaignMemberData,
  MyCampaignsData,
  PlatformStatsData,
} from "@/lib/campaigns";

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

export function useMyCampaigns(enabled = true) {
  const query = useActionQuery("list-my-campaigns", {}, { enabled });
  const data = query.data as MyCampaignsData | undefined;
  return {
    created: data?.created ?? [],
    saved: data?.saved ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export function useCampaignMemberData(
  campaignId: string | undefined,
  enabled: boolean,
) {
  const trimmedId = campaignId?.trim() ?? "";
  const query = useActionQuery(
    "get-campaign-member-data",
    { campaignId: trimmedId },
    { enabled: enabled && Boolean(trimmedId) },
  );
  return {
    memberData: (query.data ?? null) as CampaignMemberData | null,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export function useCreateCampaign() {
  return useActionMutation("create-campaign");
}

export function useUpdateCampaign() {
  return useActionMutation("update-campaign");
}

export function useToggleCampaignBookmark() {
  return useActionMutation("toggle-campaign-bookmark");
}

export function usePostCampaignComment() {
  return useActionMutation("post-campaign-comment");
}

export function useSendCampaignChat() {
  return useActionMutation("send-campaign-chat");
}
