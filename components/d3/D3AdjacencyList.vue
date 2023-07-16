<template>
  <ul ref="$ulRef" class="relative flex flex-col overflow-auto font-mono">
    <li
      v-for="(row, sourceIndex) in adjacencyList"
      :key="sourceIndex"
      class="flex w-fit rounded transition"
      :class="{
        'bg-gray-700':
          (hoverNode as NodeDatum | undefined)?.index === sourceIndex,
      }"
      :data-index="sourceIndex"
    >
      <pre
        class="flex w-[22px] justify-center border-r-[1px] border-transparent"
        >{{ isShowingIndex ? sourceIndex : nodeIds[sourceIndex] }}</pre
      >
      [<template v-for="(neighborIndex, j) in row" :key="neighborIndex">
        <code
          class="flex h-[24px] w-[22px] items-center justify-center transition"
          :class="{
            'rounded border bg-gray-700': isHighlightedEdge(
              sourceIndex,
              neighborIndex
            ),
          }"
          >{{ isShowingIndex ? neighborIndex : nodeIds[neighborIndex] }}</code
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
  isDirected: boolean
  isShowingIndex: boolean
}
const props = defineProps<Props>()

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

const $ulRef = ref<HTMLUListElement | null>(null)

watch(
  () => props.hoverNode,
  (hoverNode) => {
    if (hoverNode) {
      const nodeIndex = (hoverNode as NodeDatum).index
      const $li = $ulRef.value!.querySelector<HTMLElement>(
        `li[data-index="${nodeIndex}"]`
      )!
      const liCenterPosition =
        $li.offsetTop -
        ($ulRef.value!.getBoundingClientRect().height -
          $li.getBoundingClientRect().height) /
          2

      $ulRef.value!.scrollTo({
        top: liCenterPosition,
        behavior: 'smooth',
      })
    }
  }
)
</script>
