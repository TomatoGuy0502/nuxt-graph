// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import D3AlgorithmResult from './D3AlgorithmResult.vue'

describe('D3AlgorithmResult.vue', () => {
  function createComponent(propsData: any = {}) {
    return mount(D3AlgorithmResult, {
      props: {
        nodeIds: [6, 7, 8, 9],
        traversal: [0, 2, 1, 3],
        walk: ['0,1', '1,2', '2,3'],
        hoverNode: { id: 6, index: 0 },
        hoverEdge: { source: { id: 6, index: 0 }, target: { id: 7, index: 1 } },
        ...propsData,
      },
    })
  }
  const getVertexResult = (wrapper: ReturnType<typeof mount>) =>
    wrapper.get('[data-test="traversal-vertex-result"]')
  const getEdgeResult = (wrapper: ReturnType<typeof mount>) =>
    wrapper.get('[data-test="traversal-edge-result"]')

  it('can toggle between show and blur', async () => {
    const wrapper = createComponent()
    const isVertexResultBlured = () =>
      getVertexResult(wrapper).classes('after:backdrop-blur-sm')
    const isEdgeResultBlured = () =>
      getEdgeResult(wrapper).classes('after:backdrop-blur-sm')

    expect(isVertexResultBlured()).toBe(false)
    expect(isEdgeResultBlured()).toBe(false)

    await wrapper.find('.i-heroicons-eye').trigger('click')
    expect(isVertexResultBlured()).toBe(true)
    expect(isEdgeResultBlured()).toBe(true)

    await wrapper.find('.i-heroicons-eye-slash').trigger('click')
    expect(isVertexResultBlured()).toBe(false)
    expect(isEdgeResultBlured()).toBe(false)
  })

  it('should render the result with nodeId', () => {
    const wrapper = createComponent()

    expect(getVertexResult(wrapper).text()).toBe('16➜28➜37➜49')
    expect(getEdgeResult(wrapper).text()).toBe('16-7➜27-8➜38-9')
  })

  it('should highlight the hovered vertex', () => {
    const wrapper = createComponent()
    expect(wrapper.get('[data-node-id="6"]').classes()).toContain('outline')
  })

  it('should highlight the hovered edge', () => {
    const wrapper = createComponent()
    expect(wrapper.get('[data-edge-id="0,1"]').classes()).toContain('outline')
  })
})
