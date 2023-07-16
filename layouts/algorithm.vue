<template>
  <div
    class="grid h-full grid-cols-[3fr_2fr_auto] grid-rows-[auto_1fr_auto] gap-4 overflow-y-auto p-4"
  >
    <div
      class="col-span-1 col-start-1 row-span-3 row-start-1 flex h-full flex-col overflow-y-auto rounded-lg bg-base-200"
    >
      <slot name="content" />
    </div>
    <div class="col-span-1 col-start-2 row-span-2 row-start-1">
      <slot name="svg"></slot>
    </div>
    <div class="col-span-1 col-start-3 row-span-1 row-start-1">
      <slot name="control"></slot>
    </div>
    <div class="col-span-2 col-start-2 row-span-1 row-start-3">
      <slot name="result"></slot>
    </div>
  </div>
</template>
