# Test Canvas Ruler (Alignment Guide Lines)

This is example utility that adds alignment guide lines (similar to Figma / Miro / draw.io) when dragging nodes inside a Vue Flow canvas. The guides help users visually align edges and centers of nodes.



https://github.com/user-attachments/assets/1848cdd7-eeac-4431-972a-de5a117206da


---

### `utils/alignmentUtils.ts`

Contains all low-level utilities for:

- Calculating ranges between nodes
- Converting canvas coordinates into screen positions for guide lines

---

### `composables/useAlignmentGuides()`

Main composable generating lines on drag

What it does:

- Listens to Vue Flow's `onNodeDrag`
- Compares dragged node against all other nodes
- Detects alignment of:
  - left/right edges
  - top/bottom edges
  - center X
  - center Y
- Creates guide line objects using utils
- Removes all guides on drag stop

### CanvasWrapper.vue (Usage Example)

Import the composable and use it inside VueFlow component

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
        :style="{ ...line.style, position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }"
      ></div>
    </template>
  </VueFlow>
</template>
```
