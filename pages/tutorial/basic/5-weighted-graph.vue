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
      :is-draggable="true"
    >
      <template #edges>
        <g
          v-for="edge in data.edges"
          :key="`${(edge.source as NodeDatum).id}-${(edge.target as NodeDatum).id}`"
        >
          <line
            class="stroke-black stroke-[4] hover:cursor-pointer hover:stroke-red-400"
            :x1="(edge.source as NodeDatum).x"
            :y1="(edge.source as NodeDatum).y"
            :x2="(edge.target as NodeDatum).x"
            :y2="(edge.target as NodeDatum).y"
            @contextmenu.prevent="removeEdge($event, edge)"
          ></line>
          <rect
            class="pointer-events-none fill-gray-300"
            width="20"
            height="20"
            rx="2"
            :x="(((edge.source as NodeDatum).x as number) + ((edge.target as NodeDatum).x as number)) / 2 - 10"
            :y="(((edge.source as NodeDatum).y as number) + ((edge.target as NodeDatum).y as number)) / 2 - 10"
          />
          <text
            class="pointer-events-none select-none font-mono"
            dx="-4.5"
            dy="0"
            alignment-baseline="central"
            :x="(((edge.source as NodeDatum).x as number) + ((edge.target as NodeDatum).x as number)) / 2"
            :y="(((edge.source as NodeDatum).y as number) + ((edge.target as NodeDatum).y as number)) / 2"
          >
            {{ edge.weight }}
          </text>
        </g>
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
            @mouseup.exact="endDrawEdgeWithRandomWeight($event, node)"
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
  name: 'Weighted Graph',
  path: '/tutorial/basic/weighted-graph',
  pageOrder: 5,
})

interface NodeDatum extends d3.SimulationNodeDatum {
  id: number
}

interface EdgeDatum extends d3.SimulationLinkDatum<NodeDatum> {
  weight: number
}

interface GraphData {
  nodes: NodeDatum[]
  edges: EdgeDatum[]
}

const initData: GraphData = {
  nodes: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
  edges: [
    { source: 0, target: 1, weight: 3 },
    { source: 0, target: 2, weight: 3 },
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
  endDrawEdgeWithRandomWeight,
  hideDrawEdge,
  removeEdge,
  data,
  colors,
  width,
  height,
  enableDrag,
} = useD3(initData, { linkDistance: 70, chargeStrength: -200 })

enableDrag()
</script>

<style scoped>
line {
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
