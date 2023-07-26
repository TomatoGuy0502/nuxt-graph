// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { useAlgorithmColors } from './useAlgorithmColors'

describe('useAlgorithmColors', () => {
  it('should generate node color correctly', () => {
    const visitedNodeColor = '#000000'
    const unvisitedNodeColor = '#FFFFFF'

    const { getNodeColor } = useAlgorithmColors({
      visitedNodeIndices: ref(new Set([0, 1])),
      colors: [unvisitedNodeColor, visitedNodeColor],
      isDirected: ref(false),
      walk: ref([]),
    })

    expect(getNodeColor(0)).toBe(visitedNodeColor)
    expect(getNodeColor(1)).toBe(visitedNodeColor)
    expect(getNodeColor(2)).toBe(unvisitedNodeColor)
  })

  it('should generate edge color correctly when it is not directed', () => {
    const { getEdgeColor } = useAlgorithmColors({
      visitedNodeIndices: ref(new Set([0, 1, 2])),
      colors: [],
      isDirected: ref(false),
      walk: ref(['0,1', '1,2', '2,3']),
    })
    const generateEdge = (sourceIndex: number, targetIndex: number) => ({
      source: { index: sourceIndex, id: sourceIndex },
      target: { index: targetIndex, id: targetIndex },
    })

    const visitedEdgeClassString = 'brightness-0'
    const unvisitedEdgeClassString = 'hover:brightness-75'

    expect(getEdgeColor(generateEdge(0, 1))).toBe(visitedEdgeClassString)
    expect(getEdgeColor(generateEdge(1, 0))).toBe(visitedEdgeClassString)
    expect(getEdgeColor(generateEdge(1, 2))).toBe(visitedEdgeClassString)
    expect(getEdgeColor(generateEdge(2, 1))).toBe(visitedEdgeClassString)

    expect(getEdgeColor(generateEdge(2, 3))).toBe(unvisitedEdgeClassString)
    expect(getEdgeColor(generateEdge(3, 2))).toBe(unvisitedEdgeClassString)
    expect(getEdgeColor(generateEdge(0, 2))).toBe(unvisitedEdgeClassString)
    expect(getEdgeColor(generateEdge(2, 0))).toBe(unvisitedEdgeClassString)
  })

  it('should generate edge color correctly when it is directed', () => {
    const { getEdgeColor } = useAlgorithmColors({
      visitedNodeIndices: ref(new Set([0, 1, 2])),
      colors: [],
      isDirected: ref(true),
      walk: ref(['0,1', '1,2', '2,3']),
    })
    const generateEdge = (sourceIndex: number, targetIndex: number) => ({
      source: { index: sourceIndex, id: sourceIndex },
      target: { index: targetIndex, id: targetIndex },
    })
    const visitedEdgeClassString =
      '[marker-end:url(#arrowGray300)] brightness-0'
    const unvisitedEdgeClassString =
      '[marker-end:url(#arrowGray300)] hover:brightness-75'

    expect(getEdgeColor(generateEdge(0, 1))).toBe(visitedEdgeClassString)
    expect(getEdgeColor(generateEdge(1, 0))).toBe(unvisitedEdgeClassString)
    expect(getEdgeColor(generateEdge(1, 2))).toBe(visitedEdgeClassString)
    expect(getEdgeColor(generateEdge(2, 1))).toBe(unvisitedEdgeClassString)

    expect(getEdgeColor(generateEdge(2, 3))).toBe(unvisitedEdgeClassString)
    expect(getEdgeColor(generateEdge(3, 2))).toBe(unvisitedEdgeClassString)
    expect(getEdgeColor(generateEdge(0, 2))).toBe(unvisitedEdgeClassString)
    expect(getEdgeColor(generateEdge(2, 0))).toBe(unvisitedEdgeClassString)
  })
})
