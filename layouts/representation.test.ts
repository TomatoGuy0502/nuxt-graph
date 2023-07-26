// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import representationLayout from '~/layouts/representation.vue'

describe('representation layout', () => {
  it('should render slots', () => {
    const wrapper = mount(representationLayout, {
      slots: {
        content: '<div>Content</div>',
        svg: '<svg>SVG</svg>',
        representation: '<div>Representation</div>',
      },
    })

    expect(wrapper.html()).toContain('<div>Content</div>')
    expect(wrapper.html()).toContain('<svg>SVG</svg>')
    expect(wrapper.html()).toContain('<div>Representation</div>')
  })
})
