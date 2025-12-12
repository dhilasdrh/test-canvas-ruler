<script setup lang="ts">
import { ref } from 'vue'
import CustomNode from './CustomNode.vue'
import CustomEdge from './CustomEdge.vue'
import {
  ConnectionLineType,
  useVueFlow,
  VueFlow,
  type NodeDragEvent,
  type XYPosition
} from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { useAlignmentGuides } from '../composables/useAlignmentLines'

// NODE SIZES
const PORT = { width: 260, height: 79 }
const PROCESSOR = { width: 320, height: 79 }
const FUNNEL = { width: 59, height: 59 }
const NOTE = { width: 150, height: 150 }

// SAMPLE NODES
const sampleNodes = ref([
  // Processor 1
  {
    id: 'processor-1',
    type: 'custom',
    position: { x: 40, y: 100 },
    width: PROCESSOR.width,
    height: PROCESSOR.height,
    data: { label: 'Processor 1' }
  },

  // Processor 2
  {
    id: 'processor-2',
    type: 'custom',
    position: { x: 100, y: 350 },
    width: PROCESSOR.width,
    height: PROCESSOR.height,
    data: { label: 'Processor 2' }
  },

  // Funnel
  {
    id: 'funnel-1',
    type: 'custom',
    position: { x: 500, y: 200 },
    width: FUNNEL.width,
    height: FUNNEL.height,
    data: { label: 'Funnel' }
  },

  // Port (input)
  {
    id: 'port-in',
    type: 'custom',
    position: { x: 400, y: -100 },
    width: PORT.width,
    height: PORT.height,
    data: { label: 'Port Input' }
  },

  // Port (output)
  {
    id: 'port-out',
    type: 'custom',
    position: { x: 750, y: 100 },
    width: PORT.width,
    height: PORT.height,
    data: { label: 'Port Output' }
  },

  // Note
  {
    id: 'note-1',
    type: 'custom',
    position: { x: 900, y: 350 },
    width: NOTE.width,
    height: NOTE.height,
    data: { label: 'Note' }
  }
])

// SAMPLE EDGES
const sampleEdges = ref([
  // Processor → Funnel
  {
    id: 'e-proc1-funnel',
    source: 'processor-1',
    target: 'funnel-1',
    type: 'custom',
    sourceHandle: 'processor-1__right',
    targetHandle: 'funnel-1__left',
    style: { stroke: '#123E6B' }
  },

  // Port Input → Funnel
  {
    id: 'e-portin-funnel',
    source: 'port-in',
    target: 'funnel-1',
    type: 'custom',
    sourceHandle: 'port-in__bottom',
    targetHandle: 'funnel-1__top',
    style: { stroke: '#123E6B' }
  },

  // Funnel → Port Output
  {
    id: 'e-funnel-portout',
    source: 'funnel-1',
    target: 'port-out',
    type: 'custom',
    sourceHandle: 'funnel-1__right',
    targetHandle: 'port-out__left',
    style: { stroke: '#123E6B' }
  }
])

const { onNodeDragStop, nodes } = useVueFlow()
const { alignmentLines } = useAlignmentGuides()

const updateNodePosition = (id: string, pos: XYPosition) => {
  const n = nodes.value.find((n) => n.id === id)
  if (n) {
    n.position = pos
  }
}

onNodeDragStop((event: NodeDragEvent) => {
  updateNodePosition(event.node.id, event.node.position)
})
</script>

<template>
  <div class="h-screen w-screen">
    <VueFlow
      :pan-on-drag="true"
      :nodes="sampleNodes"
      :edges="sampleEdges"
      fit-view-on-init
      :min-zoom="0.2"
      :max-zoom="2"
      :snap-grid="[10, 10]"
      :snap-to-grid="true"
      :default-viewport="{ zoom: 1 }"
      :connection-radius="30"
      :connection-line-type="ConnectionLineType.Bezier"
    >
      <Background pattern-color="#aaa" :gap="10" />

      <!-- Render all active alignment (guide) lines -->
      <template v-for="(line, index) in alignmentLines" :key="index">
        <div
          class="guide-line"
          :style="{
            ...line.style,
            position: 'absolute',
            zIndex: 10,
            pointerEvents: 'none',
            // Set starting point to top__left of the flow container
            top: 0,
            left: 0
          }"
        ></div>
      </template>

      <template #node-custom="props">
        <CustomNode v-bind="props" />
      </template>
      <template #edge-custom="props">
        <CustomEdge v-bind="props" />
      </template>
    </VueFlow>
  </div>
</template>

<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';
</style>
