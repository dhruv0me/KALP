export const CAMPAIGN_CATEGORIES = [
  "All",
  "Student Projects",
  "College Events",
  "Hackathon Projects",
  "College Startups",
] as const;

export const CAMPAIGN_STATUS_FILTERS = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
] as const;

export type CampaignStatusFilter =
  (typeof CAMPAIGN_STATUS_FILTERS)[number]["value"];

export interface Campaign {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  country: string;
  category: string;
  currency: string | null;
  targetAmount: number | null;
  collectedAmount: number | null;
  donorCount: number | null;
  deadline: string | null;
  status: string;
}

export interface PlatformStatsData {
  totalPublicCampaigns: number;
  totalActiveCampaigns: number;
  totalCompletedCampaigns: number;
  totalVerifiedDonors: number;
  totalFundsCollected: number;
  currency: string | null;
}

export function formatCampaignAmount(
  amount: number,
  currency: string | null,
): string {
  if (currency && /^[A-Za-z]{3}$/.test(currency.trim())) {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currency.trim().toUpperCase(),
        maximumFractionDigits: 0,
      }).format(amount);
    } catch {
      // Fallback below if Intl rejects a non-standard code.
    }
  }
  const formatted = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(amount);
  return currency ? `${formatted} ${currency}` : formatted;
}

export function getFundingProgress(
  collectedAmount: number | null,
  targetAmount: number | null,
): number | null {
  if (
    collectedAmount == null ||
    targetAmount == null ||
    targetAmount <= 0 ||
    collectedAmount < 0
  ) {
    return null;
  }
  return Math.min(100, Math.round((collectedAmount / targetAmount) * 100));
}

const EXCLUDED_REGION_NAMES = new Set([
  "World",
  "Unknown Region",
  "European Union",
  "Eurozone",
  "United Nations",
  "Outlying Oceania",
  "Pseudo-Accents",
  "Pseudo-Bidi",
]);

export function getCountryOptions(campaigns: Campaign[]): string[] {
  const dbCountries = campaigns
    .map((c) => c.country.trim())
    .filter((name) => name.length > 0);

  let isoCountries: string[] = [];
  if (typeof Intl !== "undefined" && "DisplayNames" in Intl) {
    try {
      const displayNames = new Intl.DisplayNames(["en"], { type: "region" });
      isoCountries = Array.from({ length: 26 * 26 }, (_, index) =>
        String.fromCharCode(65 + Math.floor(index / 26), 65 + (index % 26)),
      )
        .filter((code) => !code.startsWith("X") && code !== "ZZ" && code !== "EU" && code !== "EZ" && code !== "UN" && code !== "QO")
        .map((code) => displayNames.of(code))
        .filter(
          (name): name is string =>
            typeof name === "string" &&
            name.length > 2 &&
            !EXCLUDED_REGION_NAMES.has(name),
        );
    } catch {
      isoCountries = [];
    }
  }

  return Array.from(new Set([...dbCountries, ...isoCountries])).sort((a, b) =>
    a.localeCompare(b),
  );
}

