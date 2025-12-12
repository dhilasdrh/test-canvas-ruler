# Test Canvas Ruler (Alignment Guide Lines)

This is example code that adds alignment guide lines (similar to Figma / Miro / draw.io) when dragging nodes inside a Vue Flow canvas. The guides help users visually align edges and centers of nodes.

How it works:

- When a node is dragged, the code iterates over all other nodes on the canvas to check for potential alignments.
- **Vertical alignment (X-axis)**: it compares the left and right edges of the dragged node against the edges of each target node. If the edges are within a small tolerance (e.g., 5px), it calculates a vertical span covering both nodes and draws a vertical guide line. It also checks the center X of both nodes and draws a line if they are aligned.
- **Horizontal alignment (Y-axis)**: similarly, it compares the top and bottom edges and the center Y of the nodes, creating horizontal guide lines when edges or centers are close enough.
- All positions are converted from canvas coordinates to screen coordinates using the current viewport zoom and offset, so the guide lines appear correctly on the screen.

https://github.com/user-attachments/assets/1848cdd7-eeac-4431-972a-de5a117206da


---


### [Utils](./src/utils/alignmentUtils.ts)


Contains all low-level utilities for:

- Calculating ranges between nodes
- Converting canvas coordinates into screen positions for guide lines


### [Composables](./src/composables/useAlignmentLines.ts)

Main composable generating lines on drag

- Listens to Vue Flow's `onNodeDrag`
- Compares dragged node against all other nodes
- Detects alignment of:
  - left/right edges
  - top/bottom edges
  - center X
  - center Y
- Creates guide line objects using utils
- Removes all guides on drag stop

### [Components](./src/components/CanvasWrapper.vue)

- Import the composable and use it inside VueFlow component
- Render guide lines with a v-for, absolutely positioned on the canvas.
- Lines update automatically while dragging nodes and disappear on drag stop.

#### Example usage

```vue
<script setup lang="ts">
import { useAlignmentGuides } from '../composables/useAlignmentLines'

const { alignmentLines } = useAlignmentGuides()
</script>

<template>
  <VueFlow :nodes="nodes" :edges="edges">
    <!-- Render guide lines -->
    <template v-for="line in alignmentLines" :key="line.key">
      <div
        class="guide-line"
        :style="{ ...line.style, position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }">
      </div>
    </template>
  </VueFlow>
</template>
```
