<template>
  <ul ref="$ulRef" class="flex flex-col font-mono overflow-auto relative">
    <li
      v-for="(row, sourceIndex) in adjacencyList"
      :key="sourceIndex"
      class="flex rounded transition w-fit"
      :class="{ 'bg-gray-700': (hoverNode as NodeDatum | undefined)?.index === sourceIndex }"
      :data-index="sourceIndex"
    >
      <pre
        class="flex justify-center w-[22px] border-transparent border-r-[1px]"
        >{{ nodeIds[sourceIndex] }}</pre
      >
      [<template v-for="(neighborIndex, j) in row" :key="neighborIndex">
        <code
          class="flex justify-center items-center transition w-[22px] h-[24px]"
          :class="{
            'bg-gray-700 rounded border': isHighlighted(
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
  isDirected: boolean
}
const props = defineProps<Props>()

const isHighlighted = (sourceNodeIndex: number, targetNodeIndex: number) => {
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
