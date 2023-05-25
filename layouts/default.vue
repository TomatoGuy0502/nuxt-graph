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
        :class="[isExpanded ? 'w-60' : 'w-[84px]']"
      >
        <ul class="menu gap-2">
          <li>
            <NuxtLink
              class="whitespace-nowrap rounded-lg leading-5"
              to="/"
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
              {{ isExpanded ? 'Item 1' : '' }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              class="whitespace-nowrap rounded-lg leading-5"
              to="/tutorial/basic"
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {{ isExpanded ? 'Item 2' : '' }}
            </NuxtLink>
          </li>
        </ul>
        <button class="btn" type="button" @click="toggle">
          {{ isExpanded ? '←' : '→' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isExpanded = ref(false)

const toggle = () => {
  isExpanded.value = !isExpanded.value
}
</script>
