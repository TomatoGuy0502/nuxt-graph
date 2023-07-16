<template>
  <NuxtLayout name="algorithm">
    <template #content
      ><div class="tabs bg-base-300 px-4 pt-2">
        <div class="tab-lifted tab hidden"></div>
        <button
          class="tab-lifted tab font-medium"
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
          class="tab-lifted tab font-medium [--tab-border-color:transparent]"
          :class="[
            activeTab === 1
              ? 'tab-active [--tab-bg:hsl(var(--b2))] [--tab-border-color:hsl(var(--b2))] [--tab-color:hsl(var(--bc))]'
              : '[--tab-border-color:transparent]',
          ]"
          @click="activeTab = 1"
        >
          Code Example
        </button>
        <div class="tab-lifted tab hidden"></div>
      </div>
      <div class="overflow-y-auto p-4">
        <div v-show="activeTab === 0">
          <ContentDoc
            class="prose-sm prose max-w-none xl:prose-base"
            path="algorithm/breadth-first-search"
          />
        </div>
        <div v-show="activeTab === 1">
          <ContentDoc
            class="prose-sm prose max-w-none xl:prose-base"
            path="algorithm/breadth-first-search.code"
            :head="false"
          />
        </div></div
    ></template>
    <template #svg>
      <D3Svg
        ref="svg"
        v-model:is-directed="isDirected"
        :can-toggle-directed="true"
        :has-mouse-down-node="!!mousedownNode"
        :draw-edge-cords="drawEdgeCords"
        :on-clear-data="clearData"
        :on-svg-mousedown="addNode"
        :on-svg-mousemove="updateDrawEdge"
        :on-svg-mouseup="hideDrawEdge"
        :on-svg-mouseleave="hideDrawEdge"
        :is-draggable="true"
        :hover-node="hoverNode"
        class="h-full w-full"
      >
        <template #hint-start>
          <li><b>Hover</b> on vertex to see the details</li>
        </template>
        <template #edges>
          <line
            v-for="(edge, edgeIndex) in data.edges"
            :key="`${(edge.source as NodeDatum).id}-${
              (edge.target as NodeDatum).id
            }`"
            class="cursor-pointer stroke-gray-300 stroke-[5]"
            :class="getEdgeColor(edge)"
            :x1="edgesCords[edgeIndex].x1"
            :y1="edgesCords[edgeIndex].y1"
            :x2="edgesCords[edgeIndex].x2"
            :y2="edgesCords[edgeIndex].y2"
            @contextmenu.prevent="removeEdge($event, edge)"
            @mouseenter="highlightEdge($event, edge)"
            @mouseleave="unhighlightEdge()"
          ></line>
        </template>
        <template #nodes>
          <g
            v-for="(node, nodeIndex) in data.nodes"
            :key="node.id"
            class="node"
          >
            <circle
              class="cursor-pointer hover:brightness-75"
              :class="{
                'stroke-black stroke-[4]': nodeIndex === visitingNodeIndex,
              }"
              :style="{ fill: getNodeColor(nodeIndex) }"
              :cx="node.x"
              :cy="node.y"
              r="10"
              @contextmenu.prevent="removeNode($event, node)"
              @mousedown.exact="beginDrawEdge($event, node)"
              @mouseup.exact="endDrawEdge($event, node)"
              @mouseenter="highlightNode($event, node)"
              @mouseleave="unhighlightNode()"
            >
            </circle>
            <text class="select-none" dx="12" dy="6" :x="node.x" :y="node.y">
              {{ node.id }}
            </text>
          </g>
        </template>
        <template #nodeTooltip="{ hoverNodeInfo }">
          <div class="flex flex-col">
            <p>
              <span class="font-bold">Node ID: </span>
              {{ hoverNodeInfo?.id }}
            </p>
            <p>
              <span class="font-bold">Traversal Order: </span
              >{{
                traversal.findIndex((index) => index === hoverNodeInfo?.index) +
                1
              }}
            </p>
          </div>
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
        @go-next-step="goNextStep"
        @go-prev-step="goPrevStep"
        @generate-random-graph="onGenerateRandomGraph(10, 12)"
      />
      <p>
        queue:
        {{
          algorithmRecords![
            visitingTraversalIndex === null
              ? 0
              : (visitingTraversalIndex ?? 0) + 1
          ]?.map((i) => data.nodes[i].id) || []
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
import type { NodeDatum, GraphData } from '@/composables/useD3'

definePageMeta({
  name: 'Breadth-First Search',
  path: '/tutorial/algorithm/breadth-first-search',
  pageOrder: 2,
})

const activeTab = ref(0)

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
const isDirected = ref(false)

const {
  clearData,
  generateRandomData,
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
  edgesCords,
} = useD3(initData, svg, {}, isDirected)

enableDrag()

/** Traversal start node index, -1 when no node */
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
  goNextStep,
  goPrevStep,
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

const { getNodeColor, getEdgeColor } = useAlgorithmColors({
  visitedNodeIndices,
  colors,
  isDirected,
  walk,
})

const onGenerateRandomGraph = (nodeCount = 6, edgeCount = 8) => {
  generateRandomData(nodeCount, edgeCount)
  traversalStartNodeIndex.value = 0
}
</script>

<style scoped>
line {
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
