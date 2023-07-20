<template>
  <NuxtLayout name="basic">
    <template #content>
      <ContentDoc
        class="prose-sm prose xl:prose-base"
        path="basic/tree-and-forest"
      />
    </template>
    <template #svg>
      <D3Svg
        ref="svg"
        class="flex-1"
        :has-mouse-down-node="!!mousedownNode"
        :draw-edge-cords="drawEdgeCords"
        :is-draggable="true"
        @clear-data="clearData"
        @svg-mousedown="addNode"
        @svg-mousemove="updateDrawEdge"
        @svg-mouseup="hideDrawEdge"
        @svg-mouseleave="hideDrawEdge"
      >
        <template #info>
          <ul class="flex flex-col gap-2 rounded-lg bg-base-300 p-4">
            <li class="font-bold">
              has Cycle:
              <code class="font-normal">{{ graphProperties.hasCycle }}</code>
            </li>
            <li class="font-bold">
              is Tree:
              <code class="font-normal">{{ graphProperties.isTree }}</code>
            </li>
            <li class="font-bold">
              is Forest:
              <code class="font-normal"
                >{{ graphProperties.isForest }}
                <span v-show="graphProperties.isForest"
                  >({{ graphProperties.connectedComponents.length }}
                  {{
                    graphProperties.connectedComponents.length > 1
                      ? 'trees'
                      : 'tree'
                  }})</span
                >
              </code>
            </li>
            <!-- <li class="font-bold">
            connectedComponents:
            <code class="font-normal">{{
              graphProperties.connectedComponents.map((component) =>
                component.map((nodeIndex) => data.nodes[nodeIndex].id)
              )
            }}</code>
          </li> -->
          </ul>
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
            @contextmenu.prevent="removeEdge($event, edge)"
          ></line>
        </template>
        <template #nodes>
          <g v-for="(node, i) in data.nodes" :key="node.id" class="node">
            <circle
              class="cursor-pointer hover:brightness-75"
              :style="{ fill: colors[nodesComponentColorIndex[i] % 10] }"
              :cx="node.x"
              :cy="node.y"
              r="10"
              @contextmenu.prevent="removeNode($event, node)"
              @mousedown.exact="beginDrawEdge($event, node)"
              @mouseup.exact="endDrawEdge($event, node)"
              @mouseenter="highlightNode($event, node)"
              @mouseleave="unhighlightNode()"
            >
            </circle>
            <!-- <text class="select-none" dx="12" dy="6" :x="node.x" :y="node.y">
            {{ node.id }}
          </text> -->
          </g>
        </template>
      </D3Svg>
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NodeDatum, GraphData } from '@/composables/useD3'

definePageMeta({
  name: 'Tree and Forest',
  path: '/tutorial/basic/tree-and-forest',
  pageOrder: 6,
})

const initData: GraphData = {
  nodes: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
  edges: [
    { source: 0, target: 1 },
    { source: 0, target: 2 },
  ],
}

const svg = ref<HTMLDivElement | null>(null)

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
  enableDrag,
  graphProperties,
  nodesComponentColorIndex,
} = useD3(initData, svg)

enableDrag()
</script>

<style scoped>
line {
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
