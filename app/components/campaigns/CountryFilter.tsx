import { IconAdjustmentsHorizontal, IconX } from "@tabler/icons-react";

interface CountryFilterProps {
  value: string;
  countries: string[];
  onChange: (country: string) => void;
}

export function CountryFilter({
  value,
  countries,
  onChange,
}: CountryFilterProps) {
  const isFiltered = value !== "All Countries";

  return (
    <div className="country-filter-wrap">
      <label className="country-control">
        <IconAdjustmentsHorizontal size={19} aria-hidden="true" />
        <span className="sr-only">Filter by country</span>
        <select
          aria-label="Filter campaigns by country"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="All Countries">All Countries</option>
          {countries.map((countryName) => (
            <option key={countryName} value={countryName}>
              {countryName}
            </option>
          ))}
        </select>
      </label>
      {isFiltered && (
        <button
          type="button"
          className="clear-country-button"
          onClick={() => onChange("All Countries")}
          aria-label="Clear country filter"
        >
          <IconX size={14} aria-hidden="true" />
          <span>Clear</span>
        </button>
      )}
    </div>
  );
}

