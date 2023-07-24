// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import D3EdgeList from './D3EdgeList.vue'

describe('D3EdgeList.vue', () => {
  it('should render sorted edge list', () => {
    const wrapper = mount(D3EdgeList, {
      props: {
        edges: [
          { source: { id: 0, index: 0 }, target: { id: 1, index: 1 } },
          { source: { id: 0, index: 0 }, target: { id: 3, index: 3 } },
          { source: { id: 3, index: 3 }, target: { id: 2, index: 2 } },
          { source: { id: 0, index: 0 }, target: { id: 2, index: 2 } },
          { source: { id: 2, index: 2 }, target: { id: 3, index: 3 } },
        ],
        hoverEdge: null,
        isDirected: true,
        isShowingIndex: false,
      },
    })
    expect(wrapper.text()).toBe('[ [0,1],[0,2],[0,3],[2,3],[3,2] ]')
  })

  it('should only show one edge (if there are both directions) in edge list when isDirected is false', () => {
    const wrapper = mount(D3EdgeList, {
      props: {
        edges: [
          { source: { id: 0, index: 0 }, target: { id: 1, index: 1 } },
          { source: { id: 1, index: 1 }, target: { id: 0, index: 0 } },
        ],
        hoverEdge: null,
        isDirected: false,
        isShowingIndex: false,
      },
    })
    expect(wrapper.text()).toBe('[ [0,1] ]')
  })

  it('should show edge index in edge list when isShowingIndex is true', () => {
    const wrapper = mount(D3EdgeList, {
      props: {
        edges: [
          { source: { id: 0, index: 0 }, target: { id: 4, index: 1 } },
          { source: { id: 0, index: 0 }, target: { id: 5, index: 2 } },
          { source: { id: 0, index: 0 }, target: { id: 6, index: 3 } },
        ],
        hoverEdge: null,
        isDirected: false,
        isShowingIndex: true,
      },
    })
    expect(wrapper.text()).toBe('[ [0,1],[0,2],[0,3] ]')
  })

  it('should highlight hovered edge in edge list', () => {
    const wrapper = mount(D3EdgeList, {
      props: {
        edges: [
          { source: { id: 0, index: 0 }, target: { id: 1, index: 1 } },
          { source: { id: 0, index: 0 }, target: { id: 3, index: 3 } },
        ],
        hoverEdge: { source: { id: 0, index: 0 }, target: { id: 3, index: 3 } },
        isDirected: true,
        isShowingIndex: false,
      },
    })
    expect(wrapper.find('.bg-gray-700').text()).toBe('[0,3]')
  })
})
