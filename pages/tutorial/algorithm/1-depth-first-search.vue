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
          class="stroke-[5] hover:cursor-pointer hover:stroke-[6]"
          :class="getEdgeColor(edge)"
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
      <div class="form-control w-64 gap-4 p-2 rounded-lg bg-neutral">
        <div class="form-control">
          <label class="label">
            <span class="label-text font-bold">Start Node ID</span>
          </label>
          <select
            v-model="traversalStartNodeIndex"
            class="select-bordered select select-sm flex-1 bg-base-100 transition hover:bg-base-200 focus:outline-none"
          >
            <option v-for="(node, i) in data.nodes" :key="node.id" :value="i">
              {{ node.id }}
            </option>
          </select>
        </div>
        <div class="join">
          <button
            class="btn-success join-item btn w-1/2 gap-0.5 normal-case"
            :class="[isPlaying ? 'btn-error' : 'btn-success']"
            @click="play()"
          >
            <template v-if="isPlaying"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="h-4 w-4"
              >
                <path
                  fill-rule="evenodd"
                  d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                  clip-rule="evenodd"
                />
              </svg>
              Pause</template
            >
            <template v-else
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="h-4 w-4"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                  clip-rule="evenodd"
                />
              </svg>
              Auto Play</template
            >
          </button>
          <button
            class="join-item btn w-1/2 normal-case"
            :class="{ 'btn-disabled': isPlaying }"
            :disabled="isPlaying"
            @click="visitNextNode"
          >
            <template v-if="visitingTraversalIndex === null"
              >First Step</template
            >
            <template
              v-else-if="visitingTraversalIndex === traversal.length - 1"
            >
              Finish
            </template>
            <template v-else>Next Step</template>
          </button>
        </div>
        <button class="btn normal-case" @click="generateRandomGraph(10, 8)">
          Generate Random Graph
        </button>
      </div>
      <div class="flex flex-col gap-2 w-64 p-2 rounded-lg bg-neutral">
        <h2 class="font-bold">Traversal Node</h2>
        <div
          class="flex overflow-x-auto p-1 rounded-lg bg-base-100 no-scrollbar"
        >
          <ol class="flex">
            <li
              v-for="(nodeIndex, i) in traversal"
              :key="nodeIndex"
              class="flex items-center"
            >
              <code
                class="p-1 px-1.5 rounded transition-all"
                :class="[
                  hoverNode?.index === nodeIndex
                    ? 'outline outline-1'
                    : 'outline-none',
                ]"
                :data-node-id="data.nodes[nodeIndex].id"
                >{{ data.nodes[nodeIndex].id }}</code
              >
              <code v-if="i !== traversal.length - 1">➜</code>
            </li>
          </ol>
        </div>
        <h2 class="font-bold">Traversal Edge</h2>
        <div
          class="flex overflow-x-auto p-2 rounded-lg bg-base-100 no-scrollbar"
        >
          <ol class="flex">
            <li
              v-for="(walkString, i) in walk"
              :key="walkString"
              class="flex items-center"
            >
              <code
                class="p-1 px-1.5 rounded transition-all whitespace-nowrap"
                :class="[
                  isWalkEqualsHoverEdge(walkString)
                    ? 'outline outline-1'
                    : 'outline-none',
                ]"
                :data-edge-id="walkString"
                >{{ walkString.split(',').join('-') }}</code
              >
              <code v-if="i !== walk.length - 1">,</code>
            </li>
          </ol>
        </div>
      </div>
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
  hoverNode,
  hoverEdge,
  highlightEdge,
  unhighlightEdge,
} = useD3(initData, { width: 600, height: 400 })

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

const isWalkEqualsHoverEdge = (walkString: string) => {
  const [sourceIndex, targetIndex] = walkString.split(',').map(Number)
  if (!hoverEdge.value) return false
  const hoverEdgeSourceIndex = (hoverEdge.value?.source as NodeDatum).index
  const hoverEdgeTargetIndex = (hoverEdge.value?.target as NodeDatum).index

  return (
    (hoverEdgeSourceIndex === sourceIndex &&
      hoverEdgeTargetIndex === targetIndex) ||
    (hoverEdgeSourceIndex === targetIndex &&
      hoverEdgeTargetIndex === sourceIndex)
  )
}

watch(
  () => hoverNode.value,
  (hoverNode) => {
    if (hoverNode) {
      document
        .querySelector<HTMLElement>(`code[data-node-id="${hoverNode.id}"]`)
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        })
    }
  }
)

watch(
  () => hoverEdge.value,
  (hoverEdge) => {
    if (hoverEdge) {
      const [sourceIndex, targetIndex] = [
        (hoverEdge.source as NodeDatum).index,
        (hoverEdge.target as NodeDatum).index,
      ]
      const el =
        document.querySelector<HTMLElement>(
          `code[data-edge-id="${sourceIndex},${targetIndex}"]`
        ) ||
        document.querySelector<HTMLElement>(
          `code[data-edge-id="${targetIndex},${sourceIndex}"]`
        )

      el?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      })
    }
  }
)
</script>

<style scoped>
line {
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
