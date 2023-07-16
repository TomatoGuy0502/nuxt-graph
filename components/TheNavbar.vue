<template>
  <div class="navbar gap-2 bg-base-100 p-4">
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
      <h1 class="block text-3xl font-bold normal-case">
        <slot></slot>
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
</template>
