<template>
  <div class="flex gap-4 p-4">
    <div class="relative">
      <div class="flex gap-2 absolute right-4 top-4">
        <div class="dropdown dropdown-hover dropdown-end">
          <label tabindex="0" class="btn btn-sm btn-square mb-1"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
              /></svg
          ></label>
          <div
            tabindex="0"
            class="dropdown-content card card-compact w-96 bg-base-100 shadow-xl"
          >
            <div class="card-body">
              <h2 class="card-title">How to interact?</h2>
              <ul class="list-disc list-inside">
                <li><b>Left click</b> on empty space to add vertex</li>
                <li><b>Drag</b> from one vertex to another to add edge</li>
                <li><b>Right click</b> on vertex/edge to delete it</li>
              </ul>
            </div>
          </div>
        </div>
        <button class="btn btn-sm" @click="clearData">Clear</button>
      </div>
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
            class="stroke-[4] stroke-black hover:stroke-red-400 hover:stroke-[4] hover:cursor-pointer"
            :x1="(edge.source as NodeData).x"
            :y1="(edge.source as NodeData).y"
            :x2="(edge.target as NodeData).x"
            :y2="(edge.target as NodeData).y"
            marker-end="url(#arrow)"
            @contextmenu.prevent="removeEdge($event, edge)"
            @mousedown.stop
          ></line>
        </g>
        <g class="nodes">
          <g v-for="node in data.nodes" :key="node.id" class="node">
            <circle
              class="cursor-pointer hover:brightness-75"
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
            <!-- <text class="select-none" dx="12" dy="6" :x="node.x" :y="node.y">
              {{ node.id }}
            </text> -->
          </g>
        </g>
      </svg>
    </div>
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
