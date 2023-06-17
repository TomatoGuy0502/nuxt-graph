<template>
  <div class="grid grid-cols-[1fr_1fr] gap-4 p-4 h-full overflow-y-auto">
    <div class="h-full overflow-y-auto p-4 bg-base-200 rounded-lg">
      <ContentDoc
        class="prose prose-sm xl:prose-base max-w-none"
        path="basic/vertex-and-edge"
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
    >
      <template #edges>
        <line
          v-for="edge in data.edges"
          :key="`${(edge.source as NodeDatum).id}-${(edge.target as NodeDatum).id}`"
          class="stroke-black stroke-[4] hover:cursor-pointer hover:stroke-red-400"
          :x1="(edge.source as NodeDatum).x"
          :y1="(edge.source as NodeDatum).y"
          :x2="(edge.target as NodeDatum).x"
          :y2="(edge.target as NodeDatum).y"
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
            <title>Node ID: {{ node.id }}</title>
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
  name: 'Vertex and Edge',
  path: '/tutorial/basic/vertex-and-edge',
  pageOrder: 1,
})

const initData: GraphData = {
  nodes: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
  edges: [
    { source: 0, target: 1 },
    { source: 0, target: 2 },
  ],
}

const svg = ref<HTMLDivElement | null>(null)

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
} = useD3(initData, svg)

enableDrag()
</script>

<style scoped>
line {
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
