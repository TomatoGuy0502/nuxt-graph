// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import algorithmLayout from '~/layouts/algorithm.vue'

describe('algorithm layout', () => {
  it('should render slots', () => {
    const wrapper = mount(algorithmLayout, {
      slots: {
        content: '<div>Content</div>',
        svg: '<svg>SVG</svg>',
        control: '<div>Controls</div>',
        result: '<ul><li>Result</li></ul>',
      },
    })

    expect(wrapper.html()).toContain('<div>Content</div>')
    expect(wrapper.html()).toContain('<svg>SVG</svg>')
    expect(wrapper.html()).toContain('<div>Controls</div>')
    expect(wrapper.html({ raw: true })).toContain('<ul><li>Result</li></ul>')
  })
})
