// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import D3Svg from './D3Svg.vue'

describe('D3Svg.vue', () => {
  it('should render toggles properly', async () => {
    const wrapper = mount(D3Svg, {
      props: {
        canToggleShowingIndex: true,
        canToggleDirected: true,
        isShowingIndex: false,
        isDirected: true,
      },
    })
    const getToggleShowingIndexButton = () =>
      wrapper.get('[data-test="toggle-showing-index-button"]')
    const getToggleDirectedButton = () =>
      wrapper.get('[data-test="toggle-directed-button"]')
    const isShowingIndexChecked = () =>
      getToggleShowingIndexButton().find('input').element.checked
    const isDirectedChecked = () =>
      getToggleDirectedButton().find('input').element.checked

    expect(getToggleShowingIndexButton()).toBeTruthy()
    expect(isShowingIndexChecked()).toBeFalsy()
    expect(getToggleDirectedButton()).toBeTruthy()
    expect(isDirectedChecked()).toBeTruthy()

    await wrapper.setProps({
      canToggleShowingIndex: false,
      canToggleDirected: false,
    })
    expect(getToggleShowingIndexButton).toThrowError()
    expect(getToggleDirectedButton).toThrowError()
  })

  it('should handle showing index button toggle', async () => {
    const wrapper = mount(D3Svg, {
      props: {
        canToggleShowingIndex: true,
        isShowingIndex: false,
        'onUpdate:isShowingIndex': (value: boolean) => {
          wrapper.setProps({ isShowingIndex: value })
        },
      },
    })
    const getToggleShowingIndexCheckbox = () =>
      wrapper.get('[data-test="toggle-showing-index-button"] input')

    await getToggleShowingIndexCheckbox().setValue(true)
    expect(wrapper.emitted('update:isShowingIndex')).toBeTruthy()
    expect(wrapper.emitted('update:isShowingIndex')![0]).toEqual([true])
    expect(wrapper.props('isShowingIndex')).toBeTruthy()

    await getToggleShowingIndexCheckbox().setValue(false)
    expect(wrapper.emitted('update:isShowingIndex')).toBeTruthy()
    expect(wrapper.emitted('update:isShowingIndex')![1]).toEqual([false])
    expect(wrapper.props('isShowingIndex')).toBeFalsy()
  })

  it('should handle directed button toggle', async () => {
    const wrapper = mount(D3Svg, {
      props: {
        canToggleDirected: true,
        isDirected: false,
        'onUpdate:isDirected': (value: boolean) => {
          wrapper.setProps({ isDirected: value })
        },
      },
    })

    const getToggleDirectedCheckbox = () =>
      wrapper.get('[data-test="toggle-directed-button"] input')

    await getToggleDirectedCheckbox().setValue(true)
    expect(wrapper.emitted('update:isDirected')).toBeTruthy()
    expect(wrapper.emitted('update:isDirected')![0]).toEqual([true])
    expect(wrapper.props('isDirected')).toBeTruthy()

    await getToggleDirectedCheckbox().setValue(false)
    expect(wrapper.emitted('update:isDirected')).toBeTruthy()
    expect(wrapper.emitted('update:isDirected')![1]).toEqual([false])
    expect(wrapper.props('isDirected')).toBeFalsy()
  })

  it('should render info properly', () => {
    const wrapper = mount(D3Svg, {
      slots: {
        info: '<div>Info</div>',
      },
    })

    expect(wrapper.html()).toContain('>Info</div>')
  })

  it('should render buttons properly', async () => {
    const wrapper = mount(D3Svg, {
      props: {
        showGenerateRandomGraphBtn: true,
      },
      slots: {
        'extra-buttons': '<button>Extra Button</button>',
        'clear-button-text': 'Clear All',
      },
    })
    const getGenerateRandomGraphButton = () =>
      wrapper.get('[data-test="generate-random-graph-button"]')
    const getClearDataButton = () =>
      wrapper.get('[data-test="clear-data-button"]')

    expect(wrapper.html()).toContain('>Extra Button</button>')
    expect(getGenerateRandomGraphButton()).toBeTruthy()
    expect(getClearDataButton().text()).toBe('Clear All')

    await wrapper.setProps({ showGenerateRandomGraphBtn: false })
    expect(getGenerateRandomGraphButton).toThrowError()
  })

  it('should render dropdown hints properly', () => {
    const wrapper = mount(D3Svg, {
      slots: {
        'hint-start': '<div>hint-start</div>',
        hint: '<div>hint</div>',
        'hint-end': '<div>hint-end</div>',
      },
    })
    expect(wrapper.html()).toContain('>hint-start</div>')
    expect(wrapper.html()).toContain('>hint</div>')
    expect(wrapper.html()).toContain('>hint-end</div>')
  })

  it('should render node tooltips properly', async () => {
    const wrapper = mount(D3Svg, {
      props: {
        hoverNode: {
          id: 3,
          index: 3,
          x: 50,
          y: 120,
        },
      },
      slots: {
        nodeTooltip: `
          <template #nodeTooltip="{ hoverNodeInfo }">
            <div>id:{{ hoverNodeInfo.id }},index:{{ hoverNodeInfo.index }}</div>
          </template>
        `,
      },
    })
    const getNodeTooltip = () => wrapper.get('[data-test="node-tooltip"]')

    expect(getNodeTooltip().classes()).not.toContain('opacity-0')
    expect(getNodeTooltip().text()).toContain('id:3,index:3')
    expect(getNodeTooltip().attributes('style')).toContain(
      'top: 130px; left: 60px;'
    )

    await wrapper.setProps({
      hoverNode: null,
    })
    expect(getNodeTooltip().classes()).toContain('opacity-0')
    expect(getNodeTooltip().text()).toContain('id:3,index:3')

    await wrapper.setProps({
      hoverNode: {
        id: 6,
        index: 4,
        x: 80,
        y: 20,
      },
    })
    expect(getNodeTooltip().classes()).not.toContain('opacity-0')
    expect(getNodeTooltip().text()).toContain('id:6,index:4')
    expect(getNodeTooltip().attributes('style')).toContain(
      'top: 30px; left: 90px;'
    )
  })

  it('should handle svg events', async () => {
    const wrapper = mount(D3Svg)

    await wrapper.find('svg').trigger('mousedown')
    await wrapper.find('svg').trigger('mousemove')
    await wrapper.find('svg').trigger('mouseup')
    await wrapper.find('svg').trigger('mouseleave')

    expect(wrapper.emitted()).toHaveProperty('svgMousedown')
    expect(wrapper.emitted()).toHaveProperty('svgMousemove')
    expect(wrapper.emitted()).toHaveProperty('svgMouseup')
    expect(wrapper.emitted()).toHaveProperty('svgMouseleave')
  })

  it('should show drawing line when drawing edge', async () => {
    const wrapper = mount(D3Svg, {
      props: {
        hasMouseDownNode: true,
        drawEdgeCords: {
          x1: 10,
          y1: 20,
          x2: 30,
          y2: 40,
        },
        isDirected: true,
      },
    })
    const getDrawEdgeLine = () => wrapper.get('[data-test="draw-edge-line"]')

    expect(getDrawEdgeLine().classes()).toContain('stroke-current')
    expect(getDrawEdgeLine().attributes()).toMatchObject({
      x1: '10',
      y1: '20',
      x2: '30',
      y2: '40',
    })
    expect(getDrawEdgeLine().attributes('marker-end')).not.toBe('none')

    await wrapper.setProps({
      isDirected: false,
    })
    expect(getDrawEdgeLine().attributes('marker-end')).toBe('none')

    await wrapper.setProps({
      isDirected: true,
      hasMouseDownNode: false,
    })
    expect(getDrawEdgeLine().classes()).toContain('stroke-none')
    expect(getDrawEdgeLine().attributes('marker-end')).toBe('none')
  })

  it('should emit clearData event on clear data button click', async () => {
    const wrapper = mount(D3Svg)

    await wrapper.find('[data-test="clear-data-button"]').trigger('click')

    expect(wrapper.emitted().clearData).toBeTruthy()
  })
})
