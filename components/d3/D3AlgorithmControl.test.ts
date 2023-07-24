// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import D3AlgorithmControl from './D3AlgorithmControl.vue'

describe('D3AlgorithmControl.vue', () => {
  function createComponent(propsData: any = {}) {
    return mount(D3AlgorithmControl, {
      props: {
        nodeIds: [2, 3, 4, 7, 8],
        visitingTraversalIndex: null,
        traversalStartNodeIndex: 0,
        isPlaying: false,
        ...propsData,
      },
    })
  }

  const getPrevStepButton = (wrapper: ReturnType<typeof mount>) =>
    wrapper.get('[data-test="prev-step-button"]')
  const getNextStepButton = (wrapper: ReturnType<typeof mount>) =>
    wrapper.get('[data-test="next-step-button"]')
  const getStartNodeIdSelect = (wrapper: ReturnType<typeof mount>) =>
    wrapper.get<HTMLSelectElement>('[data-test="start-node-id-select"]')
  const getPlayerButton = (wrapper: ReturnType<typeof mount>) =>
    wrapper.get('[data-test="play-button"]')

  it('should render correctly with initial props', () => {
    const wrapper = createComponent()
    expect(getStartNodeIdSelect(wrapper).element.value).toBe('0')
    expect(getStartNodeIdSelect(wrapper).text()).toBe('23478')
    expect(getNextStepButton(wrapper).text()).toContain('First Step')
    expect(wrapper.find('.i-heroicons-pause-solid').exists()).toBeFalsy()
    expect(wrapper.get('.i-heroicons-play-solid')).toBeTruthy()
  })

  it('should update traversalStartNodeIndex when select changes', async () => {
    const wrapper = createComponent({
      'onUpdate:traversalStartNodeIndex': (index: number) => {
        wrapper.setProps({ traversalStartNodeIndex: index })
      },
    })
    await getStartNodeIdSelect(wrapper).setValue('2')
    expect(wrapper.props('traversalStartNodeIndex')).toBe(2)
  })

  it('should render different text in next step button based on visitingTraversalIndex', async () => {
    const wrapper = createComponent()
    expect(getNextStepButton(wrapper).text()).toContain('First Step')

    await wrapper.setProps({ visitingTraversalIndex: 0 })
    expect(getNextStepButton(wrapper).text()).toContain('Next Step')

    await wrapper.setProps({ visitingTraversalIndex: 4 })
    expect(getNextStepButton(wrapper).text()).toContain('Finish')
  })

  it('should disable the prev/next step button when isPlaying is true', () => {
    const wrapper = createComponent({
      visitingTraversalIndex: 1,
      isPlaying: true,
    })
    expect(getPrevStepButton(wrapper).classes('btn-disabled')).toBeTruthy()
    expect(getPrevStepButton(wrapper).attributes('disabled')).toBe('')
    expect(getNextStepButton(wrapper).classes('btn-disabled')).toBeTruthy()
    expect(getNextStepButton(wrapper).attributes('disabled')).toBe('')
  })

  it('should emit "play" event when "Auto Play" button clicked', async () => {
    const wrapper = createComponent()

    await getPlayerButton(wrapper).trigger('click')
    expect(wrapper.emitted()).toHaveProperty('play')
  })

  it('should emit "goNextStep" event when "Next Step" button clicked', async () => {
    const wrapper = createComponent()

    await getNextStepButton(wrapper).trigger('click')
    expect(wrapper.emitted()).toHaveProperty('goNextStep')
  })

  it("should disable prev step button when it haven't started first step", () => {
    const wrapper = createComponent()

    expect(getPrevStepButton(wrapper).attributes('disabled')).toBe('')
  })

  it('should emit "goPrevStep" event when "Prev Step" button clicked if it\'s not first step', async () => {
    const wrapper = createComponent({ visitingTraversalIndex: 1 })

    await getPrevStepButton(wrapper).trigger('click')
    expect(wrapper.emitted()).toHaveProperty('goPrevStep')
  })
})
