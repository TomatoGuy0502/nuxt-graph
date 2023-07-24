// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import D3AdjacencyList from './D3AdjacencyList.vue'

describe('D3AdjacencyList.vue', () => {
  function createComponent(propsData: any = {}) {
    return mount(D3AdjacencyList, {
      props: {
        adjacencyList: [
          [1, 2, 3],
          [0, 2, 3],
          [0, 1, 3],
          [0, 1, 2],
        ],
        hoverNode: null,
        hoverEdge: null,
        nodeIds: [4, 5, 6, 7],
        isDirected: false,
        isShowingIndex: false,
        ...propsData,
      },
    })
  }
  it('should render adjacencyList correctly', () => {
    const adjacencyList = [
      [1, 2, 3],
      [0, 2, 3],
      [0, 1, 3],
      [0, 1, 2],
    ]
    const wrapper = createComponent({ adjacencyList })

    const liElements = wrapper.findAll('li')
    expect(liElements.length).toBe(adjacencyList.length)
    adjacencyList.forEach((neighbors, index) => {
      const liElement = liElements[index]
      const nodeIds = wrapper.props().nodeIds

      expect(liElement.text()).toEqual(
        `${nodeIds[index]} [${neighbors
          .map((neighborIndex) => nodeIds[neighborIndex])
          .join(',')}]`
      )
    })
  })

  it('should highlight the hovered vertex', () => {
    const wrapper = createComponent({ hoverNode: { index: 2 } })

    expect(
      wrapper.get('li[data-index="2"]').classes('bg-gray-700')
    ).toBeTruthy()
  })

  it('should highlight the hovered edge for both direction when "isDirected" is false', () => {
    const wrapper = createComponent({
      hoverEdge: {
        source: { index: 2 },
        target: { index: 0 },
      },
    })

    expect(wrapper.get('[data-test="edge-2,0"]').classes('border')).toBeTruthy()
    expect(wrapper.get('[data-test="edge-0,2"]').classes('border')).toBeTruthy()
  })

  it('should highlight the hovered edge for only one direction when "isDirected" is true', () => {
    const wrapper = createComponent({
      hoverEdge: {
        source: { index: 2 },
        target: { index: 0 },
      },
      isDirected: true,
    })

    expect(wrapper.get('[data-test="edge-2,0"]').classes('border')).toBeTruthy()
    expect(wrapper.get('[data-test="edge-0,2"]').classes('border')).toBeFalsy()
  })

  it('should render the index of the vertex when "isShowingIndex" is true', () => {
    const adjacencyList = [
      [1, 2, 3],
      [0, 2, 3],
      [0, 1, 3],
      [0, 1, 2],
    ]
    const wrapper = createComponent({
      isShowingIndex: true,
      adjacencyList,
    })

    const liElements = wrapper.findAll('li')
    expect(liElements.length).toBe(adjacencyList.length)
    adjacencyList.forEach((row, index) => {
      const liElement = liElements[index]
      expect(liElement.text()).toEqual(`${index} [${row.join(',')}]`)
    })
  })
})
