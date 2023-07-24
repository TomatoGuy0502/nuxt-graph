// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ContentCodeTab from './ContentCodeTab.vue'

describe('ContentCodeTab.vue', () => {
  it('should render tabs and tab contents', () => {
    const wrapper = mount(ContentCodeTab, {
      props: {
        initActiveTab: 1,
        tabNames: ['HTML', 'CSS', 'JS'],
      },
      slots: {
        HTML: '<div>HTML content</div>',
        CSS: '<div>CSS content</div>',
        JS: '<div>JS content</div>',
      },
      attachTo: document.body,
    })
    const getTabContent = (name: string) =>
      wrapper.get(`[data-test="tab-content-${name}"]`)

    expect(wrapper.html()).toContain('>HTML</button>')
    expect(wrapper.html()).toContain('>CSS</button>')
    expect(wrapper.html()).toContain('>JS</button>')

    expect(getTabContent('HTML').text()).toBe('HTML content')
    expect(getTabContent('CSS').text()).toBe('CSS content')
    expect(getTabContent('JS').text()).toBe('JS content')
  })

  it('should change tab content on tab click', async () => {
    const wrapper = mount(ContentCodeTab, {
      props: {
        initActiveTab: 1,
        tabNames: ['HTML', 'CSS', 'JS'],
      },
      slots: {
        HTML: '<div>HTML content</div>',
        CSS: '<div>CSS content</div>',
        JS: '<div>JS content</div>',
      },
      attachTo: document.body,
    })
    const getTabButton = (name: string) =>
      wrapper.get(`[data-test="tab-button-${name}"]`)
    const getTabContent = (name: string) =>
      wrapper.get(`[data-test="tab-content-${name}"]`)

    expect(getTabContent('HTML').isVisible()).toBeFalsy()
    expect(getTabContent('CSS').isVisible()).toBeTruthy()
    expect(getTabContent('JS').isVisible()).toBeFalsy()

    await getTabButton('JS').trigger('click')
    expect(getTabContent('HTML').isVisible()).toBeFalsy()
    expect(getTabContent('CSS').isVisible()).toBeFalsy()
    expect(getTabContent('JS').isVisible()).toBeTruthy()

    await getTabButton('HTML').trigger('click')
    expect(getTabContent('HTML').isVisible()).toBeTruthy()
    expect(getTabContent('CSS').isVisible()).toBeFalsy()
    expect(getTabContent('JS').isVisible()).toBeFalsy()
  })
})
