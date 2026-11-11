import { IconArrowsSort } from "@tabler/icons-react";
import {
  CAMPAIGN_CATEGORIES,
  CAMPAIGN_SORT_OPTIONS,
  CAMPAIGN_STATUS_FILTERS,
  type CampaignSortOption,
  type CampaignStatusFilter,
} from "@/lib/campaigns";

interface CampaignFiltersProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedStatus: CampaignStatusFilter;
  onSelectStatus: (status: CampaignStatusFilter) => void;
  selectedSort: CampaignSortOption;
  onSelectSort: (sort: CampaignSortOption) => void;
}

export function CampaignFilters({
  selectedCategory,
  onSelectCategory,
  selectedStatus,
  onSelectStatus,
  selectedSort,
  onSelectSort,
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

      <div className="filter-controls-right">
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
                selectedStatus === item.value
                  ? "status-pill active"
                  : "status-pill"
              }
              aria-pressed={selectedStatus === item.value}
              onClick={() => onSelectStatus(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="sort-control" aria-label="Sort campaigns">
          <IconArrowsSort size={15} aria-hidden="true" />
          <select
            value={selectedSort}
            onChange={(e) => onSelectSort(e.target.value as CampaignSortOption)}
            aria-label="Sort by"
          >
            {CAMPAIGN_SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
