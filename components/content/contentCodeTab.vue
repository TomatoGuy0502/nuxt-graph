<template>
  <div>
    <div class="tabs w-fit -mb-6">
      <button
        v-for="(tabName, i) in tabNames"
        :key="tabName"
        class="tab tab-lifted font-medium"
        :class="[
          activeTab === i
            ? 'tab-active [--tab-bg:var(--tw-prose-pre-bg)] [--tab-border-color:var(--tw-prose-pre-bg)] [--tab-color:hsl(var(--bc))]'
            : '[--tab-border-color:transparent]',
        ]"
        @click="activeTab = i"
      >
        {{ tabName }}
      </button>
      <div class="tab tab-lifted hidden"></div>
    </div>
    <div
      v-for="(tabName, i) in tabNames"
      v-show="activeTab === i"
      :key="tabName"
      :class="{ 'first-active': i === 0 }"
    >
      <slot :name="tabName" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  initActiveTab: {
    type: Number,
    default: 0,
  },
  tabNames: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
})

const activeTab = ref(props.initActiveTab)
</script>

<style>
.first-active pre:first-child {
  border-top-left-radius: 0 !important;
}
</style>
