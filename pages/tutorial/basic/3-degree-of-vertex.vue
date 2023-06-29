<template>
  <div class="grid grid-cols-[auto_1fr] gap-4 p-4 h-full overflow-y-auto">
    <div class="h-full overflow-y-auto p-4 bg-base-200 rounded-lg">
      <ContentDoc
        class="prose prose-sm xl:prose-base"
        path="basic/degree-of-vertex"
      />
    </div>
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
    >
      <template #info>
        <ul class="flex flex-col gap-2 p-4 rounded-lg bg-base-100">
          <li class="font-bold">
            Complete:
            <code class="font-normal">{{ graphProperties.isComplete }}</code>
          </li>
        </ul>
      </template>
      <template #edges>
        <line
          v-for="(edge, edgeIndex) in data.edges"
          :key="`${(edge.source as NodeDatum).id}-${(edge.target as NodeDatum).id}`"
          class="stroke-black stroke-[4] hover:cursor-pointer hover:stroke-red-400"
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
          <text class="select-none" dx="12" dy="6" :x="node.x" :y="node.y">
            {{ node.degree }}
          </text>
        </g>
      </template>
      <template #nodeTooltip="{ hoverNodeInfo }">
        <div class="flex flex-col">
          <p v-show="isDirected">
            <span class="font-bold">In-Degree</span>:
            {{ hoverNodeInfo?.inDegree ?? 0 }}
          </p>
          <p v-show="isDirected">
            <span class="font-bold">Out-Degree</span>:
            {{ hoverNodeInfo?.outDegree ?? 0 }}
          </p>
          <p v-show="!isDirected">
            <span class="font-bold">Degree</span>:
            {{ hoverNodeInfo?.degree ?? 0 }}
          </p>
        </div>
      </template>
    </D3Svg>
  </div>
</template>

<script setup lang="ts">
import type { NodeDatum, GraphData } from '@/composables/useD3'

definePageMeta({
  name: 'Degree of Vertex',
  path: '/tutorial/basic/degree-of-vertex',
  pageOrder: 3,
})

const initData: GraphData = {
  nodes: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
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
  hoverNode,
  mousedownNode,
  drawEdgeCords,
  beginDrawEdge,
  updateDrawEdge,
  endDrawEdge,
  hideDrawEdge,
  removeEdge,
  data,
  colors,
  edgesCords,
  enableDrag,
  graphProperties,
} = useD3(initData, svg, {}, isDirected)
enableDrag()

// Only show one edge when isDirected is false
const filteredEdges = computed(() => {
  if (isDirected.value) return data.edges

  const edgeSet = new Set<string>()
  return data.edges.filter((edge) => {
    const sourceId = (edge.source as NodeDatum).id
    const targetId = (edge.target as NodeDatum).id
    const key =
      sourceId < targetId
        ? `${sourceId}-${targetId}`
        : `${targetId}-${sourceId}`
    if (edgeSet.has(key)) return false
    edgeSet.add(key)
    return true
  })
})

watch(
  [() => filteredEdges.value.length, () => data.nodes.length],
  () => {
    data.nodes.forEach((node) => {
      node.degree = 0
      node.inDegree = 0
      node.outDegree = 0
    })
    filteredEdges.value.forEach((edge) => {
      const source = edge.source as NodeDatum
      const target = edge.target as NodeDatum
      source.degree = (source.degree ?? 0) + 1
      source.outDegree = (source.outDegree ?? 0) + 1
      target.degree = (target.degree ?? 0) + 1
      target.inDegree = (target.inDegree ?? 0) + 1
    })
  },
  { immediate: true }
)
</script>
