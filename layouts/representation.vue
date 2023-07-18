<template>
  <div class="flex h-full gap-4 overflow-y-auto p-4">
    <div class="h-full overflow-y-auto rounded-lg bg-base-200 p-4">
      <slot name="content"></slot>
    </div>
    <div class="flex flex-col flex-1 gap-4">
      <slot name="svg"></slot>
      <div
        class="flex w-fit flex-col gap-2 overflow-x-auto rounded-lg bg-base-300 p-2"
      >
        <slot name="representation"></slot>
      </div>
    </div>
  </div>
</template>
