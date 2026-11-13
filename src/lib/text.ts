import { dedupe } from './collections'

/**
 * Truncates a string to a maximum number of UTF-16 code units.
 */
export function truncate(value: string, max: number): string {
  if (value.length <= max) {
    return value
  }

  return value.slice(0, max)
}

/**
 * Trims text input and normalizes nullish values to an empty string.
 */
export function normalizeText(value?: string | null): string {
  return value?.trim() ?? ''
}

/**
 * Selects the singular or plural noun for a count. The plural defaults to the
 * singular with an appended `s`; pass it explicitly for irregular nouns.
 */
export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return count === 1 ? singular : plural
}

/**
 * Trims and lowercases text for case-insensitive keys and comparisons.
 */
export function normalizeTextKey(value: string): string {
  return value.trim().toLowerCase()
}

/**
 * Splits a comma-separated string into trimmed, non-empty values.
 */
export function splitStringList(value?: string | null) {
  if (!value) {
    return []
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

/**
 * Trims, drops empty values, and deduplicates a string list.
 */
export function normalizeStringList(values: string[]): string[] {
  return dedupe(values.map((value) => value.trim()).filter((value) => value.length > 0))
}
