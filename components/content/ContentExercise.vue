<template>
  <div class="not-prose my-5">
    <ol class="flex flex-col gap-2">
      <li
        v-for="i in numberOfExercises"
        :key="i"
        class="flex items-start gap-2"
        :data-test="`exercise-${i}`"
      >
        <span class="font-mono leading-6 mt-1">{{ i }}.</span>
        <label
          class="swap swap-flip text-2xl cursor-default mt-0.5"
          :class="{ 'swap-active text-success': finishedExercise >= i }"
        >
          <i class="swap-on i-tabler-circle-check text-2xl shrink-0" />
          <i class="swap-off i-tabler-circle-dashed text-2xl shrink-0" />
        </label>
        <div
          class="flex-1 flex flex-col gap-2 [&>pre]:bg-[var(--tw-prose-pre-bg)] [&>pre]:rounded-[0.375em] [&>pre]:text-sm [&>pre]:px-4 [&>pre]:py-2"
        >
          <slot :name="`exercise-${i}`" />
        </div>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
defineProps({
  numberOfExercises: {
    type: Number,
    default: 0,
  },
})

const finishedExercise = useState('finished', () => 0)
</script>

<style scoped></style>
