<template>
  <div
    class="relative"
    :style="{
      width: width ? width + 'px' : undefined,
      height: height ? height + 'px' : undefined,
    }"
  >
    <div class="flex gap-2 absolute left-4 top-4">
      <slot name="info"></slot>
    </div>
    <div class="absolute w-full h-full select-none pointer-events-none">
      <slot name="nodeTooltip"></slot>
    </div>
    <div class="flex gap-2 absolute right-4 top-4">
      <label
        v-if="canToggleDirected"
        class="flex items-center gap-2 p-1 px-2 rounded-lg bg-base-300 h-fit cursor-pointer select-none"
      >
        <h2 class="font-bold text-sm">Directed Graph</h2>
        <input
          v-model="isDirected"
          type="checkbox"
          class="toggle toggle-success"
        />
      </label>
      <button class="btn btn-sm" @click="onClearData">Clear</button>
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
          class="dropdown-content card card-compact w-[360px] bg-base-100 shadow-xl"
        >
          <div class="card-body">
            <h2 class="card-title">How To Interact?</h2>
            <ul class="list-disc list-inside">
              <slot name="hint-start"></slot>
              <slot name="hint">
                <li><b>Hover</b> on vertex to see the details</li>
                <li><b>Left click</b> on empty space to add vertex</li>
                <li><b>Drag</b> from one vertex to another to add edge</li>
                <li><b>Right click</b> on vertex/edge to delete it</li>
                <li v-if="isDraggable">
                  <kbd v-if="isMac" class="kbd kbd-sm">⌘</kbd>
                  <kbd v-else class="kbd kbd-sm">ctrl</kbd> + <b>Drag</b> on
                  vertex to move it
                </li>
              </slot>
              <slot name="hint-end"></slot>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <svg
      class="bg-gray-100 select-none rounded-lg h-full w-full"
      :class="svgClass"
      @mousedown="onSvgMousedown($event)"
      @mousemove="onSvgMousemove($event)"
      @mouseup="onSvgMouseup()"
      @mouseleave="onSvgMouseleave()"
      @contextmenu.prevent
    >
      <defs>
        <marker
          id="drawEdgeArrow"
          viewBox="0 0 10 10"
          refX="10"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" class="fill-current" />
        </marker>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="12"
          refY="4"
          markerWidth="3"
          markerHeight="3"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 8 4 L 0 8 z" />
        </marker>
        <marker
          id="arrowGray300"
          viewBox="0 0 10 10"
          refX="12"
          refY="4"
          markerWidth="3"
          markerHeight="3"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 8 4 L 0 8 z" class="fill-gray-300" />
        </marker>
        <marker
          id="arrowRed400"
          viewBox="0 0 10 10"
          refX="12"
          refY="4"
          markerWidth="3"
          markerHeight="3"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 8 4 L 0 8 z" class="fill-red-400" />
        </marker>
      </defs>
      <line
        class="draw-edge cursor-cell stroke-[3]"
        :class="[hasMouseDownNode ? 'stroke-current' : 'stroke-none']"
        :x1="drawEdgeCords.x1"
        :y1="drawEdgeCords.y1"
        :x2="drawEdgeCords.x2"
        :y2="drawEdgeCords.y2"
        :marker-end="
          isDirected && hasMouseDownNode ? 'url(#drawEdgeArrow)' : 'none'
        "
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
const props = defineProps({
  canToggleDirected: {
    type: Boolean,
    default: false,
  },
  /** Show arrow when drawing edge */
  isDirected: {
    type: Boolean,
    default: false,
  },
  width: {
    type: Number,
    default: undefined,
  },
  height: {
    type: Number,
    default: undefined,
  },
  svgClass: {
    type: Array as PropType<string[]>,
    default: () => ['cursor-cell'],
  },
  hasMouseDownNode: {
    type: Boolean,
    default: false,
  },
  /** Show draggable hint */
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
    default: () => ({
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
    }),
  },
  onClearData: {
    type: Function as PropType<() => void>,
    default: () => {},
  },
  onSvgMousedown: {
    type: Function as PropType<(event: PointerEvent | MouseEvent) => void>,
    default: (_event: PointerEvent | MouseEvent) => {},
  },
  onSvgMousemove: {
    type: Function as PropType<(event: PointerEvent | MouseEvent) => void>,
    default: (_event: PointerEvent | MouseEvent) => {},
  },
  onSvgMouseup: {
    type: Function as PropType<() => void>,
    default: () => {},
  },
  onSvgMouseleave: {
    type: Function as PropType<() => void>,
    default: () => {},
  },
})

const emits = defineEmits(['update:isDirected'])

const isDirected = useVModel(props, 'isDirected', emits)

const { isMac } = usePlatform()
</script>

<style scoped>
.edges :slotted(line.is-directed) {
  marker-end: url('#arrow');
  &:hover {
    marker-end: url('#arrowRed400');
  }
}
</style>
