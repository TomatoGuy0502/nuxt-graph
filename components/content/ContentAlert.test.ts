// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ContentAlert from './ContentAlert.vue'

describe('ContentAlert.vue', () => {
  it('should render slot content', () => {
    const wrapper = mount(ContentAlert, {
      slots: {
        default: 'Alert message',
      },
    })
    expect(wrapper.text()).toContain('Alert message')
  })
})
