<template>
  <div
    class="grid grid-cols-[3fr_2fr_auto] grid-rows-[auto_1fr_auto] gap-4 p-4 h-full overflow-y-auto"
  >
    <div
      class="flex flex-col h-full overflow-y-auto col-start-1 col-span-1 row-start-1 row-span-3 bg-base-200 rounded-lg"
    >
      <slot name="content" />
    </div>
    <div class="col-start-2 col-span-1 row-start-1 row-span-2">
      <slot name="svg"></slot>
    </div>
    <div class="col-start-3 col-span-1 row-start-1 row-span-1">
      <slot name="control"></slot>
    </div>
    <div class="col-start-2 col-span-2 row-start-3 row-span-1">
      <slot name="result"></slot>
    </div>
  </div>
</template>
