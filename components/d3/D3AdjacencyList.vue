<template>
  <ul class="flex flex-col font-mono">
    <li
      v-for="(row, sourceIndex) in adjacencyList"
      :key="sourceIndex"
      class="flex rounded px-1 py-0.5 transition w-fit"
      :class="{ 'bg-base-300': (hoverNode as NodeDatum | undefined)?.index === sourceIndex }"
    >
      <pre class="pr-1.5">{{ nodeIds[sourceIndex] }}</pre>
      [<template v-for="(neighborIndex, j) in row" :key="neighborIndex">
        <code
          class="px-1.5 transition"
          :class="{
            'bg-base-300 rounded outline outline-1': isHighlighted(
              sourceIndex,
              neighborIndex
            ),
          }"
          >{{ nodeIds[neighborIndex] }}</code
        >
        <code v-if="j !== row.length - 1">,</code></template
      >]
    </li>
  </ul>
</template>

<script
  setup
  lang="ts"
  generic="NodeDatum extends d3.SimulationNodeDatum, EdgeDatum extends d3.SimulationLinkDatum<NodeDatum>"
>
interface Props {
  adjacencyList: number[][]
  hoverNode: NodeDatum | null
  hoverEdge: EdgeDatum | null
  nodeIds: number[]
}
const props = defineProps<Props>()

const isHighlighted = (sourceNodeIndex: number, targetNodeIndex: number) => {
  const hoverEdge = props.hoverEdge as EdgeDatum | null
  const hoverEdgeSourceIndex = (hoverEdge?.source as NodeDatum | undefined)
    ?.index
  const hoverEdgeTargetIndex = (hoverEdge?.target as NodeDatum | undefined)
    ?.index
  return (
    (hoverEdgeSourceIndex === targetNodeIndex &&
      hoverEdgeTargetIndex === sourceNodeIndex) ||
    (hoverEdgeSourceIndex === sourceNodeIndex &&
      hoverEdgeTargetIndex === targetNodeIndex)
  )
}
</script>
