import {
  IconArrowLeft,
  IconArrowUpRight,
  IconCalendar,
  IconMapPin,
  IconUsers,
} from "@tabler/icons-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  CampaignMemberWorkspace,
  type ProtectedIntentKey,
} from "@/components/campaigns/CampaignMemberWorkspace";
import { EmptyState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useCampaign } from "@/hooks/use-campaigns";
import { useSession } from "@/hooks/use-session";
import { formatCampaignAmount, getFundingProgress } from "@/lib/campaigns";

export function meta() {
  return [{ title: "Campaign Details — KALP" }];
}

export default function CampaignDetailsRoute() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { campaign, isLoading, isError, refetch } = useCampaign(id);
  const { authenticated } = useSession();
  const [imageFailed, setImageFailed] = useState(false);

  const progress = campaign
    ? getFundingProgress(campaign.collectedAmount, campaign.targetAmount)
    : null;

  const handleGuestRequireAuth = (intentKey: ProtectedIntentKey) => {
    if (!id) return;
    const targetPath = `/member/campaigns/${encodeURIComponent(id)}?intent=${encodeURIComponent(intentKey)}`;
    navigate(`/auth?return=${encodeURIComponent(targetPath)}`);
  };

  return (
    <main className="explore-page">
      <Link className="text-link back-inline-link" to="/explore">
        <IconArrowLeft size={16} aria-hidden="true" /> All campaigns
      </Link>

      {isLoading ? (
        <div className="campaign-detail space-y-4" aria-busy="true">
          <Skeleton className="h-4 w-48 bg-[#e6eee1]" />
          <Skeleton className="h-12 w-3/4 bg-[#e6eee1]" />
          <Skeleton className="h-64 w-full bg-[#e6eee1]" />
          <Skeleton className="h-4 w-full bg-[#e6eee1]" />
          <Skeleton className="h-4 w-5/6 bg-[#e6eee1]" />
        </div>
      ) : isError ? (
        <div className="empty-state" role="alert">
          <h2>We couldn&apos;t load this campaign.</h2>
          <p>Please try again in a moment.</p>
          <button
            type="button"
            className="text-link"
            onClick={() => void refetch()}
          >
            Try again <IconArrowUpRight size={16} aria-hidden="true" />
          </button>
        </div>
      ) : !campaign ? (
        <EmptyState
          message="Campaign not found."
          description="It may have been removed or is not publicly available."
          actionLabel="Explore all campaigns"
          onAction={() => navigate("/explore")}
        />
      ) : (
        <div className="campaign-detail">
          <div className="card-meta-top">
            <span className="card-category">{campaign.category}</span>
            <span className="card-status-badge">{campaign.status}</span>
          </div>

          <h1>{campaign.title}</h1>

          <div className="detail-meta-strip">
            <span className="card-meta-item">
              <IconMapPin size={15} aria-hidden="true" />
              <span>{campaign.country}</span>
            </span>
            {campaign.donorCount != null && (
              <span className="card-meta-item">
                <IconUsers size={15} aria-hidden="true" />
                <span>
                  {campaign.donorCount}{" "}
                  {campaign.donorCount === 1 ? "donor" : "donors"}
                </span>
              </span>
            )}
            {campaign.deadline && (
              <span className="card-meta-item">
                <IconCalendar size={15} aria-hidden="true" />
                <span>Deadline: {campaign.deadline}</span>
              </span>
            )}
          </div>

          {campaign.imageUrl && !imageFailed && (
            <img
              src={campaign.imageUrl}
              alt={campaign.title}
              onError={() => setImageFailed(true)}
            />
          )}

          <p className="detail-description">{campaign.description}</p>

          {(campaign.collectedAmount != null || campaign.targetAmount != null) && (
            <div className="detail-funding-box">
              {progress != null && (
                <div className="progress-block">
                  <div
                    className="progress-track"
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <span style={{ width: `${progress}%` }} />
                  </div>
                  <span className="progress-percent">{progress}% funded</span>
                </div>
              )}
              <p className="card-funding-row">
                {campaign.collectedAmount != null && (
                  <strong>
                    {formatCampaignAmount(
                      campaign.collectedAmount,
                      campaign.currency,
                    )}
                  </strong>
                )}
                {campaign.targetAmount != null && (
                  <span>
                    {campaign.collectedAmount != null
                      ? " raised of "
                      : "Fundraising target: "}
                    {formatCampaignAmount(
                      campaign.targetAmount,
                      campaign.currency,
                    )}
                  </span>
                )}
              </p>
            </div>
          )}

          <CampaignMemberWorkspace
            campaign={campaign}
            authenticated={authenticated}
            onGuestRequireAuth={handleGuestRequireAuth}
          />
        </div>
      )}
    </main>
  );
}
