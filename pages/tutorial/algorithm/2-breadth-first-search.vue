<template>
  <NuxtLayout name="algorithm">
    <template #content
      ><div class="tabs px-4 pt-2 bg-base-300">
        <div class="tab tab-lifted hidden"></div>
        <button
          class="tab tab-lifted font-medium"
          :class="[
            activeTab === 0
              ? 'tab-active [--tab-bg:hsl(var(--b2))] [--tab-border-color:hsl(var(--b2))] [--tab-color:hsl(var(--bc))]'
              : '[--tab-border-color:transparent]',
          ]"
          @click="activeTab = 0"
        >
          Introduction
        </button>
        <button
          class="tab tab-lifted font-medium [--tab-border-color:transparent]"
          :class="[
            activeTab === 1
              ? 'tab-active [--tab-bg:hsl(var(--b2))] [--tab-border-color:hsl(var(--b2))] [--tab-color:hsl(var(--bc))]'
              : '[--tab-border-color:transparent]',
          ]"
          @click="activeTab = 1"
        >
          Code Example
        </button>
        <div class="tab tab-lifted hidden"></div>
      </div>
      <div class="overflow-y-auto p-4">
        <div v-show="activeTab === 0">
          <ContentDoc
            class="prose prose-sm xl:prose-base max-w-none"
            path="algorithm/breadth-first-search"
          />
        </div>
        <div v-show="activeTab === 1">
          <ContentDoc
            class="prose prose-sm xl:prose-base max-w-none"
            path="algorithm/breadth-first-search.code"
            :head="false"
          />
        </div></div
    ></template>
    <template #svg>
      <D3Svg
        ref="svg"
        :has-mouse-down-node="!!mousedownNode"
        :draw-edge-cords="drawEdgeCords"
        :on-clear-data="clearData"
        :on-svg-mousedown="addNode"
        :on-svg-mousemove="updateDrawEdge"
        :on-svg-mouseup="hideDrawEdge"
        :on-svg-mouseleave="hideDrawEdge"
        :is-draggable="true"
        class="w-full h-full"
      >
        <template #edges>
          <line
            v-for="edge in data.edges"
            :key="`${(edge.source as NodeDatum).id}-${(edge.target as NodeDatum).id}`"
            class="stroke-[5] hover:cursor-pointer hover:stroke-[6]"
            :class="getEdgeColor(edge)"
            :x1="(edge.source as NodeDatum).x"
            :y1="(edge.source as NodeDatum).y"
            :x2="(edge.target as NodeDatum).x"
            :y2="(edge.target as NodeDatum).y"
            @contextmenu.prevent="removeEdge($event, edge)"
            @mouseenter="highlightEdge($event, edge)"
            @mouseleave="unhighlightEdge()"
          ></line>
        </template>
        <template #nodes>
          <g v-for="(node, i) in data.nodes" :key="node.id" class="node">
            <circle
              class="cursor-pointer hover:brightness-75"
              :class="{
                'stroke-black stroke-[4]': node.index === visitingNodeIndex,
              }"
              :style="{ fill: getNodeColor(i) }"
              :cx="node.x"
              :cy="node.y"
              r="10"
              @contextmenu.prevent="removeNode($event, node)"
              @mousedown.exact="beginDrawEdge($event, node)"
              @mouseup.exact="endDrawEdge($event, node)"
              @mouseenter="highlightNode($event, node)"
              @mouseleave="unhighlightNode()"
            >
              <title>{{ nodeTitle(node.id, i) }}</title>
            </circle>
            <text class="select-none" dx="12" dy="6" :x="node.x" :y="node.y">
              {{ node.id }}
            </text>
          </g>
        </template>
      </D3Svg>
    </template>
    <template #control>
      <D3AlgorithmControl
        v-model:traversal-start-node-index="traversalStartNodeIndex"
        :node-ids="data.nodes.map((node) => node.id)"
        :visiting-traversal-index="visitingTraversalIndex"
        :is-playing="isPlaying"
        @play="play"
        @visit-next-node="visitNextNode"
        @generate-random-graph="generateRandomGraph(20, 20)"
      />
      <p>
        queue:
        {{
          algorithmRecords![
            visitingTraversalIndex === null
              ? 0
              : (visitingTraversalIndex ?? 0) + 1
          ] || []
        }}
      </p>
    </template>
    <template #result>
      <D3AlgorithmResult
        :node-ids="data.nodes.map((node) => node.id)"
        :traversal="traversal"
        :walk="walk"
        :hover-node="hoverNode"
        :hover-edge="hoverEdge"
      />
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'Breadth-First Search',
  path: '/tutorial/algorithm/breadth-first-search',
  pageOrder: 2,
})

const activeTab = ref(0)

interface NodeDatum extends d3.SimulationNodeDatum {
  id: number
}

interface EdgeDatum extends d3.SimulationLinkDatum<NodeDatum> {}

interface GraphData {
  nodes: NodeDatum[]
  edges: EdgeDatum[]
}

const initData: GraphData = {
  nodes: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
  edges: [
    { source: 0, target: 1 },
    { source: 0, target: 2 },
    { source: 1, target: 3 },
    { source: 1, target: 4 },
    { source: 2, target: 5 },
  ],
}

const svg = ref<HTMLDivElement | null>(null)

const {
  clearData,
  updateSimulation,
  addNode,
  removeNode,
  highlightNode,
  unhighlightNode,
  mousedownNode,
  drawEdgeCords,
  beginDrawEdge,
  updateDrawEdge,
  endDrawEdge,
  hideDrawEdge,
  removeEdge,
  data,
  colors,
  enableDrag,
  adjacencyList,
  hoverNode,
  hoverEdge,
  highlightEdge,
  unhighlightEdge,
} = useD3(initData, svg)

enableDrag()

const traversalStartNodeIndex = ref<number>(0)
watch(
  () => data.nodes.length,
  (length) => {
    while (traversalStartNodeIndex.value >= length) {
      traversalStartNodeIndex.value--
    }
    if (traversalStartNodeIndex.value < 0 && length > 0) {
      traversalStartNodeIndex.value = 0
    }
  }
)

const {
  traversal,
  walk,
  algorithmRecords,
  visitingTraversalIndex,
  visitingNodeIndex,
  visitedNodeIndices,
  visitNextNode,
  isPlaying,
  play,
} = useTraversal(() => {
  const visited = new Set()
  const traversal: number[] = []
  const walk: string[] = []
  const algorithmRecords: number[][] = []

  // BFS
  function bfs(nodeIndex: number) {
    const queue = [nodeIndex]

    while (queue.length > 0) {
      algorithmRecords.push([...queue])
      const nodeIndex = queue.shift()!

      visited.add(nodeIndex)
      traversal.push(nodeIndex)

      for (const neighbor of adjacencyList.value[nodeIndex]) {
        if (!visited.has(neighbor) && !queue.includes(neighbor)) {
          walk.push(`${nodeIndex},${neighbor}`)
          queue.push(neighbor)
        }
      }
    }
  }

  // Start traversal from traversalStartNodeIndex
  if (data.nodes.length && traversalStartNodeIndex.value >= 0) {
    bfs(traversalStartNodeIndex.value)
  }
  // Visit remaining nodes
  adjacencyList.value.forEach((_, nodeIndex) => {
    if (!visited.has(nodeIndex)) bfs(nodeIndex)
  })
  return {
    traversal,
    walk,
    algorithmRecords,
  }
})

const getNodeColor = (nodeIndex: number) => {
  if (visitedNodeIndices.value.has(nodeIndex)) {
    return colors[1]
  } else {
    return colors[0]
  }
}

const getEdgeColor = (edge: EdgeDatum) => {
  const sourceIndex = (edge.source as NodeDatum).index!
  const targetIndex = (edge.target as NodeDatum).index!
  if (
    visitedNodeIndices.value.has(sourceIndex) &&
    visitedNodeIndices.value.has(targetIndex) &&
    (walk.value.includes(`${sourceIndex},${targetIndex}`) ||
      walk.value.includes(`${targetIndex},${sourceIndex}`))
  ) {
    return 'stroke-black'
  } else {
    return 'stroke-gray-300'
  }
}

const generateRandomGraph = async (nodeCount = 6, edgeCount = 8) => {
  data.nodes.length = 0
  data.edges.length = 0
  await nextTick()
  const newData = generateRandomGraphData(nodeCount, edgeCount) as GraphData
  const oldNumNodes = data.nodes.length
  const oldNumEdges = data.edges.length
  data.nodes = newData.nodes
  data.edges = newData.edges
  if (oldNumNodes === nodeCount && oldNumEdges === edgeCount) {
    updateSimulation()
  }
  traversalStartNodeIndex.value = 0
}

const nodeTitle = (nodeId: number, nodeIndex: number) => {
  return `Node ID: ${nodeId}\nTraversal Order: ${
    traversal.value.findIndex((index) => index === nodeIndex) + 1
  }`
}
</script>

<style scoped>
line {
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
