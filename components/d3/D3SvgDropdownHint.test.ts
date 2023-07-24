// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import D3SvgDropdownHint from './D3SvgDropdownHint.vue'

describe('D3SvgDropdownHint.vue', () => {
  it('should render drag hint when isDraggable is true', () => {
    const wrapper = mount(D3SvgDropdownHint, {
      props: {
        isDraggable: true,
      },
    })
    expect(wrapper.html()).toContain('<b>Drag</b> on vertex to move it')
  })

  it('should not render drag hint when isDraggable is false', () => {
    const wrapper = mount(D3SvgDropdownHint, {
      props: {
        isDraggable: false,
      },
    })
    expect(wrapper.html()).not.toContain('<b>Drag</b> on vertex to move it')
  })

  it('should render slots content', () => {
    const wrapper = mount(D3SvgDropdownHint, {
      slots: {
        'hint-start': '<div>hint-start</div>',
        hint: '<div>hint</div>',
        'hint-end': '<div>hint-end</div>',
      },
    })
    expect(wrapper.html()).toContain('<div>hint-start</div>')
    expect(wrapper.html()).toContain('<div>hint</div>')
    expect(wrapper.html()).toContain('<div>hint-end</div>')
    expect(wrapper.html()).not.toContain('<b>Left click</b>')
  })
})
