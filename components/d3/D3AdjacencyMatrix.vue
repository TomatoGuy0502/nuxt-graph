<template>
  <ul ref="ulRef" class="flex flex-col font-mono overflow-auto relative">
    <li v-if="!adjacencyMatrix.length">Add a node to see the matrix</li>
    <li
      v-if="adjacencyMatrix.length"
      class="flex bg-base-300 sticky top-0 border-b-[1px] z-[1] w-fit"
    >
      <div class="w-[22px] bg-base-300 sticky left-0 border-r-[1px]"></div>
      <div class="w-[10px]"></div>
      <template v-for="(row, i) in adjacencyMatrix" :key="i">
        <code
          class="rounded-t transition flex justify-center w-[22px]"
          :class="{
            'bg-gray-700': (hoverNode as NodeDatum | undefined)?.index === i,
          }"
          >{{ nodeIds[i] }}</code
        >
        <code v-if="i !== row.length - 1" class="w-[10px]">,</code>
      </template>
      <div class="w-[10px]"></div>
    </li>
    <li
      v-for="(row, i) in adjacencyMatrix"
      :key="i"
      class="flex rounded transition w-fit"
      :class="{ 'bg-gray-700': (hoverNode as NodeDatum | undefined)?.index === i }"
    >
      <div class="sticky left-0 bg-base-300">
        <span
          class="flex justify-center w-[22px] border-r-[1px] rounded-l transition"
          :class="{'bg-gray-700': (hoverNode as NodeDatum | undefined)?.index === i}"
        >
          {{ nodeIds[i] }}
        </span>
      </div>
      <code class="w-[10px]">[</code>
      <template v-for="(n, j) in row" :key="j">
        <code
          class="flex justify-center items-center transition w-[22px] h-[24px]"
          :class="{
            'bg-gray-700': (hoverNode as NodeDatum | undefined)?.index === j,
            'bg-gray-700 rounded border': isHeightlightedEdge(i, j),
            'rounded-b': i === row.length - 1,
            'text-base-content/20': i === j,
          }"
          :data-index="`${i},${j}`"
          >{{ n }}</code
        >
        <code v-if="j !== row.length - 1" class="w-[10px]">,</code>
      </template>
      <code class="w-[10px] pr-1">]</code>
    </li>
  </ul>
</template>

<script
  setup
  lang="ts"
  generic="NodeDatum extends BaseNodeDatum, EdgeDatum extends d3.SimulationLinkDatum<NodeDatum>"
>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { BaseNodeDatum } from '@/composables/useD3'

const props = defineProps({
  adjacencyMatrix: {
    type: Array as PropType<number[][]>,
    required: true,
  },
  hoverNode: {
    type: [Object, null] as PropType<NodeDatum | null>,
    required: true,
  },
  hoverEdge: {
    type: [Object, null] as PropType<EdgeDatum | null>,
    required: true,
  },
  nodeIds: {
    type: Array as PropType<number[]>,
    required: true,
  },
  isDirected: {
    type: Boolean,
    required: true,
  },
})

const isHeightlightedEdge = (
  sourceNodeIndex: number,
  targetNodeIndex: number
) => {
  const hoverEdge = props.hoverEdge as EdgeDatum | null
  const hoverEdgeSourceIndex = (hoverEdge?.source as NodeDatum | undefined)
    ?.index
  const hoverEdgeTargetIndex = (hoverEdge?.target as NodeDatum | undefined)
    ?.index
  return (
    (hoverEdgeSourceIndex === sourceNodeIndex &&
      hoverEdgeTargetIndex === targetNodeIndex) ||
    (!props.isDirected &&
      hoverEdgeSourceIndex === targetNodeIndex &&
      hoverEdgeTargetIndex === sourceNodeIndex)
  )
}

const ulRef = ref<HTMLUListElement | null>(null)

watch(
  () => props.hoverNode,
  (hoverNode) => {
    if (hoverNode) {
      const nodeIndex = (hoverNode as NodeDatum).index
      const code = ulRef.value!.querySelector<HTMLElement>(
        `code[data-index="${nodeIndex},${nodeIndex}"]`
      )!
      const codeTopPosition =
        code.offsetTop -
        (ulRef.value!.getBoundingClientRect().height -
          code.getBoundingClientRect().height) /
          2
      const codeLeftPosition =
        code.offsetLeft -
        (ulRef.value!.getBoundingClientRect().width -
          code.getBoundingClientRect().width) /
          2
      ulRef.value!.scrollTo({
        top: codeTopPosition,
        left: codeLeftPosition,
        behavior: 'smooth',
      })
    }
  }
)
</script>
