<template>
  <div class="flex flex-col gap-2 w-72 p-2 rounded-lg bg-neutral">
    <h2 class="font-bold">Traversal Node</h2>
    <div class="flex overflow-x-auto p-1 rounded-lg bg-base-100 no-scrollbar">
      <ol class="flex">
        <li
          v-for="(nodeIndex, i) in traversal"
          :key="nodeIndex"
          class="flex items-center"
        >
          <code
            class="p-1 px-1.5 rounded transition-all"
            :class="[
              (hoverNode as NodeDatum | null)?.index === nodeIndex
                ? 'outline outline-1'
                : 'outline-none',
            ]"
            :data-node-id="nodeIds[nodeIndex]"
            >{{ nodeIds[nodeIndex] }}</code
          >
          <code v-if="i !== traversal.length - 1">➜</code>
        </li>
      </ol>
    </div>
    <h2 class="font-bold">Traversal Edge</h2>
    <div class="flex overflow-x-auto p-2 rounded-lg bg-base-100 no-scrollbar">
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
</template>

<script
  setup
  lang="ts"
  generic="NodeDatum extends BaseNodeDatum, EdgeDatum extends d3.SimulationLinkDatum<NodeDatum>"
>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { BaseNodeDatum } from '@/composables/useD3'

const props = defineProps({
  nodeIds: {
    type: Array as PropType<number[]>,
    required: true,
  },
  traversal: {
    type: Array as PropType<number[]>,
    required: true,
  },
  walk: {
    type: Array as PropType<string[]>,
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
})

const isWalkEqualsHoverEdge = (walkString: string) => {
  const [sourceIndex, targetIndex] = walkString.split(',').map(Number)
  if (!props.hoverEdge) return false
  const hoverEdgeSourceIndex = (
    (props.hoverEdge as EdgeDatum).source as NodeDatum
  ).index
  const hoverEdgeTargetIndex = (
    (props.hoverEdge as EdgeDatum).target as NodeDatum
  ).index

  return (
    (hoverEdgeSourceIndex === sourceIndex &&
      hoverEdgeTargetIndex === targetIndex) ||
    (hoverEdgeSourceIndex === targetIndex &&
      hoverEdgeTargetIndex === sourceIndex)
  )
}

watch(
  () => props.hoverNode,
  (hoverNode) => {
    if (hoverNode) {
      document
        .querySelector<HTMLElement>(
          `code[data-node-id="${(hoverNode as NodeDatum).id}"]`
        )
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        })
    }
  }
)

watch(
  () => props.hoverEdge,
  (hoverEdge) => {
    if (hoverEdge) {
      const [sourceIndex, targetIndex] = [
        ((hoverEdge as EdgeDatum).source as NodeDatum).index,
        ((hoverEdge as EdgeDatum).target as NodeDatum).index,
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