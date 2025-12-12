import { ref } from 'vue'
import { useVueFlow, type NodeDragEvent } from '@vue-flow/core'
import {
  createHorizontalLine,
  createVerticalLine,
  getHorizontalSpan,
  getVerticalSpan,
  type AlignmentLine
} from '../utils/alignmentUtils'

// Provides visual guide lines while dragging nodes in VueFlow
// to help the user align edges and centers between nodes.
export const useAlignmentGuides = () => {
  const { viewport, nodes, onNodeDrag, onNodeDragStop } = useVueFlow()

  // Holds all currently visible guide lines
  const alignmentLines = ref<AlignmentLine[]>([])

  // Pixel distance within which two edges/centers are considered "aligned"
  const tolerance = 5

  onNodeDrag((event: NodeDragEvent) => {
    alignmentLines.value = []

    const dragged = event.node
    const draggedSize = dragged.dimensions

    for (const target of nodes.value) {
      if (target.id === dragged.id) continue

      const targetPos = target.position
      const targetSize = target.dimensions

      // ====== Vertical (X-axis) Alignment Detection ======
      const draggedEdgesX = [dragged.position.x, dragged.position.x + draggedSize.width]
      const targetEdgesX = [targetPos.x, targetPos.x + targetSize.width]

      // Compare left/right edges
      for (const dx of draggedEdgesX) {
        for (const tx of targetEdgesX) {
          if (Math.abs(dx - tx) <= tolerance) {
            const span = getVerticalSpan(dragged.position, draggedSize, targetPos, targetSize)
            alignmentLines.value.push(createVerticalLine(tx, span, viewport.value))
          }
        }
      }

      // Center-to-center alignment
      const draggedCenterX = dragged.position.x + draggedSize.width / 2
      const targetCenterX = targetPos.x + targetSize.width / 2

      if (Math.abs(draggedCenterX - targetCenterX) <= tolerance) {
        const span = getVerticalSpan(dragged.position, draggedSize, targetPos, targetSize)
        alignmentLines.value.push(createVerticalLine(targetCenterX, span, viewport.value))
      }

      // ====== Horizontal (Y-axis) Alignment Detection ======
      const draggedEdgesY = [dragged.position.y, dragged.position.y + draggedSize.height]
      const targetEdgesY = [targetPos.y, targetPos.y + targetSize.height]

      // Compare top/bottom edges
      for (const dy of draggedEdgesY) {
        for (const ty of targetEdgesY) {
          if (Math.abs(dy - ty) <= tolerance) {
            const span = getHorizontalSpan(dragged.position, draggedSize, targetPos, targetSize)
            alignmentLines.value.push(createHorizontalLine(ty, span, viewport.value))
          }
        }
      }

      // Center-to-center alignment
      const draggedCenterY = dragged.position.y + draggedSize.height / 2
      const targetCenterY = targetPos.y + targetSize.height / 2

      if (Math.abs(draggedCenterY - targetCenterY) <= tolerance) {
        const span = getHorizontalSpan(dragged.position, draggedSize, targetPos, targetSize)
        alignmentLines.value.push(createHorizontalLine(targetCenterY, span, viewport.value))
      }
    }
  })

  // Remove all guides when drag stops
  onNodeDragStop(() => (alignmentLines.value = []))

  return { alignmentLines }
}
