import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Campaign } from "@/lib/campaigns";

interface CampaignGridProps {
  campaigns: Campaign[];
}

export function CampaignGrid({ campaigns }: CampaignGridProps) {
  return (
    <div className="campaign-grid">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}

export function CampaignGridSkeleton() {
  return (
    <div className="campaign-grid" aria-busy="true" aria-label="Loading campaigns">
      {[0, 1, 2].map((index) => (
        <div key={index} className="campaign-card campaign-card-skeleton">
          <Skeleton className="h-44 w-full rounded-none bg-[#e6eee1]" />
          <div className="campaign-card-body space-y-3">
            <Skeleton className="h-3 w-28 bg-[#e6eee1]" />
            <Skeleton className="h-7 w-3/4 bg-[#e6eee1]" />
            <Skeleton className="h-4 w-full bg-[#e6eee1]" />
            <Skeleton className="h-4 w-2/3 bg-[#e6eee1]" />
            <Skeleton className="h-3 w-24 bg-[#e6eee1]" />
          </div>
        </div>
      ))}
    </div>
  );
}

