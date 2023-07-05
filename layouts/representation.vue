<template>
  <div
    class="grid grid-cols-[auto_1fr] grid-rows-[1fr_auto] gap-4 p-4 h-full overflow-y-auto"
  >
    <div
      class="h-full overflow-y-auto col-span-1 row-span-2 p-4 bg-base-200 rounded-lg"
    >
      <slot name="content"></slot>
    </div>
    <slot name="svg"></slot>
    <div
      class="flex flex-col gap-2 p-2 rounded-lg bg-base-300 overflow-x-auto w-fit"
    >
      <slot name="representation"></slot>
    </div>
  </div>
</template>
