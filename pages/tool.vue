<template>
  <div class="flex gap-4 p-4">
    <div>
      <button class="btn-ghost btn" @click="clearData">Clear</button>
      <svg ref="svg" :width="width" :height="height" class="cursor-cell">
        <line
          class="draw-edge cursor-cell stroke-[3]"
          :class="[mousedownNode ? 'stroke-current' : 'stroke-none']"
          :x1="drawEdgeCords.x1"
          :y1="drawEdgeCords.y1"
          :x2="drawEdgeCords.x2"
          :y2="drawEdgeCords.y2"
        ></line>
        <g class="edges"></g>
        <g class="nodes"></g>
        <g class="text"></g>
      </svg>
    </div>
    <div>
      <p>Adjacency Matrix</p>
      <ul class="flex flex-col">
        <li
          v-for="(row, i) in adjacencyMatrix"
          :key="i"
          class="flex rounded px-1 py-0.5 transition"
          :class="{ 'bg-base-300': hoverNode?.index === i }"
        >
          <pre>{{ data.nodes[i].id }} </pre>
          <code>[{{ row.join(', ') }}]</code>
        </li>
      </ul>

      <p>Adjacency List</p>
      <!-- <pre>{{ adjacencyListOutput }}</pre> -->
      <ul class="flex flex-col">
        <li
          v-for="(row, i) in adjacencyMatrix"
          :key="i"
          class="flex rounded px-1 py-0.5 transition w-fit"
          :class="{ 'bg-base-300': hoverNode?.index === i }"
        >
          <pre>{{ data.nodes[i].id }} </pre>
          <code
            >[{{
              row
                .map((n, i) => (n ? data.nodes[i].id : -1))
                .filter((n) => n !== -1)
                .join(', ')
            }}]</code
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import * as d3 from 'd3'

const svg = ref<SVGSVGElement | null>(null)

interface NodeData extends d3.SimulationNodeDatum {
  id: number
}

interface EdgeData extends d3.SimulationLinkDatum<NodeData> {}

interface GraphData {
  nodes: NodeData[]
  edges: EdgeData[]
  set: Set<string>
}

const data = reactive<GraphData>({
  nodes: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
  edges: [],
  set: new Set(),
})
const nextId = ref(data.nodes.length)

const width = 600
const height = 600

const $svg = d3.select(svg.value)
let $edge = $svg.select('.edges').selectAll<SVGLineElement, EdgeData>('line')
let $node = $svg
  .select('.nodes')
  .selectAll<SVGCircleElement, NodeData>('circle')
let $text = $svg.select('.text').selectAll<SVGTextElement, NodeData>('text')

const simulation = d3
  .forceSimulation<NodeData, EdgeData>(data.nodes)
  .force('link', d3.forceLink(data.edges).distance(40))
  .force(
    'charge',
    d3
      .forceManyBody()
      .strength(-160)
      .distanceMax(width / 2)
  )
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('x', d3.forceX(width / 2))
  .force('y', d3.forceY(height / 2))
  .on('tick', ticked)

onMounted(() => {
  const $svg = d3
    .select(svg.value)
    .on('mousedown', addNode)
    .on('contextmenu', (event: PointerEvent | MouseEvent) =>
      event.preventDefault()
    )
    .on('mousemove', updateDrawEdge)
    .on('mouseup mouseleave', hideDrawEdge)
    .attr('viewBox', [0, 0, width, height])
    .attr('width', width)
    .attr('height', height)

  $edge = $svg.select('.edges').selectAll<SVGLineElement, EdgeData>('line')
  $node = $svg.select('.nodes').selectAll<SVGCircleElement, NodeData>('circle')
  $text = $svg.select('.text').selectAll<SVGTextElement, NodeData>('text')

  updateSVG()
})

function ticked() {
  $edge
    .attr('x1', (d) => (d.source as NodeData).x ?? 0)
    .attr('y1', (d) => (d.source as NodeData).y ?? 0)
    .attr('x2', (d) => (d.target as NodeData).x ?? 0)
    .attr('y2', (d) => (d.target as NodeData).y ?? 0)

  $node.attr('cx', (d) => d.x ?? 0).attr('cy', (d) => d.y ?? 0)

  $text.attr('x', (d) => d.x ?? 0).attr('y', (d) => d.y ?? 0)
}

function updateSVG() {
  $edge = $edge
    .data(data.edges)
    .join('line')
    .on('contextmenu', removeEdge)
    .on('mousedown', (event) => event.stopPropagation())
  $node = $node
    .data(data.nodes)
    .join('circle')
    .style('fill', (d) => d3.schemeTableau10[d.id % 10])
    .on('contextmenu', removeNode)
    .on('mousedown', beginDrawEdge)
    .on('mouseup', endDrawEdge)
    .on('mouseenter', highlightNode)
    .on('mouseleave', unhighlightNode)
  $text = $text
    .data(data.nodes)
    .join('text')
    .attr('dx', 12)
    .attr('dy', 6)
    .text((d) => d.id)
  simulation.force('link', d3.forceLink(data.edges).distance(40))
  simulation.nodes(data.nodes)
  simulation.alpha(0.8).restart()
}

function clearData() {
  nextId.value = 0
  data.nodes.length = 0
  data.edges.length = 0
  data.set.clear()
  updateSVG()
}

const adjacencyMatrix = computed(() => {
  const n = data.nodes.length
  const adjacencyMatrix: Number[][] = [...Array(n)].map(() => Array(n).fill(0))
  data.edges.forEach((edge) => {
    const sourceIndex = (edge.source as NodeData).index || 0
    const targetIndex = (edge.target as NodeData).index || 0
    adjacencyMatrix[sourceIndex][targetIndex] = 1
    adjacencyMatrix[targetIndex][sourceIndex] = 1
  })
  return adjacencyMatrix
})

// const adjacencyMatrixOutput = computed(() => {
//   const n = data.nodes.length
//   let output = ''
//   for (let i = 0; i < n; i++) {
//     const id = data.nodes[i].id
//     output += `${id} [${adjacencyMatrix.value[i].join(', ')}]`
//     if (i < n - 1) {
//       output += '\n'
//     }
//   }
//   return output
// })

// const adjacencyListOutput = computed(() => {
//   const n = data.nodes.length

//   let output = ''
//   const adjacencyList = adjacencyMatrix.value.map((arr) =>
//     arr.map((n, i) => (n ? data.nodes[i].id : 0)).filter(Boolean)
//   )
//   for (let i = 0; i < n; i++) {
//     const id = data.nodes[i].id
//     output += `${id} [${adjacencyList[i].join(', ')}]`
//     if (i < n - 1) {
//       output += '\n'
//     }
//   }
//   return output
// })

// Edit Node
function addNode(event: PointerEvent | MouseEvent) {
  if (event.button !== 0) return
  const [x, y] = d3.pointer(event)
  data.nodes.push({ id: nextId.value++, x, y })
  updateSVG()
}

function removeNode(event: PointerEvent | MouseEvent, d: NodeData) {
  event.preventDefault()
  data.nodes.splice(data.nodes.indexOf(d), 1)
  data.edges = data.edges.filter(
    (edge) => edge.source !== d && edge.target !== d
  )
  data.set.clear()
  data.edges.forEach((edge) => {
    data.set.add(
      `${(edge.source as NodeData).index},${(edge.target as NodeData).index}`
    )
  })
  updateSVG()
}
const hoverNode = ref<NodeData | null>(null)
function highlightNode(_event: PointerEvent | MouseEvent, d: NodeData) {
  hoverNode.value = d
}
function unhighlightNode() {
  hoverNode.value = null
}

// Edit Edge
const mousedownNode = ref<NodeData | null>(null)
const drawEdgeCords = reactive({
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
})

function beginDrawEdge(event: PointerEvent | MouseEvent, d: NodeData) {
  event.preventDefault()
  event.stopPropagation()
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
function endDrawEdge(_event: PointerEvent | MouseEvent, d: NodeData) {
  if (!mousedownNode.value || d === mousedownNode.value) return
  const sourceId = mousedownNode.value?.id
  const targetId = d.id
  if (
    data.set.has(`${sourceId},${targetId}`) ||
    data.set.has(`${targetId},${sourceId}`)
  )
    return
  data.edges.push({ source: mousedownNode.value, target: d })
  data.set.add(`${sourceId},${targetId}`)
  updateSVG()
}
function hideDrawEdge() {
  mousedownNode.value = null
}
function removeEdge(event: PointerEvent | MouseEvent, d: EdgeData) {
  event.preventDefault()
  data.edges.splice(data.edges.indexOf(d), 1)
  data.set.delete(
    `${(d.source as NodeData).index},${(d.target as NodeData).index}`
  )
  updateSVG()
}
</script>

<style scoped>
svg {
  background-color: #eee;
}
svg > line {
  stroke-linecap: round;
  stroke-linejoin: round;
}
.edges :deep(line) {
  stroke: #000;
  stroke-width: 3px;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.edges :deep(line):hover {
  stroke: #f00;
  stroke-width: 4px;
  cursor: pointer;
}
.nodes :deep(circle) {
  r: 10;
}
.nodes :deep(circle):hover {
  opacity: 0.8;
  cursor: pointer;
}
.text :deep(text) {
  user-select: none;
}
</style>
