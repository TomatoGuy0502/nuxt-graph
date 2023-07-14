<template>
  <div
    class="relative w-full h-full flex items-center justify-center p-6 sm:p-12"
  >
    <div class="absolute inset-0 bg-[url(~/assets/svg/grid.svg)]"></div>
    <div class="relative flex flex-col items-center text-center">
      <p
        class="rounded-full border border-base-content/80 px-3 py-1 mb-6 text-sm text-base-content/80"
      >
        The current version is for research experimental purposes
      </p>
      <h1 class="mb-2 font-black text-6xl">
        <span
          class="bg-gradient-to-r from-success to-info bg-clip-text text-transparent"
          >Graph Theory</span
        ><br />
        Interactive Learning Platform
      </h1>
      <p class="mb-8 max-w-[800px]">
        Graph Theory made simple! Learn Graph Theory basic knowledge,
        representations, and algorithms with interactive lessons and hands-on
        exercises.
      </p>
      <NuxtLink
        class="btn btn-outline btn-success border-2 normal-case"
        :to="{ name: 'Vertex and Edge' }"
      >
        Get Started
      </NuxtLink>
    </div>
  </div>
</template>
