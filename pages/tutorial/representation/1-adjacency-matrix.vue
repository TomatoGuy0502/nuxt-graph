<template>
  <div
    class="grid grid-cols-[auto_1fr] grid-rows-[1fr_auto] gap-4 p-4 h-full overflow-y-auto"
  >
    <div
      class="h-full overflow-y-auto col-span-1 row-span-2 p-4 bg-base-200 rounded-lg"
    >
      <ContentDoc
        class="prose prose-sm xl:prose-base"
        path="representation/adjacency-matrix"
      />
    </div>
    <D3Svg
      ref="svg"
      v-model:is-directed="isDirected"
      v-model:is-showing-index="isShowingIndex"
      :can-toggle-directed="true"
      :can-toggle-showing-index="false"
      :has-mouse-down-node="!!mousedownNode"
      :draw-edge-cords="drawEdgeCords"
      :on-clear-data="clearData"
      :on-svg-mousedown="addNode"
      :on-svg-mousemove="updateDrawEdge"
      :on-svg-mouseup="hideDrawEdge"
      :on-svg-mouseleave="hideDrawEdge"
      :is-draggable="true"
      :hover-node="hoverNode"
    >
      <template #edges>
        <line
          v-for="(edge, edgeIndex) in data.edges"
          :key="`${(edge.source as NodeDatum).id}-${(edge.target as NodeDatum).id}`"
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
            class="select-none pointer-events-none font-mono text-sm"
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
    <div
      class="flex flex-col gap-2 p-2 rounded-lg bg-base-300 overflow-x-auto w-fit"
    >
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
    </div>
  </div>
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
</script>

<style scoped></style>
