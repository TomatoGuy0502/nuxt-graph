<template>
  <div class="flex items-center gap-4 rounded-lg bg-base-300 p-4">
    <div class="input-group w-fit flex-grow-0">
      <label
        class="flex items-center bg-base-100 px-2 whitespace-nowrap text-sm font-medium"
        >Start Vertex</label
      >
      <select
        id="select-start-node-id"
        v-model="traversalStartNodeIndex"
        data-test="start-node-id-select"
        class="select-bordered select flex-1 bg-base-100 min-w-[68px] transition hover:bg-base-200 focus:outline-none"
      >
        <option v-for="(nodeId, i) in nodeIds" :key="nodeId" :value="i">
          {{ nodeId }}
        </option>
      </select>
    </div>
    <div class="join flex-auto">
      <button
        class="btn-outline join-item btn w-1/2 normal-case"
        data-test="prev-step-button"
        :class="{ 'btn-disabled': isPlaying }"
        :disabled="isPlaying || visitingTraversalIndex === null"
        @click="$emit('goPrevStep')"
      >
        Prev Step
      </button>
      <button
        class="btn-outline join-item btn w-1/2 normal-case"
        data-test="next-step-button"
        :class="{ 'btn-disabled': isPlaying }"
        :disabled="isPlaying"
        @click="$emit('goNextStep')"
      >
        <template v-if="visitingTraversalIndex === null">First Step</template>
        <template v-else-if="visitingTraversalIndex === nodeIds.length - 1">
          Finish
        </template>
        <template v-else>Next Step</template>
      </button>
    </div>
    <button
      class="join-item btn gap-0.5 normal-case w-[120px]"
      data-test="play-button"
      :class="[isPlaying ? 'btn-error' : 'btn-success']"
      @click="$emit('play')"
    >
      <template v-if="isPlaying">
        <i class="i-heroicons-pause-solid text-base" />Pause
      </template>
      <template v-else><i class="i-heroicons-play-solid" />Auto Play</template>
    </button>
    <!-- <button class="btn normal-case" @click="$emit('generateRandomGraph')">
      Generate Random Graph
    </button> -->
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  nodeIds: {
    type: Array as PropType<number[]>,
    required: true,
  },
  visitingTraversalIndex: {
    type: [Number, null] as PropType<number | null>,
    required: true,
  },
  traversalStartNodeIndex: {
    type: Number as PropType<number>,
    required: true,
  },
  isPlaying: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
})
const emits = defineEmits([
  'play',
  'goNextStep',
  'goPrevStep',
  'generateRandomGraph',
  'update:traversalStartNodeIndex',
])

const traversalStartNodeIndex = useVModel(
  props,
  'traversalStartNodeIndex',
  emits
)
</script>
