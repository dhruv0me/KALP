import { z } from "zod";

export const restrictedDocumentSchema = z.object({
  title: z.string().trim().min(1).max(160),
  url: z.string().trim().min(1).max(500),
  note: z.string().trim().max(300).optional(),
});

export const protectedProofSchema = z.object({
  title: z.string().trim().min(1).max(160),
  summary: z.string().trim().min(1).max(500),
  url: z.string().trim().max(500).optional(),
});

export type RestrictedDocumentItem = z.infer<typeof restrictedDocumentSchema>;
export type ProtectedProofItem = z.infer<typeof protectedProofSchema>;

export function sanitizeHttpUrl(value: string | undefined | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

export function serializeRestrictedDocuments(
  items: RestrictedDocumentItem[] | undefined,
): string | null {
  if (!items || items.length === 0) return null;
  const normalized = items.flatMap((item) => {
    const safeUrl = sanitizeHttpUrl(item.url);
    if (!safeUrl) return [];
    const trimmedNote = item.note?.trim();
    return [
      trimmedNote
        ? { title: item.title.trim(), url: safeUrl, note: trimmedNote }
        : { title: item.title.trim(), url: safeUrl },
    ];
  });
  return normalized.length > 0 ? JSON.stringify(normalized) : null;
}

export function serializeProtectedProofs(
  items: ProtectedProofItem[] | undefined,
): string | null {
  if (!items || items.length === 0) return null;
  const normalized = items
    .map((item) => {
      const safeUrl = sanitizeHttpUrl(item.url);
      return {
        title: item.title.trim(),
        summary: item.summary.trim(),
        ...(safeUrl ? { url: safeUrl } : {}),
      };
    })
    .filter((item) => item.title.length > 0 && item.summary.length > 0);
  return normalized.length > 0 ? JSON.stringify(normalized) : null;
}

export function parseRestrictedDocuments(
  raw: string | null | undefined,
): RestrictedDocumentItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    const result = z.array(restrictedDocumentSchema).safeParse(parsed);
    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

export function parseProtectedProofs(
  raw: string | null | undefined,
): ProtectedProofItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    const result = z.array(protectedProofSchema).safeParse(parsed);
    return result.success ? result.data : [];
  } catch {
    return [];
  }
}
