// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { vi, describe, expect, it } from 'vitest'
import { usePlatform } from './usePlatform'

describe('usePlatform', () => {
  const TestComponent = {
    setup() {
      const { isMac } = usePlatform()
      return { isMac }
    },
    template: '<div></div>',
  }

  it('should detect it is Mac platform', () => {
    vi.stubGlobal('navigator', { userAgent: 'Intel Mac OS X 10_15_7' })

    const wrapper = mount(TestComponent)
    expect(wrapper.vm.isMac).toBe(true)
  })

  it('should detect it is not Mac platform', () => {
    vi.stubGlobal('navigator', { userAgent: 'Windows' })

    const wrapper = mount(TestComponent)
    expect(wrapper.vm.isMac).toBe(false)
  })
})
