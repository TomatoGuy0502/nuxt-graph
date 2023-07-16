<template>
  <ul class="flex flex-wrap font-mono">
    [
    <li
      v-for="(edge, i) in sortedCurrentEdges"
      :key="`${(edge.source as NodeDatum).id}-${(edge.target as NodeDatum).id}`"
      class="flex"
    >
      <code
        class="rounded px-0.5 transition"
        :class="{ 'bg-gray-700': isHighlightedEdge(edge) }"
        >[{{
          isShowingIndex
            ? (edge.source as NodeDatum).index
            : (edge.source as NodeDatum).id
        }},{{
          isShowingIndex
            ? (edge.target as NodeDatum).index
            : (edge.target as NodeDatum).id
        }}]</code
      >
      <code v-if="i !== sortedCurrentEdges.length - 1">,</code>
    </li>
    ]
  </ul>
</template>

<script setup lang="ts">
import type { NodeDatum, EdgeDatum } from '@/composables/useD3'

const props = defineProps({
  edges: {
    type: Array as PropType<EdgeDatum[]>,
    required: true,
  },
  hoverEdge: {
    type: [Object, null] as PropType<EdgeDatum | null>,
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

/**  Only show one edge in edge list when isDirected is false */
const currentEdges = computed(() => {
  if (props.isDirected) return props.edges

  const edgeSet = new Set<string>()
  return props.edges.filter((edge) => {
    const sourceId = (edge.source as NodeDatum).id
    const targetId = (edge.target as NodeDatum).id
    const key =
      sourceId < targetId
        ? `${sourceId}-${targetId}`
        : `${targetId}-${sourceId}`
    if (edgeSet.has(key)) return false
    edgeSet.add(key)
    return true
  })
})

const sortedCurrentEdges = computed(() => {
  return [...currentEdges.value].sort((a, b) => {
    const sourceA = (a.source as NodeDatum).id
    const sourceB = (b.source as NodeDatum).id
    if (sourceA !== sourceB) return sourceA - sourceB
    const targetA = (a.target as NodeDatum).id
    const targetB = (b.target as NodeDatum).id
    return targetA - targetB
  })
})

const isHighlightedEdge = (edge: EdgeDatum) => {
  const hoverEdgeSourceNodeIndex = (
    props.hoverEdge?.source as NodeDatum | undefined
  )?.index
  const hoverEdgeTargetNodeIndex = (
    props.hoverEdge?.target as NodeDatum | undefined
  )?.index
  const sourceNodeIndex = (edge.source as NodeDatum).index
  const targetNodeIndex = (edge.target as NodeDatum).index
  return (
    (hoverEdgeSourceNodeIndex === sourceNodeIndex &&
      hoverEdgeTargetNodeIndex === targetNodeIndex) ||
    (!props.isDirected &&
      hoverEdgeSourceNodeIndex === targetNodeIndex &&
      hoverEdgeTargetNodeIndex === sourceNodeIndex)
  )
}
</script>
