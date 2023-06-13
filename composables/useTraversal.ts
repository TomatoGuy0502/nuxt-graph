import type { MaybeRefOrGetter } from 'vue'

export const useTraversal = (
  traversalAlgorithm: () => {
    traversal: number[]
    walk: string[]
    algorithmRecords?: number[][]
  },
  interval: MaybeRefOrGetter<number> = 500
) => {
  /** Traversal order using index */
  const {
    traversal,
    walk,
    algorithmRecords = ref([]),
  } = toRefs(toReactive(computed(traversalAlgorithm)))

  const visitingTraversalIndex = ref<number | null>(null)

  const visitingNodeIndex = computed(() => {
    if (visitingTraversalIndex.value === null) return null
    return traversal.value[visitingTraversalIndex.value]
  })

  watch(traversal, () => {
    visitingTraversalIndex.value = null
    visitedNodeIndices.value.clear()
  })

  const visitedNodeIndices = ref(new Set<number>())

  const goNextStep = () => {
    if (visitingTraversalIndex.value === null) {
      visitingTraversalIndex.value = 0
    } else {
      visitingTraversalIndex.value++
    }
    if (visitingTraversalIndex.value >= traversal.value.length) {
      visitingTraversalIndex.value = null
      visitedNodeIndices.value.clear()
      return
    }
    visitedNodeIndices.value.add(visitingNodeIndex.value!)
  }

  const goPrevStep = () => {
    if (visitingTraversalIndex.value === null) return

    visitedNodeIndices.value.delete(visitingNodeIndex.value!)
    visitingTraversalIndex.value--

    if (visitingTraversalIndex.value < 0) {
      visitingTraversalIndex.value = null
      visitedNodeIndices.value.clear()
    }
  }

  const {
    isActive: isPlaying,
    resume,
    pause,
  } = useTimeoutPoll(goNextStep, interval)

  const play = () => {
    if (isPlaying.value) pause()
    else resume()
  }

  return {
    traversal,
    walk,
    algorithmRecords,
    visitingTraversalIndex,
    visitingNodeIndex,
    visitedNodeIndices,
    goNextStep,
    goPrevStep,
    isPlaying,
    play,
  }
}
