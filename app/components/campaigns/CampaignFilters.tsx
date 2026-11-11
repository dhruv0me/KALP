import {
  CAMPAIGN_CATEGORIES,
  CAMPAIGN_STATUS_FILTERS,
  type CampaignStatusFilter,
} from "@/lib/campaigns";

interface CampaignFiltersProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedStatus: CampaignStatusFilter;
  onSelectStatus: (status: CampaignStatusFilter) => void;
}

export function CampaignFilters({
  selectedCategory,
  onSelectCategory,
  selectedStatus,
  onSelectStatus,
}: CampaignFiltersProps) {
  return (
    <div className="filters-bar">
      <div
        className="category-row"
        role="group"
        aria-label="Campaign categories"
      >
        {CAMPAIGN_CATEGORIES.map((item) => (
          <button
            key={item}
            type="button"
            className={
              selectedCategory === item ? "category active" : "category"
            }
            aria-pressed={selectedCategory === item}
            onClick={() => onSelectCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div
        className="status-row"
        role="group"
        aria-label="Campaign completion status"
      >
        {CAMPAIGN_STATUS_FILTERS.map((item) => (
          <button
            key={item.value}
            type="button"
            className={
              selectedStatus === item.value ? "status-pill active" : "status-pill"
            }
            aria-pressed={selectedStatus === item.value}
            onClick={() => onSelectStatus(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

