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
    // Reset all existing alignment guide lines at the start of a drag
    alignmentLines.value = []

    // Reference to the node currently being dragged
    const dragged = event.node
    const draggedSize = dragged.dimensions

    // Iterate over all other nodes in the canvas to check for alignment
    for (const target of nodes.value) {
      if (target.id === dragged.id) continue // Skip the dragged node itself

      const targetPos = target.position
      const targetSize = target.dimensions

      // ====== Vertical (X-axis) Alignment Detection ======
      // Gather the left/right edges of dragged and target nodes
      const draggedEdgesX = [dragged.position.x, dragged.position.x + draggedSize.width]
      const targetEdgesX = [targetPos.x, targetPos.x + targetSize.width]

      // Check for near-alignment of left/right edges within tolerance
      for (const dx of draggedEdgesX) {
        for (const tx of targetEdgesX) {
          if (Math.abs(dx - tx) <= tolerance) {
            // Compute vertical span covering both nodes
            const span = getVerticalSpan(dragged.position, draggedSize, targetPos, targetSize)
            // Create a vertical guide line at the aligned X position
            alignmentLines.value.push(createVerticalLine(tx, span, viewport.value))
          }
        }
      }

      // Check for center-to-center vertical alignment
      const draggedCenterX = dragged.position.x + draggedSize.width / 2
      const targetCenterX = targetPos.x + targetSize.width / 2
      if (Math.abs(draggedCenterX - targetCenterX) <= tolerance) {
        const span = getVerticalSpan(dragged.position, draggedSize, targetPos, targetSize)
        alignmentLines.value.push(createVerticalLine(targetCenterX, span, viewport.value))
      }

      // ====== Horizontal (Y-axis) Alignment Detection ======
      // Gather the top/bottom edges of dragged and target nodes
      const draggedEdgesY = [dragged.position.y, dragged.position.y + draggedSize.height]
      const targetEdgesY = [targetPos.y, targetPos.y + targetSize.height]

      // Check for near-alignment of top/bottom edges within tolerance
      for (const dy of draggedEdgesY) {
        for (const ty of targetEdgesY) {
          if (Math.abs(dy - ty) <= tolerance) {
            // Compute horizontal span covering both nodes
            const span = getHorizontalSpan(dragged.position, draggedSize, targetPos, targetSize)
            // Create a horizontal guide line at the aligned Y position
            alignmentLines.value.push(createHorizontalLine(ty, span, viewport.value))
          }
        }
      }

      // Check for center-to-center horizontal alignment
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
