// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TheNavbar from './TheNavbar.vue'

describe('TheNavbar.vue', () => {
  it('should render slot content', () => {
    const wrapper = mount(TheNavbar, {
      slots: {
        default: 'Playground',
      },
    })
    expect(wrapper.text()).toContain('Playground')
  })
})
