<template>
  <div class="flex h-full gap-4 overflow-y-auto p-4">
    <div
      class="flex h-full flex-col overflow-y-auto rounded-lg bg-base-200 flex-shrink-0"
    >
      <slot name="content" />
    </div>
    <div class="flex flex-col flex-1 gap-4 overflow-x-auto">
      <div class="flex flex-col flex-1 gap-4">
        <slot name="svg"></slot>
        <div>
          <slot name="control"></slot>
        </div>
      </div>
      <slot name="result"></slot>
    </div>
  </div>
</template>
