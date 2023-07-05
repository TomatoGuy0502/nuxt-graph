<template>
  <div class="flex gap-4 p-4 h-full overflow-y-auto">
    <div class="h-full overflow-y-scroll p-4 bg-base-200 rounded-lg">
      <slot name="content"></slot>
    </div>
    <slot name="svg"></slot>
  </div>
</template>
