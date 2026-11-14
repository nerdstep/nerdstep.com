import { useSyncExternalStore } from 'react'

/**
 * Where the honeycomb's hex lattice sits on the page. The honeycomb publishes
 * it so the background grid can draw the same lattice around its cells.
 */
export interface LatticeCell {
  /** Honeycomb cell id. */
  id: string
  /** Cell center in page (document) pixels. */
  x: number
  y: number
  /** Hue of the ambient glow the background draws behind this cell, if any. */
  glowHue?: number
}

export interface HexLattice {
  /** Center of the anchor honeycomb cell, in page (document) pixels. */
  originX: number
  originY: number
  /** Every honeycomb cell, so the background knows which lattice cells they fill. */
  cells: readonly LatticeCell[]
  /** Width of a honeycomb cell in pixels. Cells are flat-top hexagons. */
  hexWidth: number
  /** Gap between neighboring honeycomb cells in pixels. */
  gap: number
}

let current: HexLattice | null = null
const listeners = new Set<() => void>()

const EPSILON = 0.01
const near = (a: number, b: number) => Math.abs(a - b) < EPSILON
const sameCells = (a: readonly LatticeCell[], b: readonly LatticeCell[]) =>
  a.length === b.length &&
  a.every(
    (cell, i) =>
      cell.id === b[i].id &&
      cell.glowHue === b[i].glowHue &&
      near(cell.x, b[i].x) &&
      near(cell.y, b[i].y),
  )
const sameLattice = (a: HexLattice | null, b: HexLattice | null) =>
  a === b ||
  (a !== null &&
    b !== null &&
    near(a.originX, b.originX) &&
    near(a.originY, b.originY) &&
    near(a.hexWidth, b.hexWidth) &&
    a.gap === b.gap &&
    sameCells(a.cells, b.cells))

/** Publish the honeycomb's lattice, or null when no honeycomb is on the page. */
export function publishHexLattice(next: HexLattice | null) {
  if (sameLattice(current, next)) {
    return
  }
  current = next
  for (const listener of listeners) {
    listener()
  }
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** The current honeycomb lattice; null on the server and on pages without one. */
export function useHexLattice() {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  )
}
