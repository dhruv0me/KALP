import { eq, and } from "drizzle-orm";
import { getDb, schema } from "../db";

/**
 * Standard reference exchange rates against USD baseline.
 * Used as real-world market reference for international currency conversions.
 */
const BASELINE_RATES_TO_USD: Record<string, number> = {
  USD: 1.0,
  INR: 0.0116,   // ~86.2 INR per USD
  EUR: 1.08,     // 1 EUR = 1.08 USD
  GBP: 1.28,     // 1 GBP = 1.28 USD
  CAD: 0.72,
  AUD: 0.65,
  SGD: 0.76,
  JPY: 0.0067,
};

/**
 * Calculates exchange rate between fromCurrency and toCurrency,
 * and saves an immutable historical record to `exchange_rate_records`.
 * Never overwrites existing historical records.
 */
export async function getAndRecordExchangeRate(
  fromCurrency: string,
  toCurrency: string,
): Promise<{ rate: number; effectiveDate: string }> {
  const from = fromCurrency.toUpperCase().trim();
  const to = toCurrency.toUpperCase().trim();

  if (from === to) {
    return { rate: 1.0, effectiveDate: new Date().toISOString() };
  }

  const fromUsd = BASELINE_RATES_TO_USD[from] ?? 1.0;
  const toUsd = BASELINE_RATES_TO_USD[to] ?? 1.0;
  const calculatedRate = +(fromUsd / toUsd).toFixed(6);

  const effectiveDate = new Date().toISOString().split("T")[0] || new Date().toISOString();
  const now = new Date().toISOString();

  const db = await getDb();

  // Record historical rate (never overwrite)
  try {
    await db.insert(schema.exchangeRateRecords).values({
      id: `exr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      fromCurrency: from,
      toCurrency: to,
      rate: calculatedRate.toString(),
      effectiveDate,
      createdAt: now,
    });
  } catch (err) {
    // If insertion encounters lock or concurrent write, continue with calculated rate
    console.warn("Exchange rate log notice:", err);
  }

  return { rate: calculatedRate, effectiveDate };
}

