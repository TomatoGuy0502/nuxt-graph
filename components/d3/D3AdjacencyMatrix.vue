<template>
  <ul class="flex flex-col font-mono">
    <li class="flex px-1">
      <pre class="pr-1.5">{{ '  ' }}</pre>
      <template v-for="(row, i) in adjacencyMatrix" :key="i">
        <code
          class="px-1.5 rounded-t transition"
          :class="{
            'bg-base-300': hoverNode?.index === i,
          }"
          >{{ nodeIds[i] }}</code
        >
        <code v-if="i !== row.length - 1">,</code>
      </template>
    </li>
    <li
      v-for="(row, i) in adjacencyMatrix"
      :key="i"
      class="flex rounded px-1 transition"
      :class="{ 'bg-base-300': hoverNode?.index === i }"
    >
      <pre class="pr-1.5">{{ nodeIds[i] }}</pre>
      [
      <template v-for="(n, j) in row" :key="j">
        <code
          class="px-1.5 transition"
          :class="{
            'bg-base-300': hoverNode?.index === j || isHeightlightedEdge(i, j),
            'rounded outline outline-1': isHeightlightedEdge(i, j),
            'rounded-b': i === row.length - 1,
          }"
          >{{ n }}</code
        >
        <code v-if="j !== row.length - 1">,</code>
      </template>
      ]
    </li>
  </ul>
</template>

<script
  setup
  lang="ts"
  generic="NodeDatum extends d3.SimulationNodeDatum, EdgeDatum extends d3.SimulationLinkDatum<NodeDatum>"
>
const props = defineProps({
  adjacencyMatrix: {
    type: Array as PropType<Number[][]>,
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
    type: Array as PropType<Number[]>,
    required: true,
  },
})

const isHeightlightedEdge = (i: Number, j: Number) => {
  if (!props.hoverEdge) return false
  const sourceIndex = (props.hoverEdge.source as NodeDatum).index
  const targetIndex = (props.hoverEdge.target as NodeDatum).index
  return (
    (sourceIndex === i && targetIndex === j) ||
    (sourceIndex === j && targetIndex === i)
  )
}
</script>