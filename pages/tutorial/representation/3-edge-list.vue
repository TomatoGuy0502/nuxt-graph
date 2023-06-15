<template>
  <div
    class="grid grid-cols-[1fr_1fr] grid-rows-[1fr_auto] gap-4 p-4 h-full overflow-y-auto"
  >
    <div
      class="h-full overflow-y-auto col-span-1 row-span-2 p-4 bg-base-200 rounded-lg"
    >
      <ContentDoc
        class="prose prose-sm xl:prose-base max-w-none"
        path="basic/vertex-and-edge"
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
    >
      <template #edges>
        <line
          v-for="(edge, i) in data.edges"
          :key="`${(edge.source as NodeDatum).id}-${(edge.target as NodeDatum).id}`"
          class="stroke-black stroke-[5] hover:cursor-pointer hover:stroke-red-400"
          :class="{ 'is-directed': isDirected }"
          :x1="edgesCords[i].x1"
          :y1="edgesCords[i].y1"
          :x2="edgesCords[i].x2"
          :y2="edgesCords[i].y2"
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
            <title>Node ID: {{ node.id }}</title>
          </circle>
          <text
            class="select-none pointer-events-none font-mono text-sm"
            style="alignment-baseline: central; text-anchor: middle"
            :x="node.x"
            :y="node.y"
          >
            {{ node.id }}
          </text>
        </g>
      </template>
    </D3Svg>
    <div class="flex flex-col gap-2 p-2 rounded-lg bg-base-300 w-fit">
      <h2 class="font-bold">Edge List</h2>
      <!-- TODO: only show one edge when isDirected is false -->
      <ul class="flex font-mono flex-wrap">
        [
        <li
          v-for="(edge, i) in data.edges"
          :key="`${(edge.source as NodeDatum).id}-${(edge.target as NodeDatum).id}`"
          class="flex"
        >
          <code
            class="rounded px-0.5 transition"
            :class="{ 'bg-base-300': hoverEdge === edge }"
            >[{{ (edge.source as NodeDatum).id }},{{
              (edge.target as NodeDatum).id
            }}]</code
          >
          <code v-if="i !== data.edges.length - 1">,</code>
        </li>
        ]
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'Edge List',
  path: '/tutorial/representation/edge-list',
  pageOrder: 3,
})

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
} = useD3(initData, svg, {}, isDirected)

enableDrag()

// Edge List with order
// const edgeList = computed(() => {
//   data.edges.map((edge) => {
//     const source = edge.source as NodeDatum
//     const target = edge.target as NodeDatum
//     if (source.id > target.id) {
//       edge.source = target
//       edge.target = source
//     }
//   })
// })
</script>

<style scoped></style>
