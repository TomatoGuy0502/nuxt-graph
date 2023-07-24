// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ContentHelp from './ContentHelp.vue'

describe('ContentHelp.vue', () => {
  it('should render slot content', () => {
    const wrapper = mount(ContentHelp, {
      slots: {
        default: 'Help message',
      },
    })
    expect(wrapper.text()).toContain('Help message')
  })
})
