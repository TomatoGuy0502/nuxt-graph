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
          class="stroke-[4] hover:cursor-pointer hover:stroke-[5]"
          :class="getEdgeColor(edge)"
          :x1="(edge.source as NodeDatum).x"
          :y1="(edge.source as NodeDatum).y"
          :x2="(edge.target as NodeDatum).x"
          :y2="(edge.target as NodeDatum).y"
          @contextmenu.prevent="removeEdge($event, edge)"
        ></line>
      </template>
      <template #nodes>
        <g v-for="(node, i) in data.nodes" :key="node.id" class="node">
          <circle
            class="cursor-pointer hover:brightness-75"
            :class="{
              'stroke-black stroke-[4]': node.index === visitingNodeIndex,
            }"
            :style="{ fill: getNodeColor(i) }"
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
    <div class="flex flex-col gap-4">
      <div class="form-control w-full max-w-xs">
        <label class="label">
          <span class="label-text">Start Node ID</span>
        </label>
        <select
          v-model="traversalStartNodeIndex"
          class="select-bordered select"
        >
          <option v-for="(node, i) in data.nodes" :key="node.id" :value="i">
            {{ node.id }}
          </option>
        </select>
      </div>
      <button class="btn" @click="play()">
        {{ isPlaying ? 'Pause' : 'Play' }}
      </button>
      <button
        class="btn"
        :class="{ 'btn-disabled': isPlaying }"
        :disabled="isPlaying"
        @click="visitNextNode"
      >
        <template v-if="visitingTraversalIndex === null">Start</template>
        <template v-else-if="visitingTraversalIndex === traversal.length - 1">
          Restart
        </template>
        <template v-else>Next Step</template>
      </button>
      <p>
        {{ traversal.map((i) => data.nodes[i].id).join(' -> ') }}
      </p>
      <p>
        {{ walk.join(' -> ') }}
      </p>
      <button class="btn" @click="generateRandomGraph(10, 8)">
        Generate Random Graph
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'Depth-First Search',
  path: '/tutorial/algorithm/depth-first-search',
  pageOrder: 1,
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
    { source: 1, target: 3 },
    { source: 1, target: 4 },
    { source: 2, target: 5 },
  ],
}

const {
  clearData,
  updateSimulation,
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
  adjacencyList,
  enableDrag,
} = useD3(initData)

enableDrag()

/** Traversal start node index, -1 when no node */
const traversalStartNodeIndex = ref<number>(0)
watch(
  () => data.nodes.length,
  (length) => {
    while (traversalStartNodeIndex.value >= length) {
      traversalStartNodeIndex.value--
    }
    if (traversalStartNodeIndex.value < 0 && length > 0) {
      traversalStartNodeIndex.value = 0
    }
  }
)

/** Traversal order using index */
const {
  traversal,
  walk,
  visitingTraversalIndex,
  visitingNodeIndex,
  visitedNodeIndices,
  visitNextNode,
  isPlaying,
  play,
} = useTraversal(() => {
  const visited = new Set()
  const traversal: number[] = []
  const walk: string[] = []

  // DFS
  function dfs(nodeIndex: number) {
    visited.add(nodeIndex)
    traversal.push(nodeIndex)

    for (const neighborIndex of adjacencyList.value[nodeIndex]) {
      if (visited.has(neighborIndex)) continue // Skip already visited neighbor
      walk.push(`${nodeIndex},${neighborIndex}`)
      dfs(neighborIndex)
    }
  }

  // Start traversal from traversalStartNodeIndex
  if (data.nodes.length && traversalStartNodeIndex.value >= 0) {
    dfs(traversalStartNodeIndex.value)
  }
  // Visit remaining nodes
  adjacencyList.value.forEach((_, nodeIndex) => {
    if (!visited.has(nodeIndex)) dfs(nodeIndex)
  })
  return {
    traversal,
    walk,
  }
})

const getNodeColor = (nodeIndex: number) => {
  if (visitedNodeIndices.value.has(nodeIndex)) {
    return colors[1]
  } else {
    return colors[0]
  }
}

const getEdgeColor = (edge: EdgeDatum) => {
  const sourceIndex = (edge.source as NodeDatum).index!
  const targetIndex = (edge.target as NodeDatum).index!
  if (
    visitedNodeIndices.value.has(sourceIndex) &&
    visitedNodeIndices.value.has(targetIndex) &&
    (walk.value.includes(`${sourceIndex},${targetIndex}`) ||
      walk.value.includes(`${targetIndex},${sourceIndex}`))
  ) {
    return 'stroke-black'
  } else {
    return 'stroke-gray-300'
  }
}

const generateRandomGraph = async (nodeCount = 6, edgeCount = 8) => {
  data.nodes.length = 0
  data.edges.length = 0
  await nextTick()
  const newData = generateRandomGraphData(nodeCount, edgeCount) as GraphData
  const oldNumNodes = data.nodes.length
  const oldNumEdges = data.edges.length
  data.nodes.push(...newData.nodes)
  data.edges.push(...newData.edges)
  if (oldNumNodes === nodeCount && oldNumEdges === edgeCount) {
    updateSimulation()
  }
  traversalStartNodeIndex.value = 0
}
</script>

<style scoped>
line {
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
