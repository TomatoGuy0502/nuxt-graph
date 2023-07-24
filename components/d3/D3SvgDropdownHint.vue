<template>
  <div class="dropdown-end dropdown-hover dropdown">
    <label tabindex="0" class="btn-square btn-sm no-animation btn mb-1">
      <i class="i-heroicons-light-bulb text-xl" />
    </label>
    <div
      tabindex="0"
      class="card dropdown-content card-compact w-[360px] bg-base-100 shadow-xl"
    >
      <div class="card-body">
        <h2 class="card-title">How To Interact?</h2>
        <ul class="list-inside list-disc">
          <slot name="hint-start"></slot>
          <slot name="hint">
            <!-- <li><b>Hover</b> on vertex to see the details</li> -->
            <li><b>Left click</b> on empty space to add vertex</li>
            <li><b>Drag</b> from one vertex to another to add edge</li>
            <li><b>Right click</b> on vertex/edge to delete it</li>
            <li v-if="isDraggable">
              <kbd v-if="isMac" class="kbd kbd-sm">⌘</kbd>
              <kbd v-else class="kbd kbd-sm">ctrl</kbd> + <b>Drag</b> on vertex
              to move it
            </li>
          </slot>
          <slot name="hint-end"></slot>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    isDraggable?: boolean
  }>(),
  {
    isDraggable: false,
  }
)

const { isMac } = usePlatform()
</script>
