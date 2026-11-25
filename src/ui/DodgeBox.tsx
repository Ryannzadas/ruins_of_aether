import { useEffect, useRef } from 'react'
import { backingSize } from './canvasSize'
import { heldKeys } from './dodgeKeys'
import { BOX, SOUL_RADIUS, startDodge, stepDodge, type DodgeInput, type DodgeSim, type Pattern } from '@/game/dodge'

/**
 * A caixa de desvio. A simulação é `stepDodge`; aqui só entram teclado/toque e o desenho.
 * Teclado: setas ou WASD. Toque/mouse: a alma anda até o dedo.
 */
export function DodgeBox({ pattern, onDone }: { pattern: Pattern; onDone: (hits: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    const canvas = canvasRef.current!
    // No celular a caixa pode estar fora da tela: traz para o meio antes do ataque.
    canvas.scrollIntoView?.({ block: 'center', behavior: 'smooth' })
    const ctx = canvas.getContext('2d')
    const keys = heldKeys()
    let target: { x: number; y: number } | null = null
    let sim: DodgeSim = startDodge(pattern, Math.random)
    let last = performance.now()
    let raf = 0
    let finished = false

    const toLogical = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      return { x: ((e.clientX - r.left) / r.width) * BOX, y: ((e.clientY - r.top) / r.height) * BOX }
    }
    // Toque relativo: o dedo não precisa cobrir a alma; ela segue o deslocamento do dedo.
    let anchor: { finger: { x: number; y: number }; soul: { x: number; y: number } } | null = null
    const onDown = (e: PointerEvent) => {
      e.preventDefault()
      canvas.setPointerCapture?.(e.pointerId)
      anchor = { finger: toLogical(e), soul: { ...sim.soul } }
      target = { ...sim.soul }
    }
    const onMove = (e: PointerEvent) => {
      if (!anchor) return
      const f = toLogical(e)
      target = { x: anchor.soul.x + (f.x - anchor.finger.x), y: anchor.soul.y + (f.y - anchor.finger.y) }
    }
    // Soltar o dedo não apaga o destino: a alma termina o caminho do arrasto.
    const onUp = () => {
      anchor = null
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (keys.keyDown(e)) target = null
    }
    const onKeyUp = (e: KeyboardEvent) => keys.keyUp(e)
    const onBlur = () => keys.blur()
    const onVisibility = () => (last = performance.now())

    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    document.addEventListener('visibilitychange', onVisibility)

    const input = (): DodgeInput => {
      if (target) return { target }
      return keys.dir()
    }

    const draw = () => {
      if (!ctx) return
      const dpr = window.devicePixelRatio || 1
      const size = backingSize(canvas.clientWidth, dpr)
      if (canvas.width !== size) canvas.width = canvas.height = size
      const k = size / BOX
      ctx.setTransform(k, 0, 0, k, 0, 0)
      ctx.fillStyle = '#0b0906'
      ctx.fillRect(0, 0, BOX, BOX)
      // Linhas de varredura
      ctx.fillStyle = 'rgba(255,181,71,0.05)'
      for (let y = 0; y < BOX; y += 3) ctx.fillRect(0, y, BOX, 1)
      // Projéteis: bits em vermelho
      ctx.fillStyle = '#ff6a3d'
      ctx.shadowColor = '#ff6a3d'
      ctx.shadowBlur = 6
      for (const b of sim.bullets) ctx.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2)
      // Alma: losango verde, pisca quando invulnerável
      const blink = sim.invuln > 0 && Math.floor(sim.invuln * 12) % 2 === 0
      if (!blink) {
        ctx.fillStyle = '#b9ffc9'
        ctx.shadowColor = '#50ff82'
        ctx.shadowBlur = 10
        const { x, y } = sim.soul
        const r = SOUL_RADIUS + 1
        ctx.beginPath()
        ctx.moveTo(x, y - r)
        ctx.lineTo(x + r, y)
        ctx.lineTo(x, y + r)
        ctx.lineTo(x - r, y)
        ctx.closePath()
        ctx.fill()
      }
      ctx.shadowBlur = 0
      // Tempo restante: linha no rodapé
      ctx.fillStyle = '#ffb547'
      ctx.fillRect(0, BOX - 2, BOX * (1 - sim.t / pattern.duration), 2)
    }

    const frame = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      if (!document.hidden) sim = stepDodge(sim, input(), dt)
      draw()
      if (sim.done && !finished) {
        finished = true
        doneRef.current(sim.hits)
        return
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [pattern])

  return (
    <div className="flex flex-col items-center gap-2">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Ataque: ${pattern.name}. Mova-se com as setas, WASD ou o dedo.`}
        className="aspect-square w-full max-w-[min(360px,80vw)] touch-none select-none border-2 border-amber shadow-[inset_0_0_30px_rgb(255_181_71_/_0.12)]"
      />
      <p className="text-xs tracking-[0.2em] text-amber-dim">SETAS / WASD · OU ARRASTE O DEDO</p>
    </div>
  )
}
