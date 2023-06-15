import { ref, reactive, onMounted, watch, computed } from 'vue'
import * as d3 from 'd3'
import { almostEqual } from '@/utils'

// TODO: Split use* into multiple files
export interface BaseNodeDatum extends d3.SimulationNodeDatum {
  id: number
  depth?: number
}

interface SimulationConfig {
  linkDistance?: number
  linkStrength?: number
  linkIterations?: number
  chargeStrength?: number
  /** Range [0,1] */
  chargeDistanceMaxRatio?: number
  /** Range [0,1] */
  forceXRatioOfWidth?: number
  forceXStrength?: number
  /** Range [0,1] */
  forceYRatioOfHeight?: number
  forceYStrength?: number
  isRootedTree?: boolean
}

export const useD3 = <
  NodeDatum extends BaseNodeDatum,
  EdgeDatum extends d3.SimulationLinkDatum<NodeDatum>
>(
  initData: {
    nodes: NodeDatum[]
    edges: EdgeDatum[]
  },
  svgRef: Ref<HTMLDivElement | null>,
  simulationConfig: SimulationConfig = {},
  isDirected = ref(false)
) => {
  const data = reactive(initData) as typeof initData
  function clearData() {
    data.nodes.length = 0
    data.edges.length = 0
  }

  const colors = d3.schemeTableau10

  const { simulation, initSimulation, updateSimulation } = useD3Simulation({
    data,
  })
  initSimulation(svgRef, simulationConfig)

  const { adjacencyMatrix, adjacencyList, edgeList } = useGraphRepresentation({
    data,
    isDirected,
  })

  const { graphProperties, nodesColorIndex } = useGraphProperties({
    data,
    adjacencyList,
  })

  return {
    clearData,
    initSimulation,
    updateSimulation,
    ...useD3EditNode({ data }),
    ...useD3EditEdge({ data, isDirected }),
    ...useD3Drag({ simulation, data }),
    data,
    colors,
    adjacencyMatrix,
    adjacencyList,
    edgeList,
    graphProperties,
    nodesColorIndex,
  }
}

function useD3Simulation<
  NodeDatum extends BaseNodeDatum,
  EdgeDatum extends d3.SimulationLinkDatum<NodeDatum>
>({ data }: { data: { nodes: NodeDatum[]; edges: EdgeDatum[] } }) {
  const simulation: Ref<d3.Simulation<NodeDatum, EdgeDatum> | undefined> = ref()
  let forceLink: d3.ForceLink<d3.SimulationNodeDatum, EdgeDatum>
  let forceX: d3.ForceX<d3.SimulationNodeDatum>
  let forceY: d3.ForceY<d3.SimulationNodeDatum>
  let forceManyBody: d3.ForceManyBody<d3.SimulationNodeDatum>

  /** Call this function to initialize simulation */
  function initSimulation(
    svgRef: Ref<HTMLDivElement | null>,
    {
      linkDistance = 40,
      linkStrength = undefined,
      linkIterations = 1,
      chargeStrength = -200,
      chargeDistanceMaxRatio = 0.5,
      forceXRatioOfWidth = 0.5,
      forceXStrength = 0.1,
      forceYRatioOfHeight = 0.5,
      forceYStrength = 0.1,
      isRootedTree = false,
    }: SimulationConfig = {}
  ) {
    forceLink = d3
      .forceLink(data.edges)
      .distance(linkDistance)
      .iterations(linkIterations)
    if (linkStrength) forceLink.strength(linkStrength)
    forceX = d3.forceX().strength(forceXStrength)
    forceY = d3.forceY().strength(forceYStrength)
    forceManyBody = d3.forceManyBody().strength(chargeStrength)
    const { width: svgWidth, height: svgHeight } = useElementSize(svgRef)

    simulation.value = d3
      .forceSimulation<NodeDatum, EdgeDatum>(data.nodes)
      .force('link', forceLink)
      .force('charge', forceManyBody)
      .force('x', forceX)
      .force('y', forceY)
      .stop()

    onMounted(() => {
      forceX.x(svgWidth.value * forceXRatioOfWidth)
      forceY.y(svgHeight.value * forceYRatioOfHeight)
      forceManyBody.distanceMax(
        Math.min(svgWidth.value, svgHeight.value) * chargeDistanceMaxRatio
      )
      updateSimulation()
    })

    watch([() => data.nodes.length, () => data.edges.length], updateSimulation)

    watch([svgWidth, svgHeight], onResize)
    function onResize() {
      if (isRootedTree) {
        data.nodes[0].fx = svgWidth.value / 2
      }
      forceX.x(svgWidth.value * forceXRatioOfWidth)
      forceY.y(svgHeight.value * forceYRatioOfHeight)
      forceManyBody.distanceMax(
        Math.min(svgWidth.value, svgHeight.value) * chargeDistanceMaxRatio
      )
      simulation.value?.alpha(0.5).restart()
    }
  }

  function updateSimulation() {
    simulation.value?.stop()
    simulation.value?.nodes(data.nodes)
    forceLink.links(data.edges)
    simulation.value?.alpha(0.5).restart()
  }

  return {
    simulation,
    initSimulation,
    updateSimulation,
  }
}

function useD3Drag<
  NodeDatum extends BaseNodeDatum,
  EdgeDatum extends d3.SimulationLinkDatum<NodeDatum>
>({
  simulation,
  data,
}: {
  simulation: Ref<d3.Simulation<NodeDatum, EdgeDatum> | undefined>
  data: { nodes: NodeDatum[]; edges: EdgeDatum[] }
}) {
  function _dragstarted(
    event: d3.D3DragEvent<SVGCircleElement, NodeDatum, NodeDatum>,
    d: NodeDatum
  ) {
    if (!event.active) simulation.value?.alphaTarget(0.3).restart()
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
    if (!event.active) simulation.value?.alphaTarget(0)
    d.fx = null
    d.fy = null
  }

  /** Call this function to enable drag */
  function enableDrag(
    filter: (event: PointerEvent | MouseEvent, d: NodeDatum) => boolean = (
      event: PointerEvent | MouseEvent
    ) => (event.metaKey || event.ctrlKey) && !event.button
  ) {
    if (!simulation.value) return
    const drag = d3
      .drag<SVGCircleElement, NodeDatum>()
      .on('start', _dragstarted)
      .on('drag', _dragged)
      .on('end', _dragended)

    drag.filter(filter)

    onMounted(() => {
      d3.selectAll<SVGCircleElement, NodeDatum>('.node circle')
        .data(data.nodes)
        .call(drag)
    })
    watch(
      () => data.nodes.length,
      () => {
        d3.selectAll<SVGCircleElement, NodeDatum>('.node circle')
          .data(data.nodes)
          .call(drag)
      },
      { flush: 'post' }
    )
  }

  return { enableDrag }
}

function useD3EditNode<
  NodeDatum extends BaseNodeDatum,
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
    if (hoverNode.value === d) unhighlightNode()
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

  // Highlighted Node
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
  NodeDatum extends BaseNodeDatum,
  EdgeDatum extends d3.SimulationLinkDatum<NodeDatum>
>({
  data,
  isDirected = ref(false),
}: {
  data: { nodes: NodeDatum[]; edges: EdgeDatum[] }
  isDirected: Ref<boolean>
}) {
  // Highlighted Edge
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
    if (event.button !== 0) return
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
      data.edges.some((edge) => {
        if (isDirected.value) {
          return edge.source === mousedownNode.value && edge.target === d
        } else {
          return (
            (edge.source === d && edge.target === mousedownNode.value) ||
            (edge.source === mousedownNode.value && edge.target === d)
          )
        }
      })
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
    if (hoverEdge.value === d) unhighlightEdge()
    data.edges.splice(data.edges.indexOf(d), 1)
  }

  /** Calculate the edge cords for directed graph */
  const edgesCords = computed(() => {
    const translate = 6

    return data.edges.map((edge) => {
      const x1 = (edge.source as NodeDatum).x!
      const y1 = (edge.source as NodeDatum).y!
      const x2 = (edge.target as NodeDatum).x!
      const y2 = (edge.target as NodeDatum).y!

      // If there is only one direction, return x1, y1, x2, y2
      if (!isDirected.value) {
        return { x1, y1, x2, y2 }
      }
      if (
        !data.edges.some(
          (e) => e.source === edge.target && e.target === edge.source
        )
      ) {
        return { x1, y1, x2, y2 }
      }

      // If the edge is vertical or horizontal, just change x or y
      if (almostEqual(x1, x2) || almostEqual(y1, y2)) {
        return {
          x1: x1 + translate * Number(!almostEqual(y1, y2)),
          y1: y1 + translate * Number(!almostEqual(x1, x2)),
          x2: x2 + translate * Number(!almostEqual(y1, y2)),
          y2: y2 + translate * Number(!almostEqual(x1, x2)),
        }
      }

      const k = (y2 - y1) / (x2 - x1)
      const kPrime = -1 / k
      const dx = translate / Math.sqrt(1 + kPrime * kPrime)
      const dy = kPrime * dx

      // If the edge is not vertical or horizontal, calculate the new x and y
      return {
        x1: x1 + dx * (y2 > y1 ? -1 : 1),
        y1: y1 + dy * (y2 > y1 ? -1 : 1),
        x2: x2 + dx * (y2 > y1 ? -1 : 1),
        y2: y2 + dy * (y2 > y1 ? -1 : 1),
      }
    })
  })

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
    edgesCords,
  }
}

function useGraphRepresentation<
  NodeDatum extends BaseNodeDatum,
  EdgeDatum extends d3.SimulationLinkDatum<NodeDatum>
>({
  data,
  isDirected = ref(false),
}: {
  data: { nodes: NodeDatum[]; edges: EdgeDatum[] }
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

function useGraphProperties<
  NodeDatum extends BaseNodeDatum,
  EdgeDatum extends d3.SimulationLinkDatum<NodeDatum>
>({
  data,
  adjacencyList,
}: {
  data: { nodes: NodeDatum[]; edges: EdgeDatum[] }
  adjacencyList: Ref<number[][]>
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
    const isComplete = numEdges === (numNodes * (numNodes - 1)) / 2

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
  const nodesColorIndex = computed(() =>
    data.nodes.map((node) =>
      graphProperties.value.connectedComponents.findIndex((arr) =>
        arr.includes(node.index ?? -1)
      )
    )
  )

  return { graphProperties, nodesColorIndex }
}
