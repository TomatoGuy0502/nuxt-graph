<template>
  <NuxtLayout name="basic">
    <template #content>
      <ContentDoc
        class="prose-sm prose w-full xl:prose-base"
        path="basic/rooted-tree"
      />
    </template>
    <template #svg>
      <D3Svg
        ref="svg"
        class="flex-1"
        :height="600"
        :is-draggable="true"
        :svg-class="['cursor-default']"
        :hover-node="hoverNode"
        @clear-data="resetData"
      >
        <template #info>
          <ul class="flex flex-col gap-2 rounded-lg bg-base-300 p-4">
            <li class="font-bold">
              Tree height:
              <code class="font-normal">{{ treeHeight }}</code>
            </li>
            <li class="font-bold">
              Number of leaves:
              <code class="font-normal">{{ numberOfLeaves }}</code>
            </li>
          </ul>
        </template>
        <template #clear-button-text>Reset</template>
        <template #hint>
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
            :key="`${(edge.source as NodeDatum).id}-${
              (edge.target as NodeDatum).id
            }`"
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
              :style="{ fill: colors[node.depth! % 10] }"
              :cx="node.x"
              :cy="node.y"
              r="10"
              @contextmenu.prevent="removeSubTree($event, node)"
              @click.exact="addLeafNode($event, node)"
              @mouseenter="highlightNode($event, node)"
              @mouseleave="unhighlightNode()"
            >
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
        <template #nodeTooltip="{ hoverNodeInfo }">
          <p>
            <span class="font-bold">Depth</span>:
            {{ hoverNodeInfo?.depth ?? 0 }}
          </p>
        </template>
      </D3Svg>
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NodeDatum, EdgeDatum, GraphData } from '@/composables/useD3'

definePageMeta({
  name: 'Rooted Tree',
  path: '/tutorial/basic/rooted-tree',
  pageOrder: 7,
})

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
  adjacencyList,
  data,
  colors,
  hoverNode,
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
  isRootedTree: true,
})

enableDrag(
  (event: PointerEvent | MouseEvent, d: NodeDatum) =>
    (event.metaKey || event.ctrlKey) && event.button === 0 && d.id !== 0
)

const { isCtrlOrCmdPressed } = useCtrl()
const { isMac } = usePlatform()

const resetData = () => {
  clearData({ keepRoot: true })
}

const removeEdgeAndSubTree = (
  _event: PointerEvent | MouseEvent,
  edge: EdgeDatum
) => {
  removeEdge(_event, edge)
  removeSubTree(_event, edge.target as NodeDatum)
}

const treeHeight = computed(() => {
  return data.nodes.reduce((maxDepth, node) => {
    return Math.max(maxDepth, node.depth ?? 0)
  }, 0)
})

const numberOfLeaves = computed(() => {
  // If a node has only one edge connected to it, it is a leaf node (except the root node)
  return data.nodes.slice(1).reduce((count, node) => {
    return count + (adjacencyList.value[node.id]?.length === 1 ? 1 : 0)
  }, 0)
})
</script>

<style scoped>
line {
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
