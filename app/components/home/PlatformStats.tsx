import { formatCampaignAmount, type PlatformStatsData } from "@/lib/campaigns";

interface PlatformStatsProps {
  stats: PlatformStatsData | null;
}

export function PlatformStats({ stats }: PlatformStatsProps) {
  if (!stats || stats.totalPublicCampaigns <= 0) {
    return null;
  }

  return (
    <section className="stats-section" aria-label="Platform community impact">
      <div className="section-kicker">
        <span>COMMUNITY IMPACT</span>
        <span>EVERY NUMBER TELLS A REAL STORY</span>
      </div>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Active campaigns</span>
          <strong className="stat-value">
            {new Intl.NumberFormat().format(stats.totalActiveCampaigns)}
          </strong>
        </div>
        <div className="stat-item">
          <span className="stat-label">Completed projects</span>
          <strong className="stat-value">
            {new Intl.NumberFormat().format(stats.totalCompletedCampaigns)}
          </strong>
        </div>
        <div className="stat-item">
          <span className="stat-label">Supporters &amp; donors</span>
          <strong className="stat-value">
            {new Intl.NumberFormat().format(stats.totalVerifiedDonors)}
          </strong>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total funds raised</span>
          <strong className="stat-value">
            {formatCampaignAmount(stats.totalFundsCollected, stats.currency)}
          </strong>
        </div>
      </div>
    </section>
  );
}
