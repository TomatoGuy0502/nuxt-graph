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
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="12"
            refY="4"
            markerWidth="3"
            markerHeight="3"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 8 4 L 0 8 z" />
          </marker>
          <marker
            id="arrowHover"
            viewBox="0 0 10 10"
            refX="12"
            refY="4"
            markerWidth="3"
            markerHeight="3"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 8 4 L 0 8 z" fill="#f87171" />
          </marker>
        </defs>
        <line
          v-for="(edge, i) in data.edges"
          :key="`${(edge.source as NodeDatum).id}-${(edge.target as NodeDatum).id}`"
          class="stroke-black stroke-[5] hover:cursor-pointer hover:stroke-red-400"
          :x1="edgesCords[i].x1"
          :y1="edgesCords[i].y1"
          :x2="edgesCords[i].x2"
          :y2="edgesCords[i].y2"
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
    <div
      class="flex flex-col gap-2 p-2 rounded-lg bg-base-300 overflow-x-auto w-fit"
    >
      <h2 class="font-bold">Adjacency List</h2>
      <D3AdjacencyList
        :hover-node="hoverNode"
        :hover-edge="hoverEdge"
        :adjacency-list="adjacencyList"
        :node-ids="data.nodes.map((node) => node.id)"
        :is-directed="isDirected"
        class="max-h-[264px] max-w-[360px]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'Adjacency List',
  path: '/tutorial/representation/adjacency-list',
  pageOrder: 2,
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
  adjacencyList,
  hoverNode,
  hoverEdge,
  highlightEdge,
  unhighlightEdge,
  enableDrag,
  edgesCords,
} = useD3(initData, svg, {}, isDirected)

enableDrag()
</script>

<style scoped></style>
