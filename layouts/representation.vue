<template>
  <div
    class="grid h-full grid-cols-[auto_1fr] grid-rows-[1fr_auto] gap-4 overflow-y-auto p-4"
  >
    <div
      class="col-span-1 row-span-2 h-full overflow-y-auto rounded-lg bg-base-200 p-4"
    >
      <slot name="content"></slot>
    </div>
    <slot name="svg"></slot>
    <div
      class="flex w-fit flex-col gap-2 overflow-x-auto rounded-lg bg-base-300 p-2"
    >
      <slot name="representation"></slot>
    </div>
  </div>
</template>
