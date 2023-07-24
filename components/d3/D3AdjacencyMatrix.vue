<template>
  <ul ref="ulRef" class="relative flex flex-col overflow-auto font-mono">
    <li v-if="!adjacencyMatrix.length">Add a node to see the matrix</li>
    <li
      v-if="adjacencyMatrix.length"
      data-test="header-top"
      class="sticky top-0 z-[1] flex w-fit border-b-[1px] bg-base-300"
    >
      <div class="sticky left-0 w-[22px] border-r-[1px] bg-base-300"></div>
      <div class="w-[10px]"></div>
      <template v-for="(row, i) in adjacencyMatrix" :key="i">
        <code
          class="flex w-[22px] justify-center rounded-t transition"
          :data-test="`header-top-${i}`"
          :class="{
            'bg-gray-700': (hoverNode as NodeDatum | undefined)?.index === i,
          }"
          >{{ isShowingIndex ? i : nodeIds[i] }}</code
        >
        <code v-if="i !== row.length - 1" class="w-[10px]">,</code>
      </template>
      <div class="w-[10px]"></div>
    </li>
    <li
      v-for="(row, sourceIndex) in adjacencyMatrix"
      :key="sourceIndex"
      class="flex w-fit rounded transition"
      :data-test="`row-${sourceIndex}`"
      :class="{
        'bg-gray-700':
          (hoverNode as NodeDatum | undefined)?.index === sourceIndex,
      }"
    >
      <div class="sticky left-0 bg-base-300">
        <span
          class="flex w-[22px] justify-center rounded-l border-r-[1px] transition"
          :data-test="`header-left-${sourceIndex}`"
          :class="{
            'bg-gray-700':
              (hoverNode as NodeDatum | undefined)?.index === sourceIndex,
          }"
        >
          {{ isShowingIndex ? sourceIndex : nodeIds[sourceIndex] }}
        </span>
      </div>
      <code class="w-[10px]">[</code>
      <template v-for="(isConnected, targetIndex) in row" :key="targetIndex">
        <code
          class="flex h-[24px] w-[22px] items-center justify-center transition"
          :class="{
            'bg-gray-700':
              (hoverNode as NodeDatum | undefined)?.index === targetIndex,
            'rounded border bg-gray-700': isHighlightedEdge(
              sourceIndex,
              targetIndex
            ),
            'rounded-b': sourceIndex === row.length - 1,
            'text-base-content/20': sourceIndex === targetIndex,
          }"
          :data-index="`${sourceIndex},${targetIndex}`"
          >{{ isConnected }}</code
        >
        <code v-if="targetIndex !== row.length - 1" class="w-[10px]">,</code>
      </template>
      <code class="w-[10px] pr-1">]</code>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { NodeDatum, EdgeDatum } from '@/composables/useD3'

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
  isShowingIndex: {
    type: Boolean,
    required: true,
  },
})

const isHighlightedEdge = (
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
