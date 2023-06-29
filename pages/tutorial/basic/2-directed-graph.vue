<template>
  <div class="grid grid-cols-[auto_1fr] gap-4 p-4 h-full overflow-y-auto">
    <div class="h-full overflow-y-auto p-4 bg-base-200 rounded-lg">
      <ContentDoc
        class="prose prose-sm xl:prose-base"
        path="basic/directed-graph"
      />
    </div>
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
      :is-directed="isDirected"
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
          <!-- <text class="select-none" dx="12" dy="6" :x="node.x" :y="node.y">
            {{ node.id }}
          </text> -->
        </g>
      </template>
    </D3Svg>
  </div>
</template>

<script setup lang="ts">
import type { NodeDatum, GraphData } from '@/composables/useD3'

definePageMeta({
  name: 'Directed Graph',
  path: '/tutorial/basic/directed-graph',
  pageOrder: 2,
})

const initData: GraphData = {
  nodes: [{ id: 0 }, { id: 1 }, { id: 2 }],
  edges: [
    { source: 0, target: 1 },
    { source: 0, target: 2 },
    { source: 1, target: 0 },
  ],
}

const svg = ref<HTMLDivElement | null>(null)
const isDirected = ref(true)

const {
  clearData,
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
  edgesCords,
} = useD3(initData, svg, { linkDistance: 80, chargeStrength: -300 }, isDirected)

enableDrag()
</script>
