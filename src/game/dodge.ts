/**
 * A caixa de desvio: simulação pura, sem DOM. A tela só desenha o estado.
 * Unidades lógicas: a caixa tem BOX × BOX; o tempo é em segundos.
 */
export const BOX = 240
export const SOUL_RADIUS = 6
export const SOUL_SPEED = 140
export const INVULN_TIME = 0.8
export const MAX_STEP = 0.05
const TICK = 1 / 60
const MARGIN = 24

export type Bullet = { x: number; y: number; vx: number; vy: number; r: number }

export type Pattern = {
  id: string
  name: string
  /** segundos */
  duration: number
  /** Projéteis que nascem no tique `tick` (60 por segundo). */
  spawn(tick: number, rng: () => number): Bullet[]
}

export type DodgeSim = {
  pattern: Pattern
  rng: () => number
  soul: { x: number; y: number }
  bullets: Bullet[]
  t: number
  /** último tique já processado */
  tick: number
  hits: number
  invuln: number
  spawned: number
  done: boolean
}

export type DodgeInput = { dx: number; dy: number } | { target: { x: number; y: number } }

export function startDodge(pattern: Pattern, rng: () => number): DodgeSim {
  return { pattern, rng, soul: { x: BOX / 2, y: BOX / 2 }, bullets: [], t: 0, tick: -1, hits: 0, invuln: 0, spawned: 0, done: false }
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

function moveSoul(soul: { x: number; y: number }, input: DodgeInput, dt: number) {
  const step = SOUL_SPEED * dt
  let x = soul.x
  let y = soul.y
  if ('target' in input) {
    const dx = input.target.x - x
    const dy = input.target.y - y
    const dist = Math.hypot(dx, dy)
    if (dist <= step) {
      x = input.target.x
      y = input.target.y
    } else {
      x += (dx / dist) * step
      y += (dy / dist) * step
    }
  } else {
    const len = Math.hypot(input.dx, input.dy)
    if (len > 0) {
      const k = len > 1 ? 1 / len : 1
      x += input.dx * k * step
      y += input.dy * k * step
    }
  }
  return { x: clamp(x, SOUL_RADIUS, BOX - SOUL_RADIUS), y: clamp(y, SOUL_RADIUS, BOX - SOUL_RADIUS) }
}

export function stepDodge(sim: DodgeSim, input: DodgeInput, dt: number): DodgeSim {
  if (sim.done) return sim
  const step = clamp(dt, 0, MAX_STEP)
  const t = sim.t + step

  // Nascimentos: um chamado por tique cruzado, para o padrão ser igual em qualquer taxa de quadros.
  const lastTick = Math.min(Math.floor(t / TICK + 1e-9), Math.floor(sim.pattern.duration / TICK) - 1)
  const born: Bullet[] = []
  for (let k = sim.tick + 1; k <= lastTick; k++) born.push(...sim.pattern.spawn(k, sim.rng))

  const bullets = [...sim.bullets, ...born]
    .map((b) => ({ ...b, x: b.x + b.vx * step, y: b.y + b.vy * step }))
    .filter((b) => b.x > -MARGIN && b.x < BOX + MARGIN && b.y > -MARGIN && b.y < BOX + MARGIN)

  const soul = moveSoul(sim.soul, input, step)
  let invuln = Math.max(0, sim.invuln - step)
  let hits = sim.hits
  if (invuln === 0 && bullets.some((b) => Math.hypot(b.x - soul.x, b.y - soul.y) < b.r + SOUL_RADIUS)) {
    hits++
    invuln = INVULN_TIME
  }

  return {
    ...sim,
    soul,
    bullets,
    t,
    tick: Math.max(sim.tick, lastTick),
    hits,
    invuln,
    spawned: sim.spawned + born.length,
    done: t >= sim.pattern.duration - 1e-9,
  }
}
