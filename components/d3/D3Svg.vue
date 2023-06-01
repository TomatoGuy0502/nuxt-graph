<template>
  <div class="relative">
    <div class="flex gap-2 absolute right-4 top-4">
      <div class="dropdown dropdown-hover dropdown-end">
        <label tabindex="0" class="btn btn-sm btn-square mb-1"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
            /></svg
        ></label>
        <div
          tabindex="0"
          class="dropdown-content card card-compact w-96 bg-base-100 shadow-xl"
        >
          <div class="card-body">
            <h2 class="card-title">How To Interact?</h2>
            <ul class="list-disc list-inside">
              <li><b>Left click</b> on empty space to add vertex</li>
              <li><b>Drag</b> from one vertex to another to add edge</li>
              <li><b>Right click</b> on vertex/edge to delete it</li>
              <li v-if="isDraggable">
                <kbd v-if="isMac" class="kbd kbd-sm">⌘</kbd>
                <kbd v-else class="kbd kbd-sm">ctrl</kbd> + <b>Drag</b> on
                vertex to move it
              </li>
            </ul>
          </div>
        </div>
      </div>
      <button class="btn btn-sm" @click="onClearData">Clear</button>
    </div>
    <svg
      ref="svg"
      :width="width"
      :height="height"
      class="cursor-cell bg-gray-100"
      @mousedown="onSvgMousedown($event)"
      @mousemove="onSvgMousemove($event)"
      @mouseup="onSvgMouseup()"
      @mouseleave="onSvgMouseleave()"
      @contextmenu.prevent
    >
      <line
        class="draw-edge cursor-cell stroke-[3]"
        :class="[hasMouseDownNode ? 'stroke-current' : 'stroke-none']"
        :x1="drawEdgeCords.x1"
        :y1="drawEdgeCords.y1"
        :x2="drawEdgeCords.x2"
        :y2="drawEdgeCords.y2"
      ></line>
      <g class="edges" @mousedown.stop>
        <slot name="edges"></slot>
      </g>
      <g class="nodes" @mousedown.stop>
        <slot name="nodes"></slot>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps({
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  hasMouseDownNode: {
    type: Boolean,
    required: true,
  },
  isDraggable: {
    type: Boolean,
    default: false,
  },
  drawEdgeCords: {
    type: Object as PropType<{
      x1: number
      y1: number
      x2: number
      y2: number
    }>,
    required: true,
  },
  onClearData: {
    type: Function as PropType<() => void>,
    required: true,
  },
  onSvgMousedown: {
    type: Function as PropType<(event: PointerEvent | MouseEvent) => void>,
    required: true,
  },
  onSvgMousemove: {
    type: Function as PropType<(event: PointerEvent | MouseEvent) => void>,
    required: true,
  },
  onSvgMouseup: {
    type: Function as PropType<() => void>,
    required: true,
  },
  onSvgMouseleave: {
    type: Function as PropType<() => void>,
    required: true,
  },
})

const isMac = ref(false)
onMounted(() => {
  isMac.value = navigator.userAgent.includes('Mac')
})
</script>
