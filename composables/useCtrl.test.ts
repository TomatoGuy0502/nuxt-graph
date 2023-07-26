// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { vi, describe, expect, it } from 'vitest'
import { useCtrl } from './useCtrl'

describe('useCtrl', () => {
  const TestComponent = {
    setup() {
      const { isCtrlOrCmdPressed } = useCtrl()
      return { isCtrlOrCmdPressed }
    },
    template: '<div></div>',
  }

  it('should detect Cmd is pressed (when platform is Mac)', async () => {
    vi.stubGlobal('navigator', { userAgent: 'Intel Mac OS X' })

    const wrapper = mount(TestComponent, {
      attachTo: document.body,
    })
    expect(wrapper.vm.isCtrlOrCmdPressed).toBe(false)

    await wrapper.trigger('keydown', { key: 'Meta' })
    expect(wrapper.vm.isCtrlOrCmdPressed).toBe(true)

    await wrapper.trigger('keyup', { key: 'Meta' })
    expect(wrapper.vm.isCtrlOrCmdPressed).toBe(false)
  })

  it('should detect Ctrl is pressed (when platform is not Mac)', () => {
    vi.stubGlobal('navigator', { userAgent: 'Windows' })

    const wrapper = mount(TestComponent, {
      attachTo: document.body,
    })
    expect(wrapper.vm.isCtrlOrCmdPressed).toBe(false)

    wrapper.trigger('keydown', { key: 'Control' })
    expect(wrapper.vm.isCtrlOrCmdPressed).toBe(true)

    wrapper.trigger('keyup', { key: 'Control' })
    expect(wrapper.vm.isCtrlOrCmdPressed).toBe(false)
  })
})
