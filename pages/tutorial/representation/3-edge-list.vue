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
        <line
          v-for="edge in data.edges"
          :key="`${edge.source}-${edge.target}`"
          class="stroke-[5] stroke-black hover:stroke-red-400 hover:cursor-pointer"
          :x1="(edge.source as NodeDatum).x"
          :y1="(edge.source as NodeDatum).y"
          :x2="(edge.target as NodeDatum).x"
          :y2="(edge.target as NodeDatum).y"
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
          <text class="select-none" dx="12" dy="6" :x="node.x" :y="node.y">
            {{ node.id }}
          </text>
        </g>
      </template>
    </D3Svg>
    <div>
      <p>Edge List</p>
      <ul class="flex font-mono">
        [
        <li
          v-for="(edge, i) in data.edges"
          :key="`${edge.source}-${edge.target}`"
          class="flex"
        >
          <code
            class="px-0.5 transition rounded"
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
  highlightEdge,
  unhighlightEdge,
  hoverEdge,
} = useD3(initData)

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

<style scoped>
line {
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
