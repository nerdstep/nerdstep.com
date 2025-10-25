import { useMemo } from 'react'

const GRID_SCALE = 1.42

const BASE_HEX_WIDTH = 30
const BASE_HEX_HEIGHT = 34.641
const BASE_HEX_HALF_HEIGHT = 17.32
const BASE_EDGE_SHORT = 10
const BASE_EDGE_MEDIUM = 20
const BASE_EDGE_LONG = 30

const HEX_WIDTH = BASE_HEX_WIDTH * GRID_SCALE
const HEX_HEIGHT = BASE_HEX_HEIGHT * GRID_SCALE
const HEX_HALF_HEIGHT = BASE_HEX_HALF_HEIGHT * GRID_SCALE
const EDGE_SHORT = BASE_EDGE_SHORT * GRID_SCALE
const EDGE_MEDIUM = BASE_EDGE_MEDIUM * GRID_SCALE
const EDGE_LONG = BASE_EDGE_LONG * GRID_SCALE

interface Point {
  x: number
  y: number
}

interface Hexagon {
  vertices: Point[]
  pathData: string
}

interface HexagonGridBounds {
  minX: number
  minY: number
  width: number
  height: number
}

export interface HexagonGridData {
  hexagons: Hexagon[]
  viewBox: HexagonGridBounds
  scale: number
  vertices: Point[]
  vertexNeighbors: number[][]
}

const createHexagonVertices = (x: number, y: number): Point[] => [
  { x: x, y: y },
  { x: x + EDGE_MEDIUM, y: y },
  { x: x + EDGE_LONG, y: y + HEX_HALF_HEIGHT },
  { x: x + EDGE_MEDIUM, y: y + HEX_HEIGHT },
  { x: x, y: y + HEX_HEIGHT },
  { x: x - EDGE_SHORT, y: y + HEX_HALF_HEIGHT },
]

const createPathFromVertices = (vertices: Point[]): string =>
  `M ${vertices[0].x} ${vertices[0].y} ${vertices
    .slice(1)
    .map((v) => `L ${v.x} ${v.y}`)
    .join(' ')} Z`

const getVertexKey = (point: Point) =>
  `${Math.round(point.x * 1000)}:${Math.round(point.y * 1000)}`

export function useHexagons(): HexagonGridData {
  const data = useMemo((): HexagonGridData => {
    const cols = 20
    const rows = 10
    const result: Hexagon[] = []
    // Global vertex registry and adjacency (for vertex-to-vertex traversal)
    const vertexKeyToIndex = new Map<string, number>()
    const verticesUnique: Point[] = []
    const vertexNeighborSets: Array<Set<number>> = []
    let minX = Number.POSITIVE_INFINITY
    let minY = Number.POSITIVE_INFINITY
    let maxX = Number.NEGATIVE_INFINITY
    let maxY = Number.NEGATIVE_INFINITY

    const ensureVertexIndex = (p: Point): number => {
      const key = getVertexKey(p)
      const existing = vertexKeyToIndex.get(key)

      if (existing !== undefined) {
        return existing
      }

      const idx = verticesUnique.length
      verticesUnique.push(p)
      vertexKeyToIndex.set(key, idx)

      if (!vertexNeighborSets[idx]) {
        vertexNeighborSets[idx] = new Set<number>()
      }
      return idx
    }

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * HEX_WIDTH
        const y =
          col % 2 === 0 ? row * HEX_HEIGHT : row * HEX_HEIGHT - HEX_HALF_HEIGHT
        const vertices = createHexagonVertices(x, y)

        for (const vertex of vertices) {
          if (vertex.x < minX) {
            minX = vertex.x
          }
          if (vertex.y < minY) {
            minY = vertex.y
          }
          if (vertex.x > maxX) {
            maxX = vertex.x
          }
          if (vertex.y > maxY) {
            maxY = vertex.y
          }

          // register vertex globally
          ensureVertexIndex(vertex)
        }

        // Add edges between consecutive vertices to build vertex adjacency
        for (let i = 0; i < vertices.length; i++) {
          const a = ensureVertexIndex(vertices[i])
          const b = ensureVertexIndex(vertices[(i + 1) % vertices.length])
          vertexNeighborSets[a].add(b)
          vertexNeighborSets[b].add(a)
        }

        result.push({ vertices, pathData: createPathFromVertices(vertices) })
      }
    }

    if (
      !Number.isFinite(minX) ||
      !Number.isFinite(minY) ||
      !Number.isFinite(maxX) ||
      !Number.isFinite(maxY)
    ) {
      minX = 0
      minY = 0
      maxX = HEX_WIDTH
      maxY = HEX_HEIGHT
    }

    return {
      hexagons: result,
      viewBox: {
        minX,
        minY,
        width: maxX - minX,
        height: maxY - minY,
      },
      scale: GRID_SCALE,
      vertices: verticesUnique,
      vertexNeighbors: vertexNeighborSets.map((s) => Array.from(s)),
    }
  }, [])

  return data
}
