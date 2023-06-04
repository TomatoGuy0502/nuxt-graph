import { ref, reactive, onMounted, watch, computed } from 'vue'
import * as d3 from 'd3'

interface NodeDatumWithId extends d3.SimulationNodeDatum {
  id: number
  depth?: number
}

interface AdjacencyListItem {
  id: number
  value: number[]
}

interface useD3Config {
  width?: number
  height?: number
  linkDistance?: number
  linkStrength?: number
  linkIterations?: number
  chargeStrength?: number
  chargeDistanceMax?: number
  forceX?: number
  forceXStrength?: number
  forceY?: number
  forceYStrength?: number
}

export const useD3 = <
  NodeDatum extends NodeDatumWithId,
  EdgeDatum extends d3.SimulationLinkDatum<NodeDatum>
>(
  initData: {
    nodes: NodeDatum[]
    edges: EdgeDatum[]
  },
  {
    width = 600,
    height = 600,
    linkDistance = 40,
    linkStrength = undefined,
    linkIterations = 1,
    chargeStrength = -200,
    chargeDistanceMax = width / 2,
    forceX = width / 2,
    forceXStrength = 0.1,
    forceY = height / 2,
    forceYStrength = 0.1,
  }: useD3Config = {}
) => {
  const data = reactive(initData) as typeof initData
  const colors = d3.schemeTableau10
  const forceLink = d3
    .forceLink(data.edges)
    .distance(linkDistance)
    .iterations(linkIterations)
  if (linkStrength) forceLink.strength(linkStrength)

  const simulation = d3
    .forceSimulation<NodeDatum, EdgeDatum>(data.nodes)
    .force('link', d3.forceLink(data.edges).distance(linkDistance))
    .force(
      'charge',
      d3.forceManyBody().strength(chargeStrength).distanceMax(chargeDistanceMax)
    )
    .force('x', d3.forceX(forceX).strength(forceXStrength))
    .force('y', d3.forceY(forceY).strength(forceYStrength))

  onMounted(() => {
    updateSimulation()
  })

  watch([() => data.nodes.length, () => data.edges.length], updateSimulation)

  function updateSimulation() {
    simulation.force('link', d3.forceLink(data.edges).distance(linkDistance))
    simulation.nodes(data.nodes)
    simulation.alpha(0.5).restart()
  }

  function clearData() {
    data.nodes.length = 0
    data.edges.length = 0
  }

  const { adjacencyMatrix, adjacencyList, edgeList } = useGraphRepresentation({
    data,
  })

  const { graphProperties, nodesColorIndex } = useGraphProperties({
    data,
    adjacencyList,
  })

  return {
    clearData,
    ...useD3EditNode({ data }),
    ...useD3EditEdge({ data }),
    ...useD3Drag({ simulation, data }),
    data,
    colors,
    width,
    height,
    adjacencyMatrix,
    adjacencyList,
    edgeList,
    graphProperties,
    nodesColorIndex,
  }
}

function useD3Drag<
  NodeDatum extends NodeDatumWithId,
  EdgeDatum extends d3.SimulationLinkDatum<NodeDatum>
>({
  simulation,
  data,
}: {
  simulation: d3.Simulation<NodeDatum, EdgeDatum>
  data: { nodes: NodeDatum[]; edges: EdgeDatum[] }
}) {
  function _dragstarted(
    event: d3.D3DragEvent<SVGCircleElement, NodeDatum, NodeDatum>,
    d: NodeDatum
  ) {
    if (!event.active) simulation.alphaTarget(0.3).restart()
    d.fx = event.x
    d.fy = event.y
  }

  function _dragged(
    event: d3.D3DragEvent<SVGCircleElement, NodeDatum, NodeDatum>,
    d: NodeDatum
  ) {
    d.fx = event.x
    d.fy = event.y
  }

  function _dragended(
    event: d3.D3DragEvent<SVGCircleElement, NodeDatum, NodeDatum>,
    d: NodeDatum
  ) {
    if (!event.active) simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
  }

  /** Call this function to enable drag */
  function enableDrag(
    filter: (event: PointerEvent | MouseEvent, d: NodeDatum) => boolean = (
      event: PointerEvent | MouseEvent
    ) => (event.metaKey || event.ctrlKey) && !event.button
  ) {
    const drag = d3
      .drag<SVGCircleElement, NodeDatum>()
      .on('start', _dragstarted)
      .on('drag', _dragged)
      .on('end', _dragended)

    drag.filter(filter)

    onMounted(() => {
      drag(
        d3
          .selectAll<SVGCircleElement, NodeDatum>('.node circle')
          .data(data.nodes)
      )
    })
    watch(
      () => data.nodes.length,
      () => {
        drag(
          d3
            .selectAll<SVGCircleElement, NodeDatum>('.node circle')
            .data(data.nodes)
        )
      },
      { flush: 'post' }
    )
  }

  return { enableDrag }
}

function useD3EditNode<
  NodeDatum extends NodeDatumWithId,
  EdgeDatum extends d3.SimulationLinkDatum<NodeDatum>
>({ data }: { data: { nodes: NodeDatum[]; edges: EdgeDatum[] } }) {
  // Edit Node
  function addNode(event: PointerEvent | MouseEvent) {
    if (event.button !== 0) return
    const [x, y] = d3.pointer(event)
    data.nodes.push({
      id: (data.nodes.at(-1)?.id ?? -1) + 1,
      x,
      y,
    } as NodeDatum)
  }
  function removeNode(_event: PointerEvent | MouseEvent, d: NodeDatum) {
    data.nodes.splice(data.nodes.indexOf(d), 1)
    data.edges = data.edges.filter(
      (edge) => edge.source !== d && edge.target !== d
    )
  }

  // Edit Tree
  function addLeafNode(_event: PointerEvent | MouseEvent, d: NodeDatum) {
    const id = (data.nodes.at(-1)?.id ?? -1) + 1
    const [x, y] = d3.pointer(_event)
    data.nodes.push({
      id,
      x,
      y: y + 10,
      depth: (d.depth ?? 0) + 1,
    } as NodeDatum)
    data.edges.push({ source: d, target: data.nodes.at(-1) } as EdgeDatum)
  }
  function removeSubTree(_event: PointerEvent | MouseEvent, d: NodeDatum) {
    if (d.id === 0) return
    const queue: NodeDatum[] = [d]
    while (queue.length) {
      const node = queue.shift()!
      queue.push(
        ...data.edges
          .filter((edge) => edge.source === node)
          .map((edge) => edge.target as NodeDatum)
      )
      removeNode(_event, node)
    }
  }

  // Heightlight Node
  const hoverNode = ref<NodeDatum | null>(null) as Ref<NodeDatum | null>
  function highlightNode(_event: PointerEvent | MouseEvent, d: NodeDatum) {
    hoverNode.value = d
  }
  function unhighlightNode() {
    hoverNode.value = null
  }

  return {
    addNode,
    removeNode,
    addLeafNode,
    removeSubTree,
    hoverNode,
    highlightNode,
    unhighlightNode,
  }
}

function useD3EditEdge<
  NodeDatum extends NodeDatumWithId,
  EdgeDatum extends d3.SimulationLinkDatum<NodeDatum>
>({ data }: { data: { nodes: NodeDatum[]; edges: EdgeDatum[] } }) {
  // Heightlight Edge
  const hoverEdge = ref<EdgeDatum | null>(null) as Ref<EdgeDatum | null>
  function highlightEdge(_event: PointerEvent | MouseEvent, d: EdgeDatum) {
    hoverEdge.value = d
  }
  function unhighlightEdge() {
    hoverEdge.value = null
  }

  // Edit Edge
  const mousedownNode = ref<NodeDatum | null>(null) as Ref<NodeDatum | null>
  const drawEdgeCords = reactive({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  })

  function beginDrawEdge(event: PointerEvent | MouseEvent, d: NodeDatum) {
    mousedownNode.value = d
    const [x, y] = d3.pointer(event)
    drawEdgeCords.x1 = d.x ?? x
    drawEdgeCords.y1 = d.y ?? y
    drawEdgeCords.x2 = x
    drawEdgeCords.y2 = y
  }
  function updateDrawEdge(event: PointerEvent | MouseEvent) {
    if (!mousedownNode.value) return
    const [x, y] = d3.pointer(event)
    drawEdgeCords.x1 = mousedownNode.value?.x ?? x
    drawEdgeCords.y1 = mousedownNode.value?.y ?? y
    drawEdgeCords.x2 = x
    drawEdgeCords.y2 = y
  }
  function endDrawEdge(_event: PointerEvent | MouseEvent, d: NodeDatum) {
    if (!mousedownNode.value || d === mousedownNode.value) return
    if (
      data.edges.some(
        (edge) =>
          (edge.source === d && edge.target === mousedownNode.value) ||
          (edge.source === mousedownNode.value && edge.target === d)
      )
    )
      return
    data.edges.push({ source: mousedownNode.value, target: d } as EdgeDatum)
  }
  function endDrawEdgeWithRandomWeight(
    _event: PointerEvent | MouseEvent,
    d: NodeDatum
  ) {
    if (!mousedownNode.value || d === mousedownNode.value) return
    if (
      data.edges.some(
        (edge) =>
          (edge.source === d && edge.target === mousedownNode.value) ||
          (edge.source === mousedownNode.value && edge.target === d)
      )
    )
      return
    data.edges.push({
      source: mousedownNode.value,
      target: d,
      weight: Math.floor(Math.random() * 10),
    } as unknown as EdgeDatum)
  }
  function hideDrawEdge() {
    mousedownNode.value = null
  }
  function removeEdge(_event: PointerEvent | MouseEvent, d: EdgeDatum) {
    data.edges.splice(data.edges.indexOf(d), 1)
  }
  return {
    hoverEdge,
    highlightEdge,
    unhighlightEdge,
    mousedownNode,
    drawEdgeCords,
    beginDrawEdge,
    updateDrawEdge,
    endDrawEdge,
    endDrawEdgeWithRandomWeight,
    hideDrawEdge,
    removeEdge,
  }
}

function useGraphRepresentation<
  NodeDatum extends NodeDatumWithId,
  EdgeDatum extends d3.SimulationLinkDatum<NodeDatum>
>({ data }: { data: { nodes: NodeDatum[]; edges: EdgeDatum[] } }) {
  const adjacencyMatrix = computed(() => {
    const n = data.nodes.length
    const adjacencyMatrix: number[][] = [...Array(n)].map(() =>
      Array(n).fill(0)
    )
    data.edges.forEach((edge) => {
      const sourceIndex = (edge.source as NodeDatum).index || 0
      const targetIndex = (edge.target as NodeDatum).index || 0
      adjacencyMatrix[sourceIndex][targetIndex] = 1
      adjacencyMatrix[targetIndex][sourceIndex] = 1
    })
    return adjacencyMatrix
  })

  const adjacencyList = computed<AdjacencyListItem[]>(() => {
    return adjacencyMatrix.value.map((row, i) => {
      return {
        id: data.nodes[i].id,
        value: row
          .map((isConnected, j) => (isConnected ? data.nodes[j].id : -1))
          .filter((n) => n !== -1),
      }
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

function useGraphProperties<
  NodeDatum extends NodeDatumWithId,
  EdgeDatum extends d3.SimulationLinkDatum<NodeDatum>
>({
  data,
  adjacencyList,
}: {
  data: { nodes: NodeDatum[]; edges: EdgeDatum[] }
  adjacencyList: Ref<AdjacencyListItem[]>
}) {
  const graphProperties = computed(() => {
    const visited = new Set()
    const connectedComponents: number[][] = []
    let hasCycle = false

    // DFS
    function dfs(nodeId: number, parentId: number | null, component: number[]) {
      visited.add(nodeId)
      component.push(nodeId)

      for (const neighbor of getNodeById(nodeId).value) {
        if (neighbor === parentId) continue // Skip the parent node
        if (visited.has(neighbor)) {
          hasCycle = true // Cycle detected
          continue // Skip already visited neighbor
        }
        dfs(neighbor, nodeId, component)
      }
    }

    function getNodeById(id: number) {
      return adjacencyList.value.find(
        (node) => node.id === id
      ) as AdjacencyListItem
    }

    for (const node of adjacencyList.value) {
      if (!visited.has(node.id)) {
        const component: number[] = []
        dfs(node.id, null, component)
        connectedComponents.push(component)
      }
    }

    const numNodes = data.nodes.length
    const numEdges = data.edges.length
    const isForest = !hasCycle
    const isTree = isForest && numEdges === numNodes - 1
    const isComplete = numEdges === (numNodes * (numNodes - 1)) / 2

    return {
      hasCycle,
      connectedComponents,
      isTree,
      isForest,
      isComplete,
    }
  })

  /** Used to color nodes based on their connected components */
  const nodesColorIndex = computed(() =>
    data.nodes.map((node) =>
      graphProperties.value.connectedComponents.findIndex((arr) =>
        arr.includes(node.id)
      )
    )
  )

  return { graphProperties, nodesColorIndex }
}
