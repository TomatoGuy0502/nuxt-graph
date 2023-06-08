<template>
  <div class="flex gap-4 p-4 h-full overflow-y-auto">
    <div class="h-full overflow-y-auto p-4 bg-base-200 rounded-lg flex-1">
      <ContentDoc
        class="prose prose-sm xl:prose-base max-w-none"
        path="basic/vertex-and-edge"
      />
    </div>
    <D3Svg
      ref="svg"
      :width="600"
      :height="600"
      :is-draggable="true"
      :svg-class="['cursor-default']"
      :on-clear-data="resetData"
    >
      <template #hint>
        <li>Root vertex can't be deleted</li>
        <li><b>Hover</b> on vertex to see the details</li>
        <li><b>Left click</b> on vertex to add a child</li>
        <li><b>Right click</b> on vertex/edge to delete it</li>
        <li>
          <kbd v-if="isMac" class="kbd kbd-sm">⌘</kbd>
          <kbd v-else class="kbd kbd-sm">ctrl</kbd> + <b>Drag</b> on vertex to
          move it
        </li>
      </template>
      <template #edges>
        <line
          v-for="edge in data.edges"
          :key="`${(edge.source as NodeDatum).id}-${(edge.target as NodeDatum).id}`"
          class="stroke-black stroke-[4] hover:cursor-pointer hover:stroke-red-400"
          :x1="(edge.source as NodeDatum).x"
          :y1="(edge.source as NodeDatum).y"
          :x2="(edge.target as NodeDatum).x"
          :y2="(edge.target as NodeDatum).y"
          @contextmenu.prevent="removeEdgeAndSubTree($event, edge)"
        ></line>
      </template>
      <template #nodes>
        <g class="node">
          <circle
            class="cursor-cell hover:brightness-75"
            :style="{ fill: colors[0] }"
            :cx="data.nodes[0].x"
            :cy="data.nodes[0].y"
            r="10"
            @contextmenu.prevent="removeSubTree($event, data.nodes[0])"
            @click.exact="addLeafNode($event, data.nodes[0])"
            @mouseenter="highlightNode($event, data.nodes[0])"
            @mouseleave="unhighlightNode()"
          >
            <title
              v-text="
                `Node ID: ${data.nodes[0].id} \nNode Depth: ${data.nodes[0].depth}`
              "
            ></title>
          </circle>
          <text
            class="pointer-events-none select-none"
            dx="12"
            dy="6"
            :x="data.nodes[0].x"
            :y="data.nodes[0].y"
          >
            Root
          </text>
        </g>
        <g v-for="node in data.nodes.slice(1)" :key="node.id" class="node">
          <circle
            class="hover:brightness-75"
            :class="[isCtrlOrCmdPressed ? 'cursor-move' : 'cursor-cell']"
            :style="{ fill: colors[node.depth % 10] }"
            :cx="node.x"
            :cy="node.y"
            r="10"
            @contextmenu.prevent="removeSubTree($event, node)"
            @click.exact="addLeafNode($event, node)"
            @mouseenter="highlightNode($event, node)"
            @mouseleave="unhighlightNode()"
          >
            <title
              v-text="`Node ID: ${node.id} \nNode Depth: ${node.depth}`"
            ></title>
          </circle>
          <!-- <text
            class="select-none pointer-events-none"
            dx="12"
            dy="6"
            :x="node.x"
            :y="node.y"
          >
            {{ node.id }}
          </text> -->
        </g>
      </template>
    </D3Svg>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'Rooted Tree',
  path: '/tutorial/basic/rooted-tree',
  pageOrder: 7,
})

interface NodeDatum extends d3.SimulationNodeDatum {
  id: number
  depth: number
}

interface EdgeDatum extends d3.SimulationLinkDatum<NodeDatum> {}

interface GraphData {
  nodes: NodeDatum[]
  edges: EdgeDatum[]
}

const initData: GraphData = {
  nodes: [
    { id: 0, fx: 300, fy: 20, depth: 0 },
    { id: 1, depth: 1 },
    { id: 2, depth: 1 },
  ],
  edges: [
    { source: 0, target: 1 },
    { source: 0, target: 2 },
  ],
}

const svg = ref<HTMLDivElement | null>(null)

const {
  clearData,
  addLeafNode,
  removeSubTree,
  highlightNode,
  unhighlightNode,
  removeEdge,
  data,
  colors,
  enableDrag,
} = useD3(initData, svg, {
  linkDistance: 30,
  // linkStrength: 1,
  chargeStrength: -50,
  chargeDistanceMaxRatio: 0.25,
  forceXRatioOfWidth: 0.5,
  forceXStrength: 0,
  forceYRatioOfHeight: 1,
  forceYStrength: 0.01,
})

enableDrag()

const { isCtrlOrCmdPressed } = useCtrl()
const { isMac } = usePlatform()

const resetData = () => {
  clearData()
  data.nodes.push({ id: 0, fx: 300, fy: 20, depth: 0 })
}

const removeEdgeAndSubTree = (
  _event: PointerEvent | MouseEvent,
  edge: EdgeDatum
) => {
  removeEdge(_event, edge)
  removeSubTree(_event, edge.target as NodeDatum)
}
</script>

<style scoped>
line {
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
