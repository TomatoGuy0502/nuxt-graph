<template>
  <div
    class="relative"
    :style="{
      width: width ? width + 'px' : undefined,
      height: height ? height + 'px' : undefined,
    }"
  >
    <!-- Information at the top left corner -->
    <div class="absolute left-4 top-4 flex gap-2">
      <slot name="info"></slot>
    </div>

    <!-- Tooltip for nodes -->
    <div class="pointer-events-none absolute inset-0 select-none">
      <div
        class="absolute rounded bg-base-300 p-1 py-0.5 text-sm transition"
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
    <div class="absolute right-4 top-4 flex gap-2">
      <label
        v-if="canToggleShowingIndex"
        class="flex h-fit cursor-pointer select-none items-center gap-2 rounded-lg bg-base-300 p-1 px-2"
      >
        <h2 class="text-sm font-bold">ID</h2>
        <input
          v-model="isShowingIndex"
          type="checkbox"
          class="toggle-success toggle"
        />
        <h2 class="text-sm font-bold">Index</h2>
      </label>
      <label
        v-if="canToggleDirected"
        class="flex h-fit cursor-pointer select-none items-center gap-2 rounded-lg bg-base-300 p-1 px-2"
      >
        <h2 class="text-sm font-bold">Directed Graph</h2>
        <input
          v-model="isDirected"
          type="checkbox"
          class="toggle-success toggle"
        />
      </label>
      <slot name="extra-buttons"></slot>
      <button
        v-if="showGenerateRandomGraphBtn"
        class="btn btn-sm"
        @click="$emit('generateRandomGraph')"
      >
        <i class="i-tabler-arrows-shuffle text-xl" />
      </button>
      <button class="btn-sm btn" @click="$emit('clearData')">
        <slot name="clear-button">Clear</slot>
      </button>
      <div class="dropdown-end dropdown-hover dropdown">
        <D3SvgDropdownButton />
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
      class="h-full w-full select-none rounded-lg bg-gray-100"
      :class="svgClass"
      @mousedown="$emit('svgMousedown', $event)"
      @mousemove="$emit('svgMousemove', $event)"
      @mouseup="$emit('svgMouseup')"
      @mouseleave="$emit('svgMouseleave')"
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
  showGenerateRandomGraphBtn: {
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

const emits = defineEmits<{
  'update:isDirected': [value: boolean]
  'update:isShowingIndex': [value: boolean]
  clearData: []
  generateRandomGraph: []
  svgMousedown: [event: PointerEvent | MouseEvent]
  svgMousemove: [event: PointerEvent | MouseEvent]
  svgMouseup: []
  svgMouseleave: []
}>()

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
