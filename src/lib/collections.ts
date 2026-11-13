import type { Primitive } from 'type-fest'

/**
 * Removes duplicate primitive values while preserving first-seen order.
 */
export function dedupe<T extends Primitive>(values: T[]): T[] {
  return dedupeBy(values, (value) => value)
}

/**
 * Removes duplicate items by a primitive key while preserving first-seen order.
 */
export function dedupeBy<T, K extends Primitive>(values: T[], getKey: (value: T) => K): T[] {
  const seen = new Set<K>()
  const output: T[] = []

  for (const value of values) {
    const key = getKey(value)

    if (seen.has(key)) {
      continue
    }

    seen.add(key)
    output.push(value)
  }

  return output
}

/**
 * Returns whether two primitive arrays share at least one value.
 */
export function arrayIntersects<T extends Primitive>(arr1: T[], arr2: T[]): boolean {
  const [sm, lg] = arr1.length < arr2.length ? [arr1, arr2] : [arr2, arr1]
  const smSet = new Set(sm)
  return lg.some((item) => smSet.has(item))
}
