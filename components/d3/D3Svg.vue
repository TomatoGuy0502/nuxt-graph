<template>
  <div
    class="relative"
    :style="{
      width: width ? width + 'px' : undefined,
      height: height ? height + 'px' : undefined,
    }"
  >
    <!-- Information at the top left corner -->
    <div class="flex gap-2 absolute left-4 top-4">
      <slot name="info"></slot>
    </div>

    <!-- Tooltip for nodes -->
    <div class="absolute inset-0 select-none pointer-events-none">
      <div
        class="absolute rounded p-1 py-0.5 bg-base-300 transition text-sm"
        :class="{ 'opacity-0': !hoverNode }"
        :style="{
          top: `${(lastHoverNode?.y ?? 0) + 10}px`,
          left: `${(lastHoverNode?.x ?? 0) + 10}px`,
        }"
      >
        <slot name="nodeTooltip" :hover-node-info="lastHoverNode"></slot>
      </div>
    </div>

    <!-- Buttons at the top right corner -->
    <div class="flex gap-2 absolute right-4 top-4">
      <label
        v-if="canToggleShowingIndex"
        class="flex items-center gap-2 p-1 px-2 rounded-lg bg-base-300 h-fit cursor-pointer select-none"
      >
        <h2 class="font-bold text-sm">ID</h2>
        <input
          v-model="isShowingIndex"
          type="checkbox"
          class="toggle toggle-success"
        />
        <h2 class="font-bold text-sm">Index</h2>
      </label>
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
      <slot name="extra-buttons"></slot>
      <button class="btn btn-sm" @click="onClearData">
        <slot name="clear-button">Clear</slot>
      </button>
      <div class="dropdown dropdown-hover dropdown-end">
        <D3SvgDropdownButton />
        <div
          tabindex="0"
          class="dropdown-content card card-compact w-[360px] bg-base-100 shadow-xl"
        >
          <div class="card-body">
            <h2 class="card-title">How To Interact?</h2>
            <ul class="list-disc list-inside">
              <slot name="hint-start"></slot>
              <slot name="hint">
                <!-- <li><b>Hover</b> on vertex to see the details</li> -->
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
import type { NodeDatum } from '@/composables/useD3'

// TODO: Change on- to emit()
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
  canToggleShowingIndex: {
    type: Boolean,
    default: false,
  },
  /** Show id or index */
  isShowingIndex: {
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
  hoverNode: {
    type: [Object, null] as PropType<NodeDatum | null>,
    default: null,
  },
})

// Record the last hover node to prevent tooltip from flickering
const lastHoverNode = ref<NodeDatum | null>(props.hoverNode)
watch(
  () => props.hoverNode,
  (node) => {
    if (!node) return
    lastHoverNode.value = node
  }
)

const emits = defineEmits(['update:isDirected', 'update:isShowingIndex'])

const isDirected = useVModel(props, 'isDirected', emits)
const isShowingIndex = useVModel(props, 'isShowingIndex', emits)

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
