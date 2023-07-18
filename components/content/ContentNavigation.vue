<template>
  <nav class="pt-5 grid grid-cols-2 gap-4 border-t-[1px] border-current">
    <NuxtLink
      v-if="prevLink"
      :to="prevLink"
      class="btn no-animation flex-col btn-ghost normal-case font-normal items-start"
    >
      <span class="text-sm flex items-center gap-1"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-4 h-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>

        Prev</span
      >
      <span class="text-success font-medium">{{ prevTitle }}</span>
    </NuxtLink>
    <NuxtLink
      v-if="nextLink"
      :to="nextLink"
      class="btn no-animation flex-col btn-ghost normal-case font-normal items-end col-start-2"
    >
      <span class="text-sm flex items-center gap-1"
        >Next<svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-4 h-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </span>
      <span class="text-success font-medium">{{ nextTitle }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
defineProps({
  prevLink: {
    type: String,
    default: '',
  },
  prevTitle: {
    type: String,
    default: '',
  },
  nextLink: {
    type: String,
    default: '',
  },
  nextTitle: {
    type: String,
    default: '',
  },
})
</script>
