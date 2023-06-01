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
          class="stroke-[4] stroke-black hover:stroke-red-400 hover:stroke-[4] hover:cursor-pointer"
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
          <text class="select-none" dx="12" dy="6" :x="node.x" :y="node.y">
            {{ node.degree }}
          </text>
        </g>
      </template>
    </D3Svg>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'Degree of Vertex',
  path: '/tutorial/basic/degree-of-vertex',
  pageOrder: 2,
})

interface NodeDatum extends d3.SimulationNodeDatum {
  id: number
  degree?: number
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
} = useD3(initData)

watch(
  [() => data.edges.length, () => data.nodes.length],
  () => {
    data.nodes.forEach((node) => {
      node.degree = 0
    })
    data.edges.forEach((edge) => {
      const source = edge.source as NodeDatum
      const target = edge.target as NodeDatum
      source.degree = (source.degree ?? 0) + 1
      target.degree = (target.degree ?? 0) + 1
    })
  },
  { immediate: true }
)
</script>

<style scoped>
line {
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
