import { IconSearch, IconX } from "@tabler/icons-react";

interface CampaignSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function CampaignSearch({ value, onChange }: CampaignSearchProps) {
  return (
    <label className="search-control">
      <IconSearch size={20} aria-hidden="true" />
      <span className="sr-only">Search campaigns</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search student projects, hackathons, events, or startups..."
      />
      {value && (
        <button
          type="button"
          className="clear-inline-button"
          onClick={() => onChange("")}
          aria-label="Clear search query"
        >
          <IconX size={15} aria-hidden="true" />
        </button>
      )}
    </label>
  );
}

