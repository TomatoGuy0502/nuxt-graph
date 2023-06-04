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
        <line
          v-for="edge in data.edges"
          :key="`${(edge.source as NodeDatum).id}-${(edge.target as NodeDatum).id}`"
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
      <p>Adjacency Matrix</p>
      <D3AdjacencyMatrix
        :adjacency-matrix="adjacencyMatrix"
        :hover-node="hoverNode"
        :hover-edge="hoverEdge"
        :node-ids="data.nodes.map((node) => node.id)"
      />
      <p>Adjacency List</p>
      <D3AdjacencyList
        :hover-node="hoverNode"
        :hover-edge="hoverEdge"
        :adjacency-list="adjacencyList"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import * as d3 from 'd3'

definePageMeta({
  name: 'Playground',
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
  hoverNode,
  hoverEdge,
  highlightEdge,
  unhighlightEdge,
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
  adjacencyMatrix,
  adjacencyList,
  enableDrag,
} = useD3(initData)

enableDrag()

// const adjacencyMatrixOutput = computed(() => {
//   const n = data.nodes.length
//   let output = ''
//   for (let i = 0; i < n; i++) {
//     const id = data.nodes[i].id
//     output += `${id} [${adjacencyMatrix.value[i].join(', ')}]`
//     if (i < n - 1) {
//       output += '\n'
//     }
//   }
//   return output
// })

// const adjacencyListOutput = computed(() => {
//   const n = data.nodes.length

//   let output = ''
//   const adjacencyList = adjacencyMatrix.value.map((arr) =>
//     arr.map((n, i) => (n ? data.nodes[i].id : 0)).filter(Boolean)
//   )
//   for (let i = 0; i < n; i++) {
//     const id = data.nodes[i].id
//     output += `${id} [${adjacencyList[i].join(', ')}]`
//     if (i < n - 1) {
//       output += '\n'
//     }
//   }
//   return output
// })
</script>

<style scoped>
line {
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
