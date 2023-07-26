// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ContentHowToButton from './ContentHowToButton.vue'

describe('ContentHowToButton.vue', () => {
  it('should render', () => {
    const wrapper = mount(ContentHowToButton)
    expect(wrapper.get('.i-heroicons-light-bulb')).toBeTruthy()
  })
})
