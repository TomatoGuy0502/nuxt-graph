<template>
  <div class="drawer 2xl:drawer-open h-screen">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col overflow-y-auto">
      <div class="navbar bg-base-100 p-4 gap-2">
        <div class="flex-none 2xl:hidden">
          <label for="my-drawer" class="btn-ghost btn-square btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block h-6 w-6 stroke-current"
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
          <!-- <NuxtLink class="btn-ghost btn text-xl normal-case xl:hidden" to="/"
            >Graph Theory</NuxtLink
          > -->
          <h1 class="block text-xl font-bold normal-case">
            {{ $route.name }}
          </h1>
        </div>
        <div class="flex-none">
          <button class="btn-ghost btn-square btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block h-5 w-5 stroke-current"
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
      <!-- Page content goes here -->
      <slot></slot>
    </div>
    <div class="drawer-side">
      <label for="my-drawer" class="drawer-overlay"></label>
      <div
        class="flex h-screen w-80 flex-col gap-4 border-r-2 border-base-300 bg-base-200 p-4 text-base-content"
      >
        <NuxtLink
          class="btn-ghost btn hidden text-xl normal-case lg:inline-flex"
          to="/"
          >Graph Theory</NuxtLink
        >
        <ul class="menu gap-2 p-0">
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
                class="h-5 w-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"
                />
              </svg>
              Playground
            </NuxtLink>
          </li>
        </ul>
        <ul class="menu rounded-box bg-base-100">
          <li class="menu-title">Tutorial</li>
          <li
            v-for="(section, i) in tutorialSectionNames"
            :key="section"
            class="w-full"
          >
            <details class="w-full" open>
              <summary class="text-sm font-bold capitalize">
                {{ i + 1 }}. {{ section }}
              </summary>
              <ul>
                <li
                  v-for="(route, ii) in tutorialRoutes[section]"
                  :key="route.name"
                >
                  <NuxtLink
                    class="block whitespace-break-spaces"
                    :to="route.path"
                    active-class="active"
                    >{{ i + 1 }}-{{ ii + 1 }}. {{ route.name }}</NuxtLink
                  >
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TutorialRoute {
  name: string
  path: string
}

// Edit this array to add new tutorial routes
const tutorialSectionNames = ['basic', 'representation', 'algorithm'] as const

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
