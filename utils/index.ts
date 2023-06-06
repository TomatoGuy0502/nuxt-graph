export function generateRandomGraphData(nodeCount: number, edgeCount: number) {
  const initData: {
    nodes: { id: number }[]
    edges: { source: number; target: number }[]
  } = {
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
    initData.edges.push({ source, target })
    edgeCombinations.add(edgeCombination1)
    edgeCount--
  }

  // 隨機取得索引
  function getRandomIndex(max: number) {
    return Math.floor(Math.random() * max)
  }

  return initData
}
