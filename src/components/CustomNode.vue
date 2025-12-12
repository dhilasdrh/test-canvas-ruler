<script lang="ts" setup>
import { Handle, Position, type NodeProps } from '@vue-flow/core'

const props = defineProps<NodeProps>()
</script>

<template>
  <div
    :id="`node-${props.type}-${props.id}`"
    :class="`flex h-full shadow-lg items-center justify-center bg-white`"
  >
    <div class="text-xs text-gray-500">{{ props.data.label }}</div>
    <Handle :id="`${id}__top`" type="source" :position="Position.Top" />
    <Handle :id="`${id}__left`" type="source" :position="Position.Left" />
    <Handle :id="`${id}__right`" type="source" :position="Position.Right" />
    <Handle :id="`${id}__bottom`" type="source" :position="Position.Bottom" />
  </div>
</template>

<style>
.vue-flow__handle {
  opacity: 0 !important;
}
</style>
