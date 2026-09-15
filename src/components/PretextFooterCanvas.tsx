import { useEffect, useRef } from 'react'
import { layoutWithLines, prepareWithSegments } from '@chenglou/pretext'
import sty from './PretextFooterCanvas.module.scss'

type PretextFooterCanvasProps = {
  text: string
}

type Emitter = {
  x: number
  y: number
  orbit: number
  speed: number
  phase: number
  strength: number
}

const FONT = '400 10px "Quattrocento Sans", sans-serif'
const LINE_HEIGHT = 19
const TEXT_COLOR = '#b6cf4f'
const MAX_COLUMNS = 120
const EMITTERS: Emitter[] = [
  { x: 0.18, y: 0.3, orbit: 0.12, speed: 0.34, phase: 0, strength: 0.08 },
  { x: 0.68, y: 0.32, orbit: 0.16, speed: 0.28, phase: 2.2, strength: 0.07 },
  { x: 0.42, y: 0.7, orbit: 0.18, speed: 0.38, phase: 4.4, strength: 0.09 },
  { x: 0.84, y: 0.7, orbit: 0.1, speed: 0.46, phase: 1.1, strength: 0.06 },
]

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function sampleField(field: Float32Array, columns: number, rows: number, x: number, y: number) {
  const sampleX = clamp(x, 0, columns - 1.001)
  const sampleY = clamp(y, 0, rows - 1.001)
  const x0 = Math.floor(sampleX)
  const y0 = Math.floor(sampleY)
  const x1 = Math.min(x0 + 1, columns - 1)
  const y1 = Math.min(y0 + 1, rows - 1)
  const fx = sampleX - x0
  const fy = sampleY - y0
  const top = field[y0 * columns + x0] * (1 - fx) + field[y0 * columns + x1] * fx
  const bottom = field[y1 * columns + x0] * (1 - fx) + field[y1 * columns + x1] * fx
  return top * (1 - fy) + bottom * fy
}

function getVelocity(column: number, row: number, columns: number, rows: number, time: number) {
  const x = column / columns
  const y = row / rows
  return {
    x: Math.sin(y * 6.28 + time * 0.7) * 0.72
      + Math.cos((x + y) * 12.5 + time * 0.45) * 0.28,
    y: Math.cos(x * 5.2 - time * 0.55) * 0.62
      + Math.sin((x - y) * 10 + time * 0.5) * 0.34,
  }
}

export function PretextFooterCanvas({ text }: PretextFooterCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context || !text.trim()) return

    const prepared = prepareWithSegments(text.trim(), FONT)
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let width = 1
    let height = 1
    let columns = 1
    let rows = 1
    let density = new Float32Array(1)
    let nextDensity = new Float32Array(1)
    let glyphs: string[] = []
    let pointerInside = false
    let pointerX = 0
    let pointerY = 0
    let visible = true

    const rebuild = () => {
      const bounds = canvas.getBoundingClientRect()
      const ratio = window.devicePixelRatio || 1
      width = Math.max(1, bounds.width)
      height = Math.max(1, bounds.height)
      columns = Math.min(MAX_COLUMNS, Math.max(36, Math.floor(width / 10)))
      rows = Math.max(1, Math.ceil(height / LINE_HEIGHT))
      canvas.width = Math.floor(width * ratio)
      canvas.height = Math.floor(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      context.font = FONT
      density = new Float32Array(columns * rows)
      nextDensity = new Float32Array(columns * rows)

      const lines = layoutWithLines(prepared, width, LINE_HEIGHT).lines
      const source = lines.map((line) => line.text).join('')
      glyphs = Array.from(new Set([
        ...Array.from(segmenter.segment(source), ({ segment }) => segment),
        ...Array.from(' .,:;!+-=*#@%&'),
      ].filter((glyph) => glyph !== '\n')))

      for (let index = 0; index < density.length; index += 1) {
        density[index] = 0.025 + (Math.sin(index * 12.9898) * 0.5 + 0.5) * 0.035
      }
    }

    const inject = (time: number) => {
      for (const emitter of EMITTERS) {
        const emitterX = (emitter.x + Math.cos(time * emitter.speed + emitter.phase) * emitter.orbit) * columns
        const emitterY = (emitter.y + Math.sin(time * emitter.speed * 0.72 + emitter.phase) * emitter.orbit * 0.72) * rows
        const centerColumn = Math.floor(emitterX)
        const centerRow = Math.floor(emitterY)

        for (let row = centerRow - 4; row <= centerRow + 4; row += 1) {
          for (let column = centerColumn - 4; column <= centerColumn + 4; column += 1) {
            if (row < 0 || row >= rows || column < 0 || column >= columns) continue
            const distance = Math.hypot(column - emitterX, (row - emitterY) * 0.72)
            const amount = Math.max(0, 1 - distance / 5) * emitter.strength
            density[row * columns + column] = Math.min(1, density[row * columns + column] + amount)
          }
        }
      }

      if (pointerInside) {
        const centerColumn = Math.floor(pointerX / width * columns)
        const centerRow = Math.floor(pointerY / height * rows)
        for (let row = centerRow - 5; row <= centerRow + 5; row += 1) {
          for (let column = centerColumn - 5; column <= centerColumn + 5; column += 1) {
            if (row < 0 || row >= rows || column < 0 || column >= columns) continue
            const distance = Math.hypot(column - centerColumn, (row - centerRow) * 0.72)
            const amount = Math.max(0, 1 - distance / 6) * 0.1
            density[row * columns + column] = Math.min(1, density[row * columns + column] + amount)
          }
        }
      }
    }

    const simulate = (time: number) => {
      const seconds = time * 0.001
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const index = row * columns + column
          const velocity = getVelocity(column, row, columns, rows, seconds)
          const advected = sampleField(
            density,
            columns,
            rows,
            column - velocity.x,
            row - velocity.y,
          )
          const left = density[row * columns + Math.max(0, column - 1)]
          const right = density[row * columns + Math.min(columns - 1, column + 1)]
          const above = density[Math.max(0, row - 1) * columns + column]
          const below = density[Math.min(rows - 1, row + 1) * columns + column]
          const smooth = (left + right + above + below) * 0.25
          nextDensity[index] = advected * 0.965 + smooth * 0.025
        }
      }

      ;[density, nextDensity] = [nextDensity, density]
      inject(seconds)
      for (let index = 0; index < density.length; index += 1) {
        density[index] *= 0.994
      }
    }

    const render = (time: number) => {
      frame = 0
      if (!visible) return
      simulate(time)
      context.clearRect(0, 0, width, height)
      context.font = FONT
      context.textBaseline = 'top'
      context.textAlign = 'left'
      context.fillStyle = TEXT_COLOR

      const cellWidth = width / columns
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const value = density[row * columns + column]
          if (value < 0.02) continue

          const paletteIndex = Math.min(
            glyphs.length - 1,
            Math.floor(value * glyphs.length * 1.35) + ((row + column) % 3),
          )
          const glyph = glyphs[paletteIndex]
          if (!glyph) continue

          context.globalAlpha = Math.min(0.68, 0.12 + value * 0.7)
          context.fillText(glyph, column * cellWidth, row * LINE_HEIGHT + 1)
        }
      }

      context.globalAlpha = 1
      if (!reducedMotion) frame = window.requestAnimationFrame(render)
    }

    const updatePointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect()
      pointerInside = event.clientX >= bounds.left
        && event.clientX <= bounds.right
        && event.clientY >= bounds.top
        && event.clientY <= bounds.bottom
      if (pointerInside) {
        pointerX = event.clientX - bounds.left
        pointerY = event.clientY - bounds.top
      }
    }

    const clearPointer = () => {
      pointerInside = false
    }

    const start = () => {
      if (!reducedMotion && !frame) frame = window.requestAnimationFrame(render)
    }

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false
      if (visible) start()
    }, { threshold: 0.01 })

    const resizeObserver = new ResizeObserver(rebuild)
    resizeObserver.observe(canvas)
    visibilityObserver.observe(canvas)
    window.addEventListener('pointermove', updatePointer)
    window.addEventListener('blur', clearPointer)
    rebuild()
    render(0)
    start()

    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      window.removeEventListener('pointermove', updatePointer)
      window.removeEventListener('blur', clearPointer)
    }
  }, [text])

  return (
    <div className={sty.root} aria-hidden="true">
      <canvas ref={canvasRef} className={sty.canvas} />
    </div>
  )
}