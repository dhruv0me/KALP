import { formatCampaignAmount, type PlatformStatsData } from "@/lib/campaigns";

interface PlatformStatsProps {
  stats: PlatformStatsData | null;
}

export function PlatformStats({ stats }: PlatformStatsProps) {
  if (!stats || stats.totalPublicCampaigns <= 0) {
    return null;
  }

  return (
    <section className="stats-section" aria-label="Platform statistics">
      <div className="section-kicker">
        <span>LIVE DATABASE OVERVIEW</span>
        <span>VERIFIED RECORDS ONLY</span>
      </div>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Active campaigns</span>
          <strong className="stat-value">
            {new Intl.NumberFormat().format(stats.totalActiveCampaigns)}
          </strong>
        </div>
        <div className="stat-item">
          <span className="stat-label">Completed campaigns</span>
          <strong className="stat-value">
            {new Intl.NumberFormat().format(stats.totalCompletedCampaigns)}
          </strong>
        </div>
        <div className="stat-item">
          <span className="stat-label">Verified donors</span>
          <strong className="stat-value">
            {new Intl.NumberFormat().format(stats.totalVerifiedDonors)}
          </strong>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total funds collected</span>
          <strong className="stat-value">
            {formatCampaignAmount(stats.totalFundsCollected, stats.currency)}
          </strong>
        </div>
      </div>
    </section>
  );
}

