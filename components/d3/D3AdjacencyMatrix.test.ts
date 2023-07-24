// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import D3AdjacencyMatrix from './D3AdjacencyMatrix.vue'

describe('D3AdjacencyMatrix.vue', () => {
  function createComponent(propsData: any = {}) {
    return mount(D3AdjacencyMatrix, {
      props: {
        adjacencyMatrix: [
          [0, 1, 1, 1],
          [1, 0, 1, 1],
          [1, 1, 0, 1],
          [1, 1, 1, 0],
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

  it('should render adjacencyMatrix correctly', () => {
    const adjacencyMatrix = [
      [0, 1, 1, 1],
      [1, 0, 1, 1],
      [1, 1, 0, 1],
      [1, 1, 1, 0],
    ]
    const wrapper = createComponent({ adjacencyMatrix })

    expect(wrapper.get('[data-test="header-top"]').text()).toBe('4,5,6,7')

    const liElements = wrapper.findAll('li')
    expect(liElements.length).toBe(adjacencyMatrix.length + 1) // +1 for the header row
    adjacencyMatrix.forEach((row, index) => {
      const liElement = liElements[index + 1] // +1 to skip the header row
      const nodeIds = wrapper.props().nodeIds

      expect(liElement.text()).toEqual(`${nodeIds[index]}[${row.join(',')}]`)
    })
  })

  it('should highlight row and col for the hovered vertex', () => {
    const adjacencyMatrix = [
      [0, 1, 1, 1],
      [1, 0, 1, 1],
      [1, 1, 0, 1],
      [1, 1, 1, 0],
    ]
    const wrapper = createComponent({
      adjacencyMatrix,
      hoverNode: { index: 2 },
    })

    expect(
      wrapper.get('[data-test="header-top-2"]').classes('bg-gray-700')
    ).toBeTruthy()
    expect(
      wrapper.get('[data-test="header-left-2"]').classes('bg-gray-700')
    ).toBeTruthy()
    expect(
      wrapper.get('li[data-test="row-2"]').classes('bg-gray-700')
    ).toBeTruthy()
    adjacencyMatrix.forEach((_, index) => {
      expect(
        wrapper.get(`code[data-index="${index},2"]`).classes('bg-gray-700')
      ).toBeTruthy()
    })
  })

  it('should highlight the hovered edge for both direction when "isDirected" is false', () => {
    const wrapper = createComponent({
      hoverEdge: {
        source: { index: 2 },
        target: { index: 0 },
      },
    })

    expect(
      wrapper.get('code[data-index="2,0"]').classes('bg-gray-700')
    ).toBeTruthy()
    expect(
      wrapper.get('code[data-index="0,2"]').classes('bg-gray-700')
    ).toBeTruthy()
  })

  it('should highlight the hovered edge for only one direction when "isDirected" is true', () => {
    const wrapper = createComponent({
      hoverEdge: {
        source: { index: 2 },
        target: { index: 0 },
      },
      isDirected: true,
    })

    expect(
      wrapper.get('code[data-index="2,0"]').classes('bg-gray-700')
    ).toBeTruthy()
    expect(
      wrapper.get('code[data-index="0,2"]').classes('bg-gray-700')
    ).toBeFalsy()
  })

  it('should render the index of the vertex when "isShowingIndex" is true', () => {
    const adjacencyMatrix = [
      [0, 1, 1, 1],
      [1, 0, 1, 1],
      [1, 1, 0, 1],
      [1, 1, 1, 0],
    ]
    const wrapper = createComponent({
      isShowingIndex: true,
      adjacencyMatrix,
    })

    expect(wrapper.get('[data-test="header-top"]').text()).toBe('0,1,2,3')

    const liElements = wrapper.findAll('li')
    expect(liElements.length).toBe(adjacencyMatrix.length + 1)
    adjacencyMatrix.forEach((row, index) => {
      const liElement = liElements[index + 1] // +1 to skip the header row
      expect(liElement.text()).toEqual(`${index}[${row.join(',')}]`)
    })
  })
})
