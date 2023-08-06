// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { vi, describe, expect, it } from 'vitest'
import { useExercise } from './useExercise'

describe('useExercise', () => {
  const TestComponent = {
    setup() {
      const { finishedExercise } = useExercise()
      return { finishedExercise }
    },
    template: '<div></div>',
  }

  it('should initialize finishedExercise as 0', () => {
    vi.stubGlobal('useState', () => ref(5))

    const wrapper = mount(TestComponent)
    expect(wrapper.vm.finishedExercise).toBe(0)
  })
})
