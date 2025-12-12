// Helper functions used for calculating alignment guide lines
import type { XYPosition, Dimensions, ViewportTransform } from '@vue-flow/core'

//  used for vertical lines (requires startY/endY)
export interface VerticalRange {
  startY: number
  endY: number
}

// used for horizontal lines (requires startX/endX)
export interface HorizontalRange {
  startX: number
  endX: number
}

export interface AlignmentLine {
  type: 'vertical' | 'horizontal'
  key: string
  style: {
    transform: string
    width: string
    height: string
    backgroundColor: string
  }
}

/**
 * Creates a vertical alignment guide line based on a position in canvas coordinates.
 *
 * @param canvasX - X position of the line in VueFlow's internal canvas coordinate system
 * @param range - The vertical range (top → bottom) the line should cover, in canvas units
 * @param viewport - Current viewport transform (for converting canvas → screen pixels)
 *
 * @returns AlignmentLine - an object ready to be rendered in a <div> with absolute position
 */
export const createVerticalLine = (
  canvasX: number,
  range: VerticalRange,
  viewport: ViewportTransform
): AlignmentLine => {
  // Convert canvas coordinates into actual screen pixel positions
  const screenX = canvasX * viewport.zoom + viewport.x
  const screenY = range.startY * viewport.zoom + viewport.y
  const height = (range.endY - range.startY) * viewport.zoom

  return {
    type: 'vertical',
    key: `v-${canvasX}-${Math.random()}`,
    style: {
      transform: `translate(${screenX}px, ${screenY}px)`,
      width: '1px',
      height: `${height}px`,
      backgroundColor: '#90D5FF'
    }
  }
}

/**
 * Creates a horizontal alignment guide line based on a position in **canvas coordinates**.
 *
 * @param canvasY - Y position of the line in VueFlow's canvas
 * @param range - Horizontal range range (left → right) in canvas units
 * @param viewport - Viewport transform for converting canvas → screen pixels
 *
 * @returns AlignmentLine - ready-to-render guide line element
 */
export const createHorizontalLine = (
  canvasY: number,
  range: HorizontalRange,
  viewport: ViewportTransform
): AlignmentLine => {
  const screenY = canvasY * viewport.zoom + viewport.y
  const screenX = range.startX * viewport.zoom + viewport.x
  const width = (range.endX - range.startX) * viewport.zoom

  return {
    type: 'horizontal',
    key: `h-${canvasY}-${Math.random()}`,
    style: {
      transform: `translate(${screenX}px, ${screenY}px)`,
      width: `${width}px`,
      height: '1px',
      backgroundColor: '#90D5FF'
    }
  }
}

/**
 * Computes the vertical range (startY/endY) that covers both dragged and target nodes.
 *
 * @param draggedPos - Position of the dragged node
 * @param draggedSize - Width/height of dragged node
 * @param targetPos - Position of the comparison node
 * @param targetSize - Size of the comparison node
 *
 * @returns VerticalRange - vertical start/end values in canvas coordinates
 */
export const getVerticalSpan = (
  draggedPos: XYPosition,
  draggedSize: Dimensions,
  targetPos: XYPosition,
  targetSize: Dimensions
): VerticalRange => {
  const draggedTop = draggedPos.y
  const draggedBottom = draggedPos.y + draggedSize.height
  const targetTop = targetPos.y
  const targetBottom = targetPos.y + targetSize.height

  return {
    startY: Math.min(draggedTop, targetTop),
    endY: Math.max(draggedBottom, targetBottom)
  }
}

/**
 * Computes the horizontal range (startX/endX) that covers both dragged and target nodes.
 *
 * @returns HorizontalRange - horizontal start/end values in canvas coordinates
 */
export const getHorizontalSpan = (
  draggedPos: XYPosition,
  draggedSize: Dimensions,
  targetPos: XYPosition,
  targetSize: Dimensions
): HorizontalRange => {
  const draggedLeft = draggedPos.x
  const draggedRight = draggedPos.x + draggedSize.width
  const targetLeft = targetPos.x
  const targetRight = targetPos.x + targetSize.width

  return {
    startX: Math.min(draggedLeft, targetLeft),
    endX: Math.max(draggedRight, targetRight)
  }
}
