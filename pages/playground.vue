<template>
  <div class="flex gap-4 p-4">
    <div class="relative">
      <button class="btn btn-sm absolute right-4 top-4" @click="clearData">
        Clear
      </button>
      <svg
        ref="svg"
        :width="width"
        :height="height"
        class="cursor-cell bg-gray-100"
        @mousedown="addNode($event)"
        @mousemove="updateDrawEdge($event)"
        @mouseup="hideDrawEdge()"
        @mouseleave="hideDrawEdge()"
        @contextmenu.prevent
      >
        <line
          class="draw-edge cursor-cell stroke-[3]"
          :class="[mousedownNode ? 'stroke-current' : 'stroke-none']"
          :x1="drawEdgeCords.x1"
          :y1="drawEdgeCords.y1"
          :x2="drawEdgeCords.x2"
          :y2="drawEdgeCords.y2"
        ></line>
        <g class="edges">
          <line
            v-for="edge in data.edges"
            :key="`${edge.source}-${edge.target}`"
            class="stroke-[3] stroke-black hover:stroke-red-400 hover:stroke-[4] hover:cursor-pointer"
            :x1="(edge.source as NodeData).x"
            :y1="(edge.source as NodeData).y"
            :x2="(edge.target as NodeData).x"
            :y2="(edge.target as NodeData).y"
            @contextmenu.prevent="removeEdge($event, edge)"
            @mousedown.stop
          ></line>
        </g>
        <g class="nodes">
          <g v-for="node in data.nodes" :key="node.id" class="node">
            <circle
              class="cursor-pointer hover:opacity-80"
              :style="{ fill: colors[node.id % 10] }"
              :cx="node.x"
              :cy="node.y"
              r="10"
              @contextmenu.prevent="removeNode($event, node)"
              @mousedown.prevent.stop="beginDrawEdge($event, node)"
              @mouseup="endDrawEdge($event, node)"
              @mouseenter="highlightNode($event, node)"
              @mouseleave="unhighlightNode()"
            >
              <title>Node ID: {{ node.id }}</title>
            </circle>
            <text class="select-none" dx="12" dy="6" :x="node.x" :y="node.y">
              {{ node.id }}
            </text>
          </g>
        </g>
      </svg>
    </div>
    <div>
      <p>Adjacency Matrix</p>
      <ul class="flex flex-col">
        <li
          v-for="(row, i) in adjacencyMatrix"
          :key="i"
          class="flex rounded px-1 py-0.5 transition"
          :class="{ 'bg-base-300': hoverNode?.index === i }"
        >
          <pre>{{ data.nodes[i].id }} </pre>
          <code>[{{ row.join(', ') }}]</code>
        </li>
      </ul>

      <p>Adjacency List</p>
      <!-- <pre>{{ adjacencyListOutput }}</pre> -->
      <ul class="flex flex-col">
        <li
          v-for="(row, i) in adjacencyMatrix"
          :key="i"
          class="flex rounded px-1 py-0.5 transition w-fit"
          :class="{ 'bg-base-300': hoverNode?.index === i }"
        >
          <pre>{{ data.nodes[i].id }} </pre>
          <code
            >[{{
              row
                .map((n, i) => (n ? data.nodes[i].id : -1))
                .filter((n) => n !== -1)
                .join(', ')
            }}]</code
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as d3 from 'd3'

definePageMeta({
  name: 'Playground',
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
  hoverNode,
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
} = useD3(initData)

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
