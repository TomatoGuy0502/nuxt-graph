<template>
  <ul class="flex flex-col font-mono">
    <li
      v-for="(row, i) in adjacencyList"
      :key="i"
      class="flex rounded px-1 py-0.5 transition w-fit"
      :class="{ 'bg-base-300': hoverNode?.index === i }"
    >
      <pre class="pr-1.5">{{ row.id }}</pre>
      [<template v-for="(targetNodeId, j) in row.value" :key="j">
        <code
          class="px-1.5 transition"
          :class="{
            'bg-base-300 rounded outline outline-1': isHighlighted(
              row.id,
              targetNodeId
            ),
          }"
          >{{ targetNodeId }}</code
        >
        <code v-if="j !== row.value.length - 1">,</code></template
      >]
    </li>
  </ul>
</template>

<script
  setup
  lang="ts"
  generic="NodeDatum extends d3.SimulationNodeDatum, EdgeDatum extends d3.SimulationLinkDatum<NodeDatum>"
>
const props = defineProps({
  adjacencyList: {
    type: Array as PropType<
      {
        id: number
        value: number[]
      }[]
    >,
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

const isHighlighted = (sourceNodeId: Number, targetNodeId: Number) => {
  return (
    (props.hoverEdge?.source.id === targetNodeId &&
      props.hoverEdge?.target.id === sourceNodeId) ||
    (props.hoverEdge?.source.id === sourceNodeId &&
      props.hoverEdge?.target.id === targetNodeId)
  )
}
</script>
