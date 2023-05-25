<template>
  <div class="drawer-mobile drawer">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <slot></slot>
    </div>
    <div class="drawer-side">
      <label for="my-drawer" class="drawer-overlay"></label>
      <div
        class="flex flex-col gap-4 border-r-2 border-base-300 bg-base-200 p-4 text-base-content"
        :class="[isExpanded ? 'w-80' : 'w-[84px]']"
      >
        <ul class="menu gap-2">
          <li>
            <NuxtLink
              class="whitespace-nowrap rounded-lg leading-5"
              to="/tool"
              active-class="active"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              {{ isExpanded ? 'Tool' : '' }}
            </NuxtLink>
          </li>
        </ul>
        <ul class="menu menu-compact bg-base-100 p-2 rounded-box">
          <div
            v-for="(section, i) in tutorialSectionNames"
            :key="section"
            class="collapse collapse-arrow"
          >
            <input type="checkbox" class="min-h-fit" checked />
            <li class="collapse-title menu-title min-h-fit capitalize">
              {{ i + 1 }}. {{ section }}
            </li>
            <div class="collapse-content">
              <li
                v-for="(route, ii) in tutorialRoutes[section]"
                :key="route.name"
              >
                <NuxtLink :to="route.path" active-class="active"
                  >{{ i + 1 }}-{{ ii + 1 }}. {{ route.name }}</NuxtLink
                >
              </li>
            </div>
          </div>
        </ul>
        <button class="btn" type="button" @click="toggle">
          {{ isExpanded ? '←' : '→' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isExpanded = ref(true)

const toggle = () => {
  isExpanded.value = !isExpanded.value
}

interface TutorialRoute {
  name: string
  path: string
}

// Edit this array to add new tutorial routes
const tutorialSectionNames = ['basic', 'representation'] as const

const tutorialRoutes = tutorialSectionNames.reduce((acc, curr) => {
  acc[curr] = []
  return acc
}, {} as { [key in (typeof tutorialSectionNames)[number]]: TutorialRoute[] })

useRouter()
  .options.routes.filter((route) => route.path.startsWith('/tutorial'))
  .sort((a, b) => {
    const aPageOrder = a.meta?.pageOrder as number
    const bPageOrder = b.meta?.pageOrder as number
    return aPageOrder - bPageOrder
  })
  .forEach((route) => {
    const routeName = route.name as string
    const routePath = route.path as string
    if (routePath.startsWith('/tutorial')) {
      const tutorialRouteName = routePath.split(
        '/'
      )[2] as (typeof tutorialSectionNames)[number]
      tutorialRoutes[tutorialRouteName].push({
        name: routeName,
        path: routePath,
      })
    }
  })
</script>
