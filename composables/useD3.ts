import { ref, reactive, onMounted, watch, computed } from 'vue'
import * as d3 from 'd3'

interface NodeDatumWithId extends d3.SimulationNodeDatum {
  id: number
}

export const useD3 = <
  NodeDatum extends NodeDatumWithId,
  EdgeDatum extends d3.SimulationLinkDatum<NodeDatum>
>(
  initData: {
    nodes: NodeDatum[]
    edges: EdgeDatum[]
  },
  { width = 600, height = 600, linkDistance = 40, chargeStrength = -200 } = {}
) => {
  const data = reactive(initData) as typeof initData
  const colors = d3.schemeTableau10
  const simulation = d3
    .forceSimulation<NodeDatum, EdgeDatum>(data.nodes)
    .force('link', d3.forceLink(data.edges).distance(linkDistance))
    .force(
      'charge',
      d3
        .forceManyBody()
        .strength(chargeStrength)
        .distanceMax(width / 2)
    )
    // .force('center', d3.forceCenter(width / 2, height / 2))
    .force('x', d3.forceX(width / 2))
    .force('y', d3.forceY(height / 2))

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

  // Heightlight Node
  const hoverNode = ref<NodeDatum | null>(null) as Ref<NodeDatum | null>
  function highlightNode(_event: PointerEvent | MouseEvent, d: NodeDatum) {
    hoverNode.value = d
  }
  function unhighlightNode() {
    hoverNode.value = null
  }

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

  const adjacencyMatrix = computed(() => {
    const n = data.nodes.length
    const adjacencyMatrix: Number[][] = [...Array(n)].map(() =>
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

  const adjacencyList = computed(() => {
    return adjacencyMatrix.value.map((row, i) => {
      return {
        id: data.nodes[i].id,
        value: row
          .map((isConnected, j) => (isConnected ? data.nodes[j].id : -1))
          .filter((n) => n !== -1),
      }
    })
  })

  // Handle Drag
  function dragstarted(
    event: d3.D3DragEvent<SVGCircleElement, NodeDatum, NodeDatum>,
    d: NodeDatum
  ) {
    if (!event.active) simulation.alphaTarget(0.3).restart()
    d.fx = event.x
    d.fy = event.y
  }

  function dragged(
    event: d3.D3DragEvent<SVGCircleElement, NodeDatum, NodeDatum>,
    d: NodeDatum
  ) {
    d.fx = event.x
    d.fy = event.y
  }

  function dragended(
    event: d3.D3DragEvent<SVGCircleElement, NodeDatum, NodeDatum>,
    d: NodeDatum
  ) {
    if (!event.active) simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
  }

  function enableDrag() {
    const drag = d3
      .drag<SVGCircleElement, NodeDatum>()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)

    drag.filter((event) => {
      return (event.metaKey || event.ctrlKey) && !event.button
    })

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

  return {
    clearData,
    addNode,
    removeNode,
    hoverNode,
    highlightNode,
    unhighlightNode,
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
    data,
    colors,
    width,
    height,
    adjacencyMatrix,
    adjacencyList,
    enableDrag,
  }
}
