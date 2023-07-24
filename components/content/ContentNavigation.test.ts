// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ContentNavigation from './ContentNavigation.vue'

describe('ContentNavigation.vue', () => {
  it('should render prevLink and nextLink', () => {
    const wrapper = mount(ContentNavigation, {
      props: {
        prevLink: '/vertex-and-edge',
        prevTitle: 'Vertex and Edge',
        nextLink: '/degree-of-vertex',
        nextTitle: 'Degree of vertex',
      },
    })
    const getPrevLink = () => wrapper.get('[data-test="prev-link"]')
    const getNextLink = () => wrapper.get('[data-test="next-link"]')

    expect(getPrevLink().attributes('to')).toBe('/vertex-and-edge')
    expect(getPrevLink().text()).toContain('Vertex and Edge')
    expect(getNextLink().attributes('to')).toBe('/degree-of-vertex')
    expect(getNextLink().text()).toContain('Degree of vertex')
  })
  it('should only render link if it is provided', async () => {
    const wrapper = mount(ContentNavigation, {
      props: {
        prevLink: '/vertex-and-edge',
        prevTitle: 'Vertex and Edge',
        nextTitle: 'Degree of vertex',
      },
    })
    const getPrevLink = () => wrapper.get('[data-test="prev-link"]')
    const getNextLink = () => wrapper.get('[data-test="next-link"]')

    expect(getPrevLink().attributes('to')).toBe('/vertex-and-edge')
    expect(getPrevLink().text()).toContain('Vertex and Edge')
    expect(getNextLink).toThrowError()

    await wrapper.setProps({
      prevLink: undefined,
      nextLink: '/degree-of-vertex',
      nextTitle: 'Degree of vertex',
    })
    expect(getPrevLink).toThrowError()
    expect(getNextLink().attributes('to')).toBe('/degree-of-vertex')
    expect(getNextLink().text()).toContain('Degree of vertex')
  })
})
