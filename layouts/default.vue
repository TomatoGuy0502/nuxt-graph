<template>
  <div class="drawer-mobile drawer">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <div class="navbar bg-base-100 p-4">
        <div class="flex-none lg:hidden">
          <label for="my-drawer" class="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block w-6 h-6 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>
        </div>
        <div class="flex-1">
          <NuxtLink class="btn btn-ghost normal-case text-xl lg:hidden" to="/"
            >Graph Theory</NuxtLink
          >
          <h1 class="normal-case text-xl hidden lg:inline-flex font-bold">
            {{ $route.name }}
          </h1>
        </div>
        <div class="flex-none">
          <button class="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block w-5 h-5 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <slot></slot>
    </div>
    <div class="drawer-side">
      <label for="my-drawer" class="drawer-overlay"></label>
      <div
        class="flex flex-col gap-4 border-r-2 border-base-300 bg-base-200 p-4 text-base-content"
        :class="[isExpanded ? 'w-80' : 'w-[84px]']"
      >
        <NuxtLink
          class="btn btn-ghost normal-case text-xl hidden lg:inline-flex"
          to="/"
          >Graph Theory</NuxtLink
        >
        <ul class="menu gap-2">
          <li>
            <NuxtLink
              class="whitespace-nowrap rounded-lg leading-5"
              to="/playground"
              active-class="active"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"
                />
              </svg>

              {{ isExpanded ? 'Playground' : '' }}
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
