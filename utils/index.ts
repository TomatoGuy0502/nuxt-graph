import { GraphData } from '~/composables/useD3'

export function generateRandomGraphData(nodeCount: number, edgeCount: number) {
  const newData: GraphData = {
    nodes: [...Array(nodeCount)].map((_, i) => ({ id: i })),
    edges: [],
  }
  // Make sure the edge count is within the range of possible edges.
  edgeCount = Math.min((nodeCount * (nodeCount - 1)) / 2, edgeCount)

  const edgeCombinations = new Set()

  while (edgeCount > 0) {
    const source = getRandomIndex(nodeCount)
    const targetIndex = getRandomIndex(nodeCount - 1)
    const target = targetIndex < source ? targetIndex : targetIndex + 1

    const edgeCombination1 = `${source}-${target}`
    const edgeCombination2 = `${target}-${source}`
    if (
      edgeCombinations.has(edgeCombination1) ||
      edgeCombinations.has(edgeCombination2)
    )
      continue
    newData.edges.push({ source, target })
    edgeCombinations.add(edgeCombination1)
    edgeCount--
  }

  function getRandomIndex(max: number) {
    return Math.floor(Math.random() * max)
  }

  return newData
}

export function almostEqual(a: number, b: number, epsilon = 0.01) {
  return Math.abs(a - b) < epsilon
}
