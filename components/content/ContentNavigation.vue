<template>
  <nav class="pt-5 grid grid-cols-2 gap-4 border-t-[1px] border-current">
    <NuxtLink
      v-if="prevLink"
      :to="prevLink"
      class="btn no-animation flex-col btn-ghost normal-case font-normal items-start"
    >
      <span class="text-sm flex items-center gap-1">
        <i class="i-heroicons-chevron-left text-base" />Prev
      </span>
      <span class="text-success font-medium">{{ prevTitle }}</span>
    </NuxtLink>
    <NuxtLink
      v-if="nextLink"
      :to="nextLink"
      class="btn no-animation flex-col btn-ghost normal-case font-normal items-end col-start-2"
    >
      <span class="text-sm flex items-center gap-1">
        Next<i class="i-heroicons-chevron-right text-base" />
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
