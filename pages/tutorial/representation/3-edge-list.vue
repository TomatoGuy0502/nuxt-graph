<template>
  <div
    class="grid grid-cols-[auto_1fr] grid-rows-[1fr_auto] gap-4 p-4 h-full overflow-y-auto"
  >
    <div
      class="h-full overflow-y-auto col-span-1 row-span-2 p-4 bg-base-200 rounded-lg"
    >
      <ContentDoc
        class="prose prose-sm xl:prose-base"
        path="representation/edge-list"
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
          :style="{}"
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
    <div class="flex flex-col gap-2 p-2 rounded-lg bg-base-300 w-fit">
      <h2 class="font-bold">Edge List</h2>
      <ul class="flex font-mono flex-wrap">
        [
        <li
          v-for="(edge, i) in sortedEdges"
          :key="`${(edge.source as NodeDatum).id}-${(edge.target as NodeDatum).id}`"
          class="flex"
        >
          <code
            class="rounded px-0.5 transition"
            :class="{ 'bg-gray-700': isHighlightedEdge(edge) }"
            >[{{
              isShowingIndex
                ? (edge.source as NodeDatum).index
                : (edge.source as NodeDatum).id
            }},{{
              isShowingIndex
                ? (edge.target as NodeDatum).index
                : (edge.target as NodeDatum).id
            }}]</code
          >
          <code v-if="i !== sortedEdges.length - 1">,</code>
        </li>
        ]
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NodeDatum, EdgeDatum, GraphData } from '@/composables/useD3'

definePageMeta({
  name: 'Edge List',
  path: '/tutorial/representation/edge-list',
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
  mousedownNode,
  drawEdgeCords,
  beginDrawEdge,
  updateDrawEdge,
  endDrawEdge,
  hideDrawEdge,
  removeEdge,
  data,
  colors,
  highlightEdge,
  unhighlightEdge,
  hoverEdge,
  edgesCords,
  enableDrag,
  hoverNode,
} = useD3(initData, svg, {}, isDirected)

enableDrag()

// Only show one edge in edge list when isDirected is false
const edges = computed(() => {
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

// Sort edges by source id then target id
const sortedEdges = computed(() => {
  return [...edges.value].sort((a, b) => {
    const sourceA = (a.source as NodeDatum).id
    const sourceB = (b.source as NodeDatum).id
    if (sourceA !== sourceB) return sourceA - sourceB
    const targetA = (a.target as NodeDatum).id
    const targetB = (b.target as NodeDatum).id
    return targetA - targetB
  })
})

const isHighlightedEdge = (edge: EdgeDatum) => {
  const hoverEdgeSourceNodeIndex = (
    hoverEdge.value?.source as NodeDatum | undefined
  )?.index
  const hoverEdgeTargetNodeIndex = (
    hoverEdge.value?.target as NodeDatum | undefined
  )?.index
  const sourceNodeIndex = (edge.source as NodeDatum).index
  const targetNodeIndex = (edge.target as NodeDatum).index
  return (
    (hoverEdgeSourceNodeIndex === sourceNodeIndex &&
      hoverEdgeTargetNodeIndex === targetNodeIndex) ||
    (!isDirected.value &&
      hoverEdgeSourceNodeIndex === targetNodeIndex &&
      hoverEdgeTargetNodeIndex === sourceNodeIndex)
  )
}

const isShowingIndex = ref(true)
</script>

<style scoped></style>
