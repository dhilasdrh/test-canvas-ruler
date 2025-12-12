<script lang="ts" setup>
import { computed } from 'vue'
import { BaseEdge, getBezierPath, Position, type EdgeProps } from '@vue-flow/core'

const props = defineProps<EdgeProps>()
const lines = computed(() =>
  getBezierPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    sourcePosition: props.sourcePosition as Position,
    targetX: props.targetX,
    targetY: props.targetY,
    targetPosition: props.targetPosition as Position
  })
)
</script>

<template>
  <BaseEdge :id="props.id" :path="lines[0]" />
</template>
