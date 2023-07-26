<template>
  <div class="drawer h-screen min-[1640px]:drawer-open">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col overflow-y-auto">
      <TheNavbar data-test="navbar">{{ navbarHeading }}</TheNavbar>
      <!-- Page content goes here -->
      <slot></slot>
    </div>
    <div class="drawer-side z-10">
      <label for="my-drawer" class="drawer-overlay"></label>
      <div
        class="flex h-screen w-80 flex-col gap-4 border-r-2 border-base-300 bg-base-200 p-4 text-base-content"
      >
        <NuxtLink
          class="btn-ghost btn hidden text-xl font-bold normal-case lg:inline-flex"
          to="/"
          ><span
            class="bg-gradient-to-r from-success to-info bg-clip-text text-transparent"
            >Graph Theory</span
          ></NuxtLink
        >
        <ul class="menu gap-2 p-0">
          <li>
            <NuxtLink
              class="whitespace-nowrap rounded-lg leading-5"
              to="/playground"
              active-class="active"
            >
              <i class="i-heroicons-cube-transparent-20-solid text-xl" />
              Playground
            </NuxtLink>
          </li>
        </ul>
        <ul class="menu rounded-box bg-base-100 flex-nowrap overflow-y-auto">
          <li class="menu-title">Tutorial</li>
          <li
            v-for="(section, sectionNumber) in tutorialSectionNames"
            :key="section"
            :data-test="`tutorial-section-${section}`"
            class="w-full"
          >
            <details class="w-full" open>
              <summary class="text-sm font-bold capitalize">
                {{ sectionNumber + 1 }}. {{ section }}
              </summary>
              <ul>
                <li
                  v-for="(chapterRoute, chapterNumber) in tutorialRoutes[
                    section
                  ]"
                  :key="chapterRoute.name"
                >
                  <NuxtLink
                    class="block whitespace-break-spaces"
                    :to="chapterRoute.path"
                    active-class="active"
                    >{{ sectionNumber + 1 }}-{{ chapterNumber + 1 }}.
                    {{ chapterRoute.name }}</NuxtLink
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

const tutorialRoutes = tutorialSectionNames.reduce(
  (routes, sectionName) => {
    routes[sectionName] = []
    return routes
  },
  {} as { [key in (typeof tutorialSectionNames)[number]]: TutorialRoute[] }
)

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
    // '/tutorial/algorithm/depth-first-search' => 'algorithm'
    const sectionName = routePath.split(
      '/'
    )[2] as (typeof tutorialSectionNames)[number]
    tutorialRoutes[sectionName].push({
      name: routeName,
      path: routePath,
    })
  })

const route = useRoute()
const navbarHeading = computed(() => {
  if (route.path.startsWith('/tutorial')) {
    const sectionName = route.path.split(
      '/'
    )[2] as (typeof tutorialSectionNames)[number]
    return 'Tutorial - ' + sectionName[0].toUpperCase() + sectionName.slice(1)
  }
  if (route.name === 'index') {
    return 'Welcome to Graph Theory'
  }
  return route.name
})
</script>
