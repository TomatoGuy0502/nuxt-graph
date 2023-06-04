<template>
  <div class="flex gap-4 p-4">
    <D3Svg
      :width="width"
      :height="height"
      :has-mouse-down-node="!!mousedownNode"
      :draw-edge-cords="drawEdgeCords"
      :on-clear-data="clearData"
      :on-svg-mousedown="addNode"
      :on-svg-mousemove="updateDrawEdge"
      :on-svg-mouseup="hideDrawEdge"
      :on-svg-mouseleave="hideDrawEdge"
    >
      <template #edges>
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="14"
            refY="5"
            markerWidth="4"
            markerHeight="4"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>
        <line
          v-for="edge in data.edges"
          :key="`${(edge.source as NodeDatum).id}-${(edge.target as NodeDatum).id}`"
          class="stroke-[4] stroke-black hover:stroke-red-400 hover:stroke-[4] hover:cursor-pointer"
          :x1="(edge.source as NodeData).x"
          :y1="(edge.source as NodeData).y"
          :x2="(edge.target as NodeData).x"
          :y2="(edge.target as NodeData).y"
          marker-end="url(#arrow)"
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
definePageMeta({
  name: 'Directed Graph',
  path: '/tutorial/basic/directed-graph',
  pageOrder: 4,
})

interface NodeData extends d3.SimulationNodeDatum {
  id: number
}

interface EdgeData extends d3.SimulationLinkDatum<NodeData> {}

interface GraphData {
  nodes: NodeData[]
  edges: EdgeData[]
}

const initData: GraphData = {
  nodes: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
  edges: [
    { source: 0, target: 1 },
    { source: 0, target: 2 },
  ],
}

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
  width,
  height,
} = useD3(initData, { linkDistance: 60, chargeStrength: -200 })
</script>

<style scoped>
line {
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
