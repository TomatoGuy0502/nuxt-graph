<template>
  <div class="flex h-full gap-4 overflow-y-auto p-4">
    <div class="h-full overflow-y-scroll rounded-lg bg-base-200 p-4">
      <slot name="content"></slot>
    </div>
    <slot name="svg"></slot>
  </div>
</template>
