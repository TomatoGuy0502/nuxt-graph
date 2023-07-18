<template>
  <div class="flex items-center gap-4 rounded-lg bg-base-300 p-4">
    <div class="input-group w-fit flex-grow-0">
      <label
        class="flex items-center bg-base-100 px-2 whitespace-nowrap text-sm font-medium"
        >Start Node ID</label
      >
      <select
        id="select-start-node-id"
        v-model="traversalStartNodeIndex"
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
        :class="{ 'btn-disabled': isPlaying }"
        :disabled="isPlaying || visitingTraversalIndex === null"
        @click="$emit('goPrevStep')"
      >
        Prev Step
      </button>
      <button
        class="btn-outline join-item btn w-1/2 normal-case"
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
      :class="[isPlaying ? 'btn-error' : 'btn-success']"
      @click="$emit('play')"
    >
      <template v-if="isPlaying"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="h-4 w-4"
        >
          <path
            fill-rule="evenodd"
            d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
            clip-rule="evenodd"
          />
        </svg>
        Pause</template
      >
      <template v-else
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="h-4 w-4"
        >
          <path
            fill-rule="evenodd"
            d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
            clip-rule="evenodd"
          />
        </svg>
        Auto Play</template
      >
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
