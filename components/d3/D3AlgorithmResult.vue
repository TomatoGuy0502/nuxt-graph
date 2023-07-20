<template>
  <div class="flex flex-col gap-2 rounded-lg bg-base-300 p-4">
    <h2 class="font-bold inline-flex items-center gap-2 justify-between">
      Traversal Vertex
      <i
        v-show="showTraversalResult"
        class="i-heroicons-eye text-xl cursor-pointer"
        @click="showTraversalResult = false"
      />
      <i
        v-show="!showTraversalResult"
        class="i-heroicons-eye-slash text-xl cursor-pointer"
        @click="showTraversalResult = true"
      />
    </h2>
    <div
      class="relative flex min-h-[56px] overflow-x-auto rounded-lg bg-base-100 p-2 pt-4 after:absolute after:inset-0 after:z-10 after:transition after:pointer-events-none"
      :class="{
        'after:backdrop-blur-sm after:pointer-events-auto':
          !showTraversalResult,
      }"
    >
      <ol class="flex">
        <li
          v-for="(nodeIndex, i) in traversal"
          :key="nodeIndex"
          class="flex items-center"
        >
          <div class="indicator">
            <span
              class="indicator-center badge badge-xs indicator-item border-none bg-transparent text-opacity-60"
              >{{ i + 1 }}</span
            >
            <code
              class="rounded p-1 px-1.5 transition-all"
              :class="[
                (hoverNode as NodeDatum | null)?.index === nodeIndex
                  ? 'outline outline-1'
                  : 'outline-none',
              ]"
              :data-node-id="nodeIds[nodeIndex]"
              >{{ nodeIds[nodeIndex] }}</code
            >
          </div>
          <code v-if="i !== traversal.length - 1">➜</code>
        </li>
      </ol>
    </div>
    <h2 class="font-bold">Traversal Edge</h2>
    <div
      class="relative flex min-h-[56px] overflow-x-auto rounded-lg bg-base-100 p-2 pt-4 after:absolute after:inset-0 after:z-10 after:transition after:pointer-events-none"
      :class="{
        'after:backdrop-blur-sm after:pointer-events-auto':
          !showTraversalResult,
      }"
    >
      <ol class="flex">
        <li
          v-for="(walkString, i) in walk"
          :key="walkString"
          class="flex items-center"
        >
          <div class="indicator">
            <span
              class="indicator-center badge badge-xs indicator-item border-none bg-transparent text-opacity-60"
              >{{ i + 1 }}</span
            >
            <code
              class="whitespace-nowrap rounded p-1 px-1.5 transition-all"
              :class="[
                isWalkEqualsHoverEdge(walkString)
                  ? 'outline outline-1'
                  : 'outline-none',
              ]"
              :data-edge-id="walkString"
              >{{ nodeIds[~~walkString.split(',')[0]] }}-{{
                nodeIds[~~walkString.split(',')[1]]
              }}</code
            >
          </div>
          <code v-if="i !== walk.length - 1">➜</code>
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NodeDatum, EdgeDatum } from '@/composables/useD3'

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

const showTraversalResult = ref(true)
</script>
