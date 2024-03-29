<template>
  <NuxtLayout name="representation">
    <template #content>
      <ContentDoc
        class="prose-sm prose xl:prose-base"
        path="representation/adjacency-matrix"
      />
    </template>
    <template #svg>
      <D3Svg
        ref="svg"
        v-model:is-directed="isDirected"
        v-model:is-showing-index="isShowingIndex"
        class="flex-1"
        :can-toggle-directed="true"
        :can-toggle-showing-index="false"
        :has-mouse-down-node="!!mousedownNode"
        :draw-edge-cords="drawEdgeCords"
        :is-draggable="true"
        :hover-node="hoverNode"
        @clear-data="clearData"
        @svg-mousedown="addNode"
        @svg-mousemove="updateDrawEdge"
        @svg-mouseup="hideDrawEdge"
        @svg-mouseleave="hideDrawEdge"
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
            class="stroke-black stroke-[5] hover:cursor-pointer hover:stroke-red-400"
            :class="{ 'is-directed': isDirected }"
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
          <g v-for="node in data.nodes" :key="node.id" class="node">
            <circle
              class="cursor-pointer hover:brightness-75"
              :style="{ fill: colors[node.id % 10] }"
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
            <text
              class="pointer-events-none select-none font-mono text-sm"
              style="alignment-baseline: central; text-anchor: middle"
              :x="node.x"
              :y="node.y"
            >
              {{ isShowingIndex ? node.index : node.id }}
            </text>
          </g>
        </template>
        <template #nodeTooltip="{ hoverNodeInfo }">
          <div class="flex flex-col">
            <p>
              <span class="font-bold">Node Index</span>:
              {{ hoverNodeInfo?.index }}
            </p>
            <p>
              <span class="font-bold">Node ID</span>:
              {{ hoverNodeInfo?.id }}
            </p>
          </div>
        </template>
      </D3Svg>
    </template>
    <template #representation>
      <h2 class="font-bold">Adjacency Matrix</h2>
      <D3AdjacencyMatrix
        :adjacency-matrix="adjacencyMatrix"
        :hover-node="hoverNode"
        :hover-edge="hoverEdge"
        :node-ids="data.nodes.map((node) => node.id)"
        :is-directed="isDirected"
        :is-showing-index="isShowingIndex"
        class="max-h-[264px] max-w-[360px]"
      />
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NodeDatum, GraphData } from '@/composables/useD3'

definePageMeta({
  name: 'Adjacency Matrix',
  path: '/tutorial/representation/adjacency-matrix',
  pageOrder: 1,
})

const initData: GraphData = {
  nodes: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
  edges: [
    { source: 0, target: 1 },
    { source: 0, target: 2 },
  ],
}

const svg = ref<HTMLDivElement | null>(null)
const isDirected = ref(false)

const {
  clearData,
  addNode,
  removeNode,
  highlightNode,
  unhighlightNode,
  highlightEdge,
  unhighlightEdge,
  mousedownNode,
  drawEdgeCords,
  beginDrawEdge,
  updateDrawEdge,
  endDrawEdge,
  hideDrawEdge,
  removeEdge,
  data,
  colors,
  adjacencyMatrix,
  hoverNode,
  hoverEdge,
  enableDrag,
  edgesCords,
} = useD3(initData, svg, {}, isDirected)

enableDrag()

const isShowingIndex = ref(true)

const { finishedExercise } = useExercise()
const exercise1Ans = [
  [0, 1, 1, 1, 0],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0],
  [0, 1, 1, 0, 0],
]
const exercise2Ans = [
  [0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0],
  [0, 0, 0, 0, 1],
  [0, 1, 1, 0, 0],
]
const stopExercise = watchEffect(() => {
  if (
    finishedExercise.value === 0 &&
    JSON.stringify(adjacencyMatrix.value) === JSON.stringify(exercise1Ans)
  ) {
    finishedExercise.value = 1
  }
  if (
    finishedExercise.value === 1 &&
    JSON.stringify(adjacencyMatrix.value) === JSON.stringify(exercise2Ans)
  ) {
    finishedExercise.value = 2
    stopExercise()
  }
})
</script>

<style scoped></style>
