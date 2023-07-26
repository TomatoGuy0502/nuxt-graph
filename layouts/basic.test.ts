// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import basicLayout from '~/layouts/basic.vue'

describe('basic layout', () => {
  it('should render slots', () => {
    const wrapper = mount(basicLayout, {
      slots: {
        content: '<div>Content</div>',
        svg: '<svg>SVG</svg>',
      },
    })

    expect(wrapper.html()).toContain('<div>Content</div>')
    expect(wrapper.html()).toContain('<svg>SVG</svg>')
  })
})
