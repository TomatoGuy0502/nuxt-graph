import { NodeDatum, GraphData } from './useD3'

export function useGraphRepresentation({
  data,
  isDirected = ref(false),
}: {
  data: GraphData
  isDirected: Ref<boolean>
}) {
  const adjacencyMatrix = computed(() => {
    const n = data.nodes.length
    const adjacencyMatrix: number[][] = [...Array(n)].map(() =>
      Array(n).fill(0)
    )
    data.edges.forEach((edge) => {
      const sourceIndex = (edge.source as NodeDatum).index || 0
      const targetIndex = (edge.target as NodeDatum).index || 0
      adjacencyMatrix[sourceIndex][targetIndex] = 1
      if (!isDirected.value) adjacencyMatrix[targetIndex][sourceIndex] = 1
    })
    return adjacencyMatrix
  })

  const adjacencyList = computed(() => {
    return adjacencyMatrix.value.map((row) => {
      return row
        .map((isConnected, j) => (isConnected ? j : -1))
        .filter((n) => n !== -1)
    })
  })

  const edgeList = computed(() =>
    data.edges.map((edge) => {
      const sourceId = (edge.source as NodeDatum).id
      const targetId = (edge.target as NodeDatum).id
      return { sourceId, targetId }
    })
  )

  return { adjacencyMatrix, adjacencyList, edgeList }
}

export function useGraphProperties({
  data,
  adjacencyList,
  isDirected,
}: {
  data: GraphData
  adjacencyList: Ref<number[][]>
  isDirected: Ref<boolean>
}) {
  const graphProperties = computed(() => {
    const visited = new Set()
    const connectedComponents: number[][] = []
    let hasCycle = false

    // DFS
    function dfs(
      nodeIndex: number,
      parentIndex: number | null,
      component: number[]
    ) {
      visited.add(nodeIndex)
      component.push(nodeIndex)

      for (const neighborIndex of adjacencyList.value[nodeIndex]) {
        if (neighborIndex === parentIndex) continue // Skip parent
        if (visited.has(neighborIndex)) {
          hasCycle = true // Cycle detected
          continue // Skip already visited neighbor
        }
        dfs(neighborIndex, nodeIndex, component)
      }
    }

    adjacencyList.value.forEach((_, nodeIndex) => {
      if (!visited.has(nodeIndex)) {
        const component: number[] = []
        dfs(nodeIndex, null, component)
        connectedComponents.push(component.sort((a, b) => a - b))
      }
    })

    const numNodes = data.nodes.length
    const numEdges = data.edges.length
    const isForest = !hasCycle
    const isTree = isForest && numEdges === numNodes - 1
    const isComplete = isDirected.value
      ? numEdges === numNodes * (numNodes - 1)
      : adjacencyList.value.flat().length === numNodes * (numNodes - 1)

    return {
      hasCycle,
      /** Using Node Index */
      connectedComponents,
      isTree,
      isForest,
      isComplete,
    }
  })

  /** Used to color nodes based on their connected components */
  const nodesComponentColorIndex = computed(() =>
    data.nodes.map((node) =>
      graphProperties.value.connectedComponents.findIndex((arr) =>
        arr.includes(node.index ?? -1)
      )
    )
  )

  return { graphProperties, nodesComponentColorIndex }
}
