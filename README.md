# Test Canvas Ruler (Alignment Guide Lines)

This is example code that adds alignment guide lines (similar to Figma / Miro / draw.io) when dragging nodes inside a Vue Flow canvas. The guides help users visually align edges and centers of nodes.

How it works:

- It will listens to node drag events and compares the dragged node with all other nodes on the canvas to check for potential alignments.
- Checks alignment across four cases:
   - Vertical edges (left & right)
   - Horizontal edges (top & bottom)
   - Vertical center (center X)
   - Horizontal center (center Y)
- When two positions are aligned within a small tolerance (e.g. 5px), a guide line is generated to visually indicate the alignment between the nodes.
- All calculations are done in canvas coordinates and then converted into screen coordinates using the current viewport zoom and offset. This ensures the guide lines stay accurate while zooming and panning

https://github.com/user-attachments/assets/1848cdd7-eeac-4431-972a-de5a117206da


---


### [Utils](./src/utils/alignmentUtils.ts)


Contains all low-level math and coordinate logic

- Calculates shared ranges between two nodes (horizontal or vertical).
- Converts canvas coordinates into screen coordinates using the current viewport.
- Returns simple objects that describe how each guide line should be rendered.


### [Composables](./src/composables/useAlignmentLines.ts)

Main composable generating lines on drag

- Listens `onNodeDrag()` event
- Compares dragged node against all other nodes
- It compares node edges (top, bottom, left, right) and node centers (X and Y), and treats them as aligned when the distance is within a small tolerance.
- When an alignment is detected, it creates guide lines using the utility functions.
- All guide lines are cleared when the drag ends.

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
