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
          <!-- <text class="select-none" dx="12" dy="6" :x="node.x" :y="node.y">
              {{ node.id }}
            </text> -->
        </g>
      </template>
    </D3Svg>
    <div>isComplete: {{ isComplete }}</div>
    <div>connectedComponents: {{ connectedComponents }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'

definePageMeta({
  name: 'Connected and Complete Graph',
  path: '/tutorial/basic/connected-and-complete-graph',
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
} = useD3(initData)

const isComplete = computed(() => {
  return (
    !!data.nodes.length &&
    data.edges.length === (data.nodes.length * (data.nodes.length - 1)) / 2
  )
})

class UnionFind {
  parent: number[]
  rank: number[]
  count: number

  constructor(n: number) {
    this.parent = [...Array(n)].map((_, i) => i)
    this.rank = Array(n).fill(0)
    this.count = n
  }

  find(x: number) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x])
    }
    return this.parent[x]
  }

  union(x: number, y: number) {
    const rootX = this.find(x)
    const rootY = this.find(y)

    if (rootX !== rootY) {
      if (this.rank[rootX] < this.rank[rootY]) {
        this.parent[rootX] = rootY
      } else if (this.rank[rootX] > this.rank[rootY]) {
        this.parent[rootY] = rootX
      } else {
        this.parent[rootY] = rootX
        this.rank[rootX]++
      }
      this.count--
    }
  }

  getGroupIds() {
    // Group IDs are not continuous, map them to continuous IDs.
    const groupIdMap = [...new Set(this.parent)].reduce((map, n, i) => {
      map[n] = i
      return map
    }, {} as Record<number, number>)
    return this.parent.map((n) => groupIdMap[this.find(n)])
  }
}

const connectedComponents = ref(0)
const nodesGroupIds = ref(Array(data.nodes.length).fill(0))

watchEffect(() => {
  const n = data.nodes.length
  const uf = new UnionFind(n)
  data.edges.forEach((edge) => {
    uf.union(
      (edge.source as NodeDatum).index as number,
      (edge.target as NodeDatum).index as number
    )
  })
  connectedComponents.value = uf.count
  nodesGroupIds.value = uf.getGroupIds()
})
</script>

<style scoped>
line {
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
