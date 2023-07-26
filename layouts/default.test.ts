// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { vi, describe, expect, it, afterAll } from 'vitest'
import defaultLayout from './default.vue'

describe('default layout', () => {
  vi.stubGlobal('useRoute', () => ({
    path: '/tutorial/representation/adjacency-matrix',
    name: 'Adjacency Matrix',
  }))
  vi.stubGlobal('useRouter', () => ({
    options: {
      routes: [
        { path: '/', name: 'index' },
        {
          path: '/tutorial/basic/vertex-and-edge',
          name: 'Vertex and Edge',
          meta: { pageOrder: 1 },
        },
        {
          path: '/tutorial/representation/adjacency-matrix',
          name: 'Adjacency Matrix',
          meta: { pageOrder: 1 },
        },
        {
          path: '/tutorial/algorithm/depth-first-search',
          name: 'Depth First Search',
          meta: { pageOrder: 1 },
        },
        {
          path: '/tutorial/algorithm/breadth-first-search',
          name: 'Breadth First Search',
          meta: { pageOrder: 2 },
        },
      ],
    },
  }))

  afterAll(() => {
    vi.unstubAllGlobals()
  })

  it('should render default slot', () => {
    const wrapper = mount(defaultLayout, {
      slots: {
        default: '<div>Default</div>',
      },
      global: {
        stubs: {
          NuxtLink: {
            template: `<a><slot /></a>`,
          },
        },
      },
    })

    expect(wrapper.html()).toContain('<div>Default</div>')
  })

  it('should render navbar heading based on current route', () => {
    const wrapper = mount(defaultLayout, {
      global: {
        stubs: {
          NuxtLink: {
            template: `<a><slot /></a>`,
          },
        },
      },
    })

    expect(wrapper.get('[data-test="navbar"]').text()).toContain(
      'Tutorial - Representation'
    )
  })

  it('should render links for each section', () => {
    const wrapper = mount(defaultLayout, {
      global: {
        stubs: {
          NuxtLink: {
            template: `<a><slot /></a>`,
          },
        },
      },
    })
    const getSection = (section: string) =>
      wrapper.get(`[data-test="tutorial-section-${section}"]`)
    const getSectionLinks = (section: string) =>
      getSection(section).findAll('a')

    expect(getSection('basic').text()).toContain('1. basic')
    expect(getSection('representation').text()).toContain('2. representation')
    expect(getSection('algorithm').text()).toContain('3. algorithm')

    expect(getSectionLinks('basic').length).toBe(1)
    expect(getSectionLinks('basic')[0].text()).toBe('1-1. Vertex and Edge')
    expect(getSectionLinks('representation').length).toBe(1)
    expect(getSectionLinks('representation')[0].text()).toBe(
      '2-1. Adjacency Matrix'
    )
    expect(getSectionLinks('algorithm').length).toBe(2)
    expect(getSectionLinks('algorithm')[1].text()).toBe(
      '3-2. Breadth First Search'
    )
  })
})
