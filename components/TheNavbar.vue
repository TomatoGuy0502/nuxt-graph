<template>
  <div class="navbar gap-2 bg-base-100 p-4">
    <div class="flex-none min-[1640px]:hidden">
      <label for="my-drawer" class="btn-ghost btn-square btn">
        <i class="i-heroicons-bars-3-20-solid text-2xl" />
      </label>
    </div>
    <div class="flex-1">
      <!-- <NuxtLink class="btn-ghost btn text-xl normal-case xl:hidden" to="/"
            >Graph Theory</NuxtLink
          > -->
      <h1 class="block text-3xl font-bold normal-case">
        <slot></slot>
      </h1>
    </div>
    <div class="flex-none">
      <NuxtLink
        class="btn-ghost btn-square btn"
        to="https://github.com/TomatoGuy0502/nuxt-graph"
        target="_blank"
      >
        <i class="i-tabler-brand-github text-2xl" />
      </NuxtLink>
    </div>
  </div>
</template>
