// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { useGraphRepresentation, useGraphProperties } from './useGraph'

describe('useGraphRepresentation', () => {
  it('should return adjacency matrix', () => {
    const nodes = [
      { id: 0, index: 0 },
      { id: 1, index: 1 },
      { id: 2, index: 2 },
    ]
    const edges = [
      { source: nodes[0], target: nodes[1] },
      { source: nodes[1], target: nodes[2] },
    ]
    const data = reactive({
      nodes,
      edges,
    })
    const isDirected = ref(false)
    const { adjacencyMatrix } = useGraphRepresentation({
      data,
      isDirected,
    })

    expect(adjacencyMatrix.value).toEqual([
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
    ])

    isDirected.value = true
    expect(adjacencyMatrix.value).toEqual([
      [0, 1, 0],
      [0, 0, 1],
      [0, 0, 0],
    ])
  })

  it('should return adjacency list', () => {
    const nodes = [
      { id: 0, index: 0 },
      { id: 1, index: 1 },
      { id: 2, index: 2 },
    ]
    const edges = [
      { source: nodes[0], target: nodes[1] },
      { source: nodes[1], target: nodes[2] },
    ]
    const isDirected = ref(false)
    const data = reactive({
      nodes,
      edges,
    })
    const { adjacencyList } = useGraphRepresentation({
      data,
      isDirected,
    })

    expect(adjacencyList.value).toEqual([[1], [0, 2], [1]])

    isDirected.value = true
    expect(adjacencyList.value).toEqual([[1], [2], []])
  })

  it('should return edge list', () => {
    const nodes = [
      { id: 0, index: 0 },
      { id: 1, index: 1 },
      { id: 2, index: 2 },
    ]
    const edges = [
      { source: nodes[0], target: nodes[1] },
      { source: nodes[1], target: nodes[2] },
      { source: nodes[2], target: nodes[1] },
    ]
    const isDirected = ref(false)
    const data = reactive({
      nodes,
      edges,
    })
    const { edgeList } = useGraphRepresentation({
      data,
      isDirected,
    })

    expect(edgeList.value).toEqual([
      { sourceId: 0, targetId: 1 },
      { sourceId: 1, targetId: 2 },
      { sourceId: 2, targetId: 1 },
    ])
  })
})

describe('useGraphProperties', () => {
  it('should return graph properties', () => {
    const nodes = [
      { id: 0, index: 0 },
      { id: 1, index: 1 },
      { id: 2, index: 2 },
      { id: 3, index: 3 },
    ]
    const edges = [
      { source: nodes[0], target: nodes[1] },
      { source: nodes[0], target: nodes[2] },
      { source: nodes[1], target: nodes[2] },
    ]
    const isDirected = ref(false)
    const adjacencyList = ref([[1, 2], [0, 2], [0, 1], []])
    const data = reactive({
      nodes,
      edges,
    })

    const { graphProperties } = useGraphProperties({
      data,
      adjacencyList,
      isDirected,
    })
    // Has cycle, 2 connected components
    expect(graphProperties.value).toEqual({
      hasCycle: true,
      connectedComponents: [[0, 1, 2], [3]],
      isTree: false,
      isForest: false,
      isComplete: false,
    })

    // No cycle, 2 connected component
    data.edges = [
      { source: nodes[0], target: nodes[1] },
      { source: nodes[1], target: nodes[2] },
    ]
    adjacencyList.value = [[1], [0, 2], [1], []]
    expect(graphProperties.value).toEqual({
      hasCycle: false,
      connectedComponents: [[0, 1, 2], [3]],
      isTree: false,
      isForest: true,
      isComplete: false,
    })

    // No cycle, 1 connected component(tree)
    data.edges = [
      { source: nodes[0], target: nodes[1] },
      { source: nodes[0], target: nodes[3] },
      { source: nodes[1], target: nodes[2] },
    ]
    adjacencyList.value = [[1, 3], [0, 2], [1], []]
    expect(graphProperties.value).toEqual({
      hasCycle: false,
      connectedComponents: [[0, 1, 2, 3]],
      isTree: true,
      isForest: true,
      isComplete: false,
    })

    // Complete graph
    data.edges = [
      { source: nodes[0], target: nodes[1] },
      { source: nodes[0], target: nodes[2] },
      { source: nodes[0], target: nodes[3] },
      { source: nodes[1], target: nodes[2] },
      { source: nodes[1], target: nodes[3] },
      { source: nodes[2], target: nodes[3] },
    ]
    adjacencyList.value = [
      [1, 2, 3],
      [0, 2, 3],
      [0, 1, 3],
      [0, 1, 2],
    ]
    expect(graphProperties.value).toEqual({
      hasCycle: true,
      connectedComponents: [[0, 1, 2, 3]],
      isTree: false,
      isForest: false,
      isComplete: true,
    })

    isDirected.value = true
    data.nodes = [
      { id: 0, index: 0 },
      { id: 1, index: 1 },
      { id: 2, index: 2 },
    ]
    data.edges = [
      { source: nodes[0], target: nodes[1] },
      { source: nodes[0], target: nodes[2] },
      { source: nodes[1], target: nodes[0] },
      { source: nodes[1], target: nodes[2] },
      { source: nodes[2], target: nodes[0] },
      { source: nodes[2], target: nodes[1] },
    ]
    adjacencyList.value = [
      [1, 2],
      [0, 2],
      [0, 1],
    ]
    expect(graphProperties.value).toEqual({
      hasCycle: true,
      connectedComponents: [[0, 1, 2]],
      isTree: false,
      isForest: false,
      isComplete: true,
    })
  })

  it('should return connected component colors', () => {
    const nodes = [
      { id: 0, index: 0 },
      { id: 1, index: 1 },
      { id: 2, index: 2 },
      { id: 3, index: 3 },
    ]
    const edges = [{ source: nodes[0], target: nodes[1] }]
    const isDirected = ref(false)
    const adjacencyList = ref([[1], [0], [], []])
    const data = reactive({
      nodes,
      edges,
    })

    const { nodesComponentColorIndex } = useGraphProperties({
      data,
      adjacencyList,
      isDirected,
    })

    expect(nodesComponentColorIndex.value).toEqual([0, 0, 1, 2])
  })
})
