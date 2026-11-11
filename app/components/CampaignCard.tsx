import {
  IconArrowUpRight,
  IconCalendar,
  IconMapPin,
  IconUsers,
} from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router";
import {
  formatCampaignAmount,
  getFundingProgress,
  type Campaign,
} from "@/lib/campaigns";

interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const progress = getFundingProgress(
    campaign.collectedAmount,
    campaign.targetAmount,
  );
  const hasFundingDetails =
    campaign.collectedAmount != null || campaign.targetAmount != null;

  return (
    <article className="campaign-card">
      {campaign.imageUrl && !imageFailed && (
        <img
          src={campaign.imageUrl}
          alt={campaign.title}
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      )}
      <div className="campaign-card-body">
        <div className="card-meta-top">
          <span className="card-category">{campaign.category}</span>
          <span className="card-status-badge">{campaign.status}</span>
        </div>

        <h3>{campaign.title}</h3>
        <p className="card-description">{campaign.description}</p>

        <span className="card-country">
          <IconMapPin size={15} aria-hidden="true" />
          <span>{campaign.country}</span>
        </span>

        {progress != null && (
          <div className="progress-block">
            <div
              className="progress-track"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Funding progress: ${progress}%`}
            >
              <span style={{ width: `${progress}%` }} />
            </div>
            <span className="progress-percent">{progress}% funded</span>
          </div>
        )}

        {hasFundingDetails && (
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
                {campaign.collectedAmount != null ? " raised of " : "Target: "}
                {formatCampaignAmount(campaign.targetAmount, campaign.currency)}
              </span>
            )}
          </p>
        )}

        <div className="card-stats-meta">
          {campaign.donorCount != null && (
            <span className="card-meta-item">
              <IconUsers size={14} aria-hidden="true" />
              <span>
                {campaign.donorCount}{" "}
                {campaign.donorCount === 1 ? "donor" : "donors"}
              </span>
            </span>
          )}
          {campaign.deadline && (
            <span className="card-meta-item">
              <IconCalendar size={14} aria-hidden="true" />
              <span>Deadline: {campaign.deadline}</span>
            </span>
          )}
        </div>

        <div className="card-footer-action">
          <Link
            className="text-link"
            to={`/campaigns/${encodeURIComponent(campaign.id)}`}
          >
            View Campaign <IconArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

