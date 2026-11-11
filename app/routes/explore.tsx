import { IconArrowUpRight } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { CampaignFilters } from "@/components/campaigns/CampaignFilters";
import {
  CampaignGrid,
  CampaignGridSkeleton,
} from "@/components/campaigns/CampaignGrid";
import { CampaignSearch } from "@/components/campaigns/CampaignSearch";
import { CountryFilter } from "@/components/campaigns/CountryFilter";
import { EmptyState } from "@/components/common/EmptyState";
import { useCampaigns } from "@/hooks/use-campaigns";
import {
  getCountryOptions,
  type CampaignStatusFilter,
} from "@/lib/campaigns";

export function meta() {
  return [
    { title: "Explore Campaigns — KALP" },
    {
      name: "description",
      content:
        "Discover student projects, college events, hackathon projects, and college startups by category, country, and completion status.",
    },
  ];
}

export default function ExploreRoute() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [country, setCountry] = useState("All Countries");
  const [statusFilter, setStatusFilter] = useState<CampaignStatusFilter>("all");

  const { campaigns, isLoading, isError, refetch } = useCampaigns();

  const countries = useMemo(() => getCountryOptions(campaigns), [campaigns]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    return campaigns.filter((campaign) => {
      const matchesCategory =
        category === "All" || campaign.category === category;
      const matchesCountry =
        country === "All Countries" || campaign.country === country;
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "completed"
            ? campaign.status === "completed"
            : campaign.status === "published" || campaign.status === "active";
      const matchesSearch =
        !query ||
        `${campaign.title} ${campaign.description} ${campaign.category} ${campaign.country}`
          .toLowerCase()
          .includes(query);
      return (
        matchesCategory && matchesCountry && matchesStatus && matchesSearch
      );
    });
  }, [campaigns, category, country, statusFilter, search]);

  const hasFilters =
    Boolean(search.trim()) ||
    category !== "All" ||
    country !== "All Countries" ||
    statusFilter !== "all";

  const clearAllFilters = () => {
    setSearch("");
    setCategory("All");
    setCountry("All Countries");
    setStatusFilter("all");
  };

  const emptyMessage = !hasFilters && campaigns.length === 0
    ? "No campaigns available yet."
    : search.trim()
      ? "No matching campaigns found. Try another search."
      : statusFilter === "completed"
        ? "No completed projects yet."
        : country !== "All Countries"
          ? "No campaigns currently available in this country."
          : category !== "All"
            ? "No campaigns found in this category."
            : "No campaigns available yet.";

  return (
    <main className="explore-page">
      <div className="explore-heading">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            TRANSPARENT CAMPAIGN DISCOVERY
          </div>
          <h1>
            Discover something <em>real.</em>
          </h1>
          <p>
            Explore student projects, college events, hackathon builds, and
            college startups backed by real database records.
          </p>
        </div>
        <Link className="button button-outline" to="/start-campaign">
          Start a Campaign <IconArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>

      <div className="discovery-controls">
        <CampaignSearch value={search} onChange={setSearch} />
        <CountryFilter
          value={country}
          countries={countries}
          onChange={setCountry}
        />
      </div>

      <CampaignFilters
        selectedCategory={category}
        onSelectCategory={setCategory}
        selectedStatus={statusFilter}
        onSelectStatus={setStatusFilter}
      />

      <div className="results-heading">
        <span>EXPLORE CAMPAIGNS</span>
        <span>
          {isLoading
            ? "LOADING RECORDS"
            : `${filtered.length} ${filtered.length === 1 ? "CAMPAIGN" : "CAMPAIGNS"}`}
          <span className="mini-star" aria-hidden="true">
            ✳
          </span>
        </span>
      </div>

      {isLoading ? (
        <CampaignGridSkeleton />
      ) : isError ? (
        <div className="empty-state" role="alert">
          <h2>We couldn&apos;t load campaigns.</h2>
          <p>
            Unable to retrieve campaign records right now. Please try again.
          </p>
          <button
            type="button"
            className="text-link"
            onClick={() => void refetch()}
          >
            Try again <IconArrowUpRight size={16} aria-hidden="true" />
          </button>
        </div>
      ) : filtered.length > 0 ? (
        <CampaignGrid campaigns={filtered} />
      ) : (
        <EmptyState
          message={emptyMessage}
          description={
            campaigns.length === 0 && !hasFilters
              ? "Once verified student projects, college events, hackathons, or startups are published, they will appear here."
              : "Try clearing or adjusting your active search and filter selections."
          }
          actionLabel={hasFilters ? "Clear filters" : "Explore all campaigns"}
          onAction={hasFilters ? clearAllFilters : undefined}
        />
      )}
    </main>
  );
}
