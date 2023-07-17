<template>
  <NuxtLayout name="basic">
    <template #content>
      <ContentDoc
        class="prose-sm prose xl:prose-base"
        path="basic/walk-trail-path-cycle"
      />
    </template>
    <template #svg>
      <D3Svg
        ref="svg"
        class="flex-1"
        :has-mouse-down-node="!!mousedownNode"
        :draw-edge-cords="drawEdgeCords"
        :is-draggable="true"
        @clear-data="resetData"
        @svg-mousedown="addNode"
        @svg-mousemove="updateDrawEdge"
        @svg-mouseup="hideDrawEdge"
        @svg-mouseleave="hideDrawEdge"
      >
        <template #extra-buttons>
          <button class="btn-sm btn" @click="walk.length = 0">
            Clear Walk
          </button>
        </template>
        <template #clear-button>Reset</template>
        <template #info>
          <ul class="flex flex-col gap-2 rounded-lg bg-base-100 p-4">
            <li class="max-w-[180px] font-bold">
              Walk:
              <code v-if="walk.length" class="font-normal">{{
                walk.join(' → ')
              }}</code>
              <code v-else class="font-normal">Empty</code>
            </li>
            <li class="font-bold">
              isWalk: <code class="font-normal">{{ isWalk }}</code>
            </li>
            <li class="font-bold">
              isTrail: <code class="font-normal">{{ isTrail }}</code>
            </li>
            <li class="font-bold">
              isPath: <code class="font-normal">{{ isPath }}</code>
            </li>
            <li class="font-bold">
              isCycle: <code class="font-normal">{{ isCycle }}</code>
            </li>
          </ul>
        </template>
        <template #hint-start>
          <li><b>Click</b> on vertex to start a walk</li>
        </template>
        <template #edges>
          <line
            v-for="(edge, edgeIndex) in data.edges"
            :key="`${(edge.source as NodeDatum).id}-${
              (edge.target as NodeDatum).id
            }`"
            class="stroke-[5] hover:cursor-pointer hover:brightness-75"
            :class="getEdgeColor(edge)"
            :x1="edgesCords[edgeIndex].x1"
            :y1="edgesCords[edgeIndex].y1"
            :x2="edgesCords[edgeIndex].x2"
            :y2="edgesCords[edgeIndex].y2"
            @contextmenu.prevent="handleRemoveEdge($event, edge)"
          ></line>
        </template>
        <template #nodes>
          <g
            v-for="(node, nodeIndex) in data.nodes"
            :key="node.id"
            class="node"
          >
            <circle
              class="cursor-pointer hover:brightness-75"
              :class="{
                'stroke-black stroke-[4]': node.id === lastWalkNodeId,
              }"
              :style="{ fill: getNodeColor(node.id) }"
              :cx="node.x"
              :cy="node.y"
              r="10"
              @contextmenu.prevent="handleRemoveNode($event, node)"
              @mousedown.exact="beginDrawEdge($event, node)"
              @mouseup.exact="endDrawEdge($event, node)"
              @click.exact="handleWalk(node.id, nodeIndex)"
              @mouseenter="highlightNode($event, node)"
              @mouseleave="unhighlightNode()"
            >
            </circle>
            <text class="select-none" dx="12" dy="6" :x="node.x" :y="node.y">
              {{ node.id }}
            </text>
          </g>
        </template>
      </D3Svg>
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NodeDatum, EdgeDatum, GraphData } from '@/composables/useD3'

definePageMeta({
  name: 'Walk, Trail, Path, Cycle',
  path: '/tutorial/basic/walk-trail-path-cycle',
  pageOrder: 5,
})

const initData: GraphData = {
  nodes: [
    { id: 0 },
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
  ],
  edges: [
    { source: 0, target: 1 },
    { source: 0, target: 2 },
    { source: 1, target: 0 },
    { source: 1, target: 3 },
    { source: 2, target: 3 },
    { source: 2, target: 5 },
    { source: 3, target: 4 },
    { source: 3, target: 5 },
    { source: 4, target: 6 },
    { source: 5, target: 6 },
  ],
}

const svg = ref<HTMLDivElement | null>(null)

const {
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
  enableDrag,
  edgesCords,
  adjacencyMatrix,
} = useD3(initData, svg)

enableDrag()

const resetData = () => {
  data.nodes = [
    { id: 0 },
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
  ]
  data.edges = [
    { source: 0, target: 1 },
    { source: 0, target: 2 },
    { source: 1, target: 0 },
    { source: 1, target: 3 },
    { source: 2, target: 3 },
    { source: 2, target: 5 },
    { source: 3, target: 4 },
    { source: 3, target: 5 },
    { source: 4, target: 6 },
    { source: 5, target: 6 },
  ]
  walk.length = 0
}

const walk: number[] = reactive([])
const lastWalkNodeId = computed(() => walk.at(-1))
const isWalk = computed(() => walk.length > 0)
const isTrail = computed(() => {
  if (!isWalk.value) return false
  const walkEdges = walk.slice(0, -1).map((nodeId, index) => {
    if (nodeId > walk[index + 1]) return `${walk[index + 1]},${nodeId}`
    return `${nodeId},${walk[index + 1]}`
  })
  return walkEdges.length === new Set(walkEdges).size
})
const isPath = computed(() => {
  if (!isWalk.value) return false
  return walk.length === new Set(walk).size
})
const isCycle = computed(() => {
  if (!isWalk.value) return false
  return (
    walk.length === new Set(walk).size + 1 && walk[0] === lastWalkNodeId.value
  )
})

const handleWalk = (nodeId: number, nodeIndex: number) => {
  if (walk.length === 0) {
    walk.push(nodeId)
  } else {
    const lastNodeId = walk.at(-1)!
    if (lastNodeId === nodeId) {
      walk.pop()
    }

    const lastNodeIndex = data.nodes.findIndex((node) => node.id === lastNodeId)
    if (adjacencyMatrix.value[lastNodeIndex][nodeIndex]) {
      walk.push(nodeId)
    }
  }
}

const handleRemoveNode = (
  _event: PointerEvent | MouseEvent,
  node: NodeDatum
) => {
  if (walk.includes(node.id)) return
  removeNode(_event, node)
}

const handleRemoveEdge = (
  _event: PointerEvent | MouseEvent,
  edge: EdgeDatum
) => {
  const sourceId = (edge.source as NodeDatum).id
  const targetId = (edge.target as NodeDatum).id

  if (
    walk.slice(0, -1).some((nodeId, index) => {
      return (
        (nodeId === sourceId && walk[index + 1] === targetId) ||
        (nodeId === targetId && walk[index + 1] === sourceId)
      )
    })
  )
    return

  removeEdge(_event, edge)
}

const getNodeColor = (nodeId: number) => {
  if (walk.includes(nodeId)) {
    return colors[1]
  }
  return colors[0]
}

const getEdgeColor = (edge: EdgeDatum) => {
  const sourceId = (edge.source as NodeDatum).id
  const targetId = (edge.target as NodeDatum).id

  if (
    walk.slice(0, -1).some((nodeId, index) => {
      return (
        (nodeId === sourceId && walk[index + 1] === targetId) ||
        (nodeId === targetId && walk[index + 1] === sourceId)
      )
    })
  ) {
    return 'stroke-black'
  }
  return 'stroke-gray-300'
}
</script>
