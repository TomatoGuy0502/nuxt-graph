// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { useTraversal } from './useTraversal'

describe('useTraversal', () => {
  it('should go next step correctly', () => {
    const { goNextStep, visitingNodeIndex, visitedNodeIndices } = useTraversal(
      () => ({
        traversal: [0, 1, 2],
        walk: [],
      })
    )

    expect(visitingNodeIndex.value).toBe(null)
    expect(visitedNodeIndices.value.size).toBe(0)

    goNextStep()

    expect(visitingNodeIndex.value).toBe(0)
    expect(visitedNodeIndices.value.size).toBe(1)

    goNextStep()

    expect(visitingNodeIndex.value).toBe(1)
    expect(visitedNodeIndices.value.size).toBe(2)

    goNextStep()

    expect(visitingNodeIndex.value).toBe(2)
    expect(visitedNodeIndices.value.size).toBe(3)

    goNextStep()

    expect(visitingNodeIndex.value).toBe(null)
    expect(visitedNodeIndices.value.size).toBe(0)
  })

  it('should go prev step correctly', () => {
    const { goNextStep, goPrevStep, visitingNodeIndex, visitedNodeIndices } =
      useTraversal(() => ({
        traversal: [0, 1, 2],
        walk: [],
      }))

    expect(visitingNodeIndex.value).toBe(null)
    expect(visitedNodeIndices.value.size).toBe(0)

    goNextStep()

    expect(visitingNodeIndex.value).toBe(0)
    expect(visitedNodeIndices.value.size).toBe(1)

    goNextStep()

    expect(visitingNodeIndex.value).toBe(1)
    expect(visitedNodeIndices.value.size).toBe(2)

    goPrevStep()

    expect(visitingNodeIndex.value).toBe(0)
    expect(visitedNodeIndices.value.size).toBe(1)

    goPrevStep()

    expect(visitingNodeIndex.value).toBe(null)
    expect(visitedNodeIndices.value.size).toBe(0)

    goPrevStep()

    expect(visitingNodeIndex.value).toBe(null)
    expect(visitedNodeIndices.value.size).toBe(0)
  })

  it('should reset visiting status when traversal changes', async () => {
    const nodesNumber = ref(3)
    const { goNextStep, visitingNodeIndex, visitedNodeIndices } = useTraversal(
      () => ({
        traversal: [...Array(nodesNumber.value).keys()],
        walk: [],
      })
    )

    expect(visitingNodeIndex.value).toBe(null)
    expect(visitedNodeIndices.value.size).toBe(0)

    goNextStep()
    goNextStep()

    expect(visitingNodeIndex.value).toBe(1)
    expect(visitedNodeIndices.value.size).toBe(2)

    nodesNumber.value = 4
    await nextTick()

    expect(visitingNodeIndex.value).toBe(null)
    expect(visitedNodeIndices.value.size).toBe(0)
  })

  it('should return algorithmRecords when it is retured by algorithm', () => {
    const { algorithmRecords } = useTraversal(() => {
      return {
        traversal: [0, 1, 2],
        walk: ['0,1', '1,2'],
        algorithmRecords: [[0], [1, 2], [2], []],
      }
    })

    expect(algorithmRecords.value).toEqual([[0], [1, 2], [2], []])
  })

  it('should return empty algorithmRecords when it is not retured by algorithm', () => {
    const { algorithmRecords } = useTraversal(() => {
      return {
        traversal: [0, 1, 2],
        walk: ['0,1', '1,2'],
      }
    })

    expect(algorithmRecords.value).toEqual([])
  })

  it('should toggle play status correctly', () => {
    const { play, isPlaying } = useTraversal(() => ({
      traversal: [0, 1, 2],
      walk: [],
    }))

    expect(isPlaying.value).toBe(false)

    play()

    expect(isPlaying.value).toBe(true)

    play()

    expect(isPlaying.value).toBe(false)
  })
})
