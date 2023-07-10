import type { NodeDatum, EdgeDatum } from '@/composables/useD3'

export const useAlgorithmColors = ({
  visitedNodeIndices,
  colors,
  isDirected,
  walk,
}: {
  visitedNodeIndices: Ref<Set<number>>
  colors: readonly string[]
  isDirected: Ref<boolean>
  walk: Ref<string[]>
}) => {
  const getNodeColor = (nodeIndex: number) => {
    if (visitedNodeIndices.value.has(nodeIndex)) {
      return colors[1]
    } else {
      return colors[0]
    }
  }

  const getEdgeColor = (edge: EdgeDatum) => {
    const classString = isDirected.value
      ? '[marker-end:url(#arrowGray300)]'
      : ''
    const sourceIndex = (edge.source as NodeDatum).index!
    const targetIndex = (edge.target as NodeDatum).index!
    if (
      visitedNodeIndices.value.has(sourceIndex) &&
      visitedNodeIndices.value.has(targetIndex) &&
      (walk.value.includes(`${sourceIndex},${targetIndex}`) ||
        (!isDirected.value &&
          walk.value.includes(`${targetIndex},${sourceIndex}`)))
    ) {
      // Visited edge
      return `${classString} brightness-0`
    } else {
      // Unvisited edge
      return `${classString} hover:brightness-75`
    }
  }

  return { getNodeColor, getEdgeColor }
}
