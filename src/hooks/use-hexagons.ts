import { useMemo } from 'react'

/** Height of a flat-top hexagon one unit wide. */
export const UNIT_HEX_HEIGHT = Math.sqrt(3) / 2

interface Point {
  x: number
  y: number
}

interface Hexagon {
  /** Lattice column, relative to the anchor cell at (0, 0). */
  k: number
  /** Lattice row within the column, relative to the anchor cell. */
  j: number
  center: Point
  pathData: string
  /** Deterministic per-cell shade in [0, 1) for the tiled background effect */
  shade: number
}

/** Columns and rows to draw on each side of the anchor cell. */
export interface LatticeExtent {
  columns: number
  rows: number
}

export interface HexagonGridData {
  hexagons: Hexagon[]
  vertices: Point[]
  vertexNeighbors: number[][]
}

/**
 * Center of lattice cell (k, j) in unit coordinates. Columns interlock at 3/4
 * of a cell width, and odd columns sit half a cell lower.
 */
export const latticeCenter = (k: number, j: number): Point => ({
  x: k * 0.75,
  y: (j + (Math.abs(k) % 2) / 2) * UNIT_HEX_HEIGHT,
})

const hexagonVertices = ({ x, y }: Point): Point[] => [
  { x: x - 0.25, y: y - UNIT_HEX_HEIGHT / 2 },
  { x: x + 0.25, y: y - UNIT_HEX_HEIGHT / 2 },
  { x: x + 0.5, y },
  { x: x + 0.25, y: y + UNIT_HEX_HEIGHT / 2 },
  { x: x - 0.25, y: y + UNIT_HEX_HEIGHT / 2 },
  { x: x - 0.5, y },
]

const createPathFromVertices = (vertices: Point[]): string =>
  `M ${vertices[0].x} ${vertices[0].y} ${vertices
    .slice(1)
    .map((v) => `L ${v.x} ${v.y}`)
    .join(' ')} Z`

const getVertexKey = (point: Point) =>
  `${Math.round(point.x * 10_000)}:${Math.round(point.y * 10_000)}`

// Deterministic hash so each lattice cell keeps its shade across re-renders
const cellShade = (k: number, j: number): number => {
  const s = Math.sin(k * 127.1 + j * 311.7) * 43_758.5453
  return s - Math.floor(s)
}

/**
 * A flat-top hex lattice in unit coordinates (cells one unit wide), centered on
 * the anchor cell, plus its vertex graph for particles to travel along.
 */
export function useHexagons({ columns, rows }: LatticeExtent): HexagonGridData {
  return useMemo((): HexagonGridData => {
    const hexagons: Hexagon[] = []
    const vertexKeyToIndex = new Map<string, number>()
    const vertices: Point[] = []
    const neighborSets: Array<Set<number>> = []

    const vertexIndex = (point: Point): number => {
      const key = getVertexKey(point)
      const existing = vertexKeyToIndex.get(key)
      if (existing !== undefined) {
        return existing
      }
      const index = vertices.length
      vertices.push(point)
      vertexKeyToIndex.set(key, index)
      neighborSets[index] = new Set<number>()
      return index
    }

    for (let k = -columns; k <= columns; k += 1) {
      for (let j = -rows; j <= rows; j += 1) {
        const center = latticeCenter(k, j)
        const corners = hexagonVertices(center)
        for (const [i, corner] of corners.entries()) {
          const a = vertexIndex(corner)
          const b = vertexIndex(corners[(i + 1) % corners.length])
          neighborSets[a].add(b)
          neighborSets[b].add(a)
        }
        hexagons.push({
          k,
          j,
          center,
          pathData: createPathFromVertices(corners),
          shade: cellShade(k, j),
        })
      }
    }

    return {
      hexagons,
      vertices,
      vertexNeighbors: neighborSets.map((set) => Array.from(set)),
    }
  }, [columns, rows])
}
