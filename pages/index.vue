<template>
  <div
    class="relative flex h-full w-full items-center justify-center p-6 sm:p-12"
  >
    <div class="absolute inset-0 bg-[url(~/assets/svg/grid.svg)]"></div>
    <div class="relative flex flex-col items-center text-center">
      <h1 class="mb-4 text-6xl font-black">
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
        class="btn-success btn-outline btn border-2 normal-case"
        :to="{ name: 'Vertex and Edge' }"
      >
        Get Started
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Graph Theory',
  meta: [
    {
      name: 'description',
      content:
        'Graph Theory made simple! Learn Graph Theory basic knowledge, representations, and algorithms with interactive lessons and hands-on exercises.',
    },
  ],
})
</script>
