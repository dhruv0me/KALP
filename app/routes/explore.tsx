import { IconArrowUpRight } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
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
  type CampaignSortOption,
  type CampaignStatusFilter,
} from "@/lib/campaigns";

export function meta() {
  return [
    { title: "kalpa" },
    {
      name: "description",
      content:
        "Discover student projects, college events, hackathon builds, and campus startups. Real progress, shared openly.",
    },
  ];
}

export default function ExploreRoute() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [country, setCountry] = useState("All Countries");
  const [statusFilter, setStatusFilter] = useState<CampaignStatusFilter>("all");
  const [sortOption, setSortOption] = useState<CampaignSortOption>("newest");

  const { campaigns, isLoading, isError, refetch } = useCampaigns();

  const countries = useMemo(() => getCountryOptions(campaigns), [campaigns]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    const matched = campaigns.filter((campaign) => {
      const matchesCategory =
        category === "All" ||
        campaign.category === category ||
        (category === "Hackathons" &&
          (campaign.category === "Hackathons" ||
            campaign.category === "Hackathon Projects"));

      const matchesCountry =
        country === "All Countries" ||
        campaign.country.trim().toLowerCase() === country.trim().toLowerCase();

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

    return [...matched].sort((a, b) => {
      switch (sortOption) {
        case "target-high":
          return (b.targetAmount ?? 0) - (a.targetAmount ?? 0);
        case "target-low":
          return (a.targetAmount ?? Infinity) - (b.targetAmount ?? Infinity);
        case "most-funded": {
          const ratioA = (a.collectedAmount ?? 0) / (a.targetAmount || 1);
          const ratioB = (b.collectedAmount ?? 0) / (b.targetAmount || 1);
          return ratioB - ratioA;
        }
        case "alphabetical":
          return a.title.localeCompare(b.title);
        case "newest":
        default:
          return 0;
      }
    });
  }, [campaigns, category, country, statusFilter, search, sortOption]);

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
    setSortOption("newest");
  };

  return (
    <main className="explore-page">
      <div className="explore-heading">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            CAMPAIGN DISCOVERY
          </div>
          <h1>
            Discover something <em>meaningful.</em>
          </h1>
          <p>
            Explore student projects, campus events, hackathon builds, and
            emerging startups driven by passionate campus creators.
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
        selectedSort={sortOption}
        onSelectSort={setSortOption}
      />

      <div className="results-heading">
        <span>CAMPAIGNS</span>
        <span>
          {isLoading
            ? "LOADING..."
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
            Unable to retrieve campaigns right now. Please try again in a
            moment.
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
      ) : campaigns.length === 0 && !hasFilters ? (
        <EmptyState
          message="Something exciting could start here."
          description="No campaigns are available just yet. Check back soon or start a campaign of your own."
          actionLabel="Start a Campaign"
          onAction={() => navigate("/start-campaign")}
        />
      ) : statusFilter === "completed" && filtered.length === 0 ? (
        <EmptyState
          message="No completed projects yet."
          description="Completed campaigns will appear here once student teams reach their goals."
          actionLabel="View all campaigns"
          onAction={() => setStatusFilter("all")}
        />
      ) : (
        <EmptyState
          message="No campaigns found. Try changing your filters."
          description="Try adjusting your search terms or clearing selected categories and country filters."
          actionLabel="Clear filters"
          onAction={clearAllFilters}
        />
      )}
    </main>
  );
}
