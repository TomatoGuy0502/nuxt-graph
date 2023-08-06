// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { vi, describe, expect, it } from 'vitest'
import ContentExercise from './ContentExercise.vue'

describe('ContentExercise.vue', () => {
  it('should render slot content', () => {
    vi.stubGlobal('useState', () => ref(0))

    const wrapper = mount(ContentExercise, {
      props: {
        numberOfExercises: 2,
      },
      slots: {
        'exercise-1': 'Exercise 1',
        'exercise-2': 'Exercise 2',
      },
    })
    expect(wrapper.text()).toContain('Exercise 1')
    expect(wrapper.text()).toContain('Exercise 2')
  })

  it('should show exercise status', async () => {
    const finishedExercise = ref(0)
    vi.stubGlobal('useState', () => finishedExercise)

    const wrapper = mount(ContentExercise, {
      props: {
        numberOfExercises: 2,
      },
      slots: {
        'exercise-1': 'Exercise 1',
        'exercise-2': 'Exercise 2',
      },
      attachTo: document.body,
    })
    const isExerciseFinished = (exercise: number) =>
      wrapper
        .get(`[data-test="exercise-${exercise}"]`)
        .find('label.swap-active')
        .exists()

    expect(isExerciseFinished(1)).toBeFalsy()
    expect(isExerciseFinished(2)).toBeFalsy()

    finishedExercise.value = 1
    await nextTick()
    expect(isExerciseFinished(1)).toBeTruthy()
    expect(isExerciseFinished(2)).toBeFalsy()

    finishedExercise.value = 2
    await nextTick()
    expect(isExerciseFinished(1)).toBeTruthy()
    expect(isExerciseFinished(2)).toBeTruthy()
  })
})
