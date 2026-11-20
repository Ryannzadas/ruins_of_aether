import { BOX, SOUL_RADIUS, SOUL_SPEED, startDodge, stepDodge, type DodgeSim, type Pattern } from './dodge'
import { ESPIRAL, GRADE, LAGRIMAS, LAMINAS, SPECTER_PATTERNS } from './patterns'

const quiet: Pattern = { id: 'quiet', name: 'Silêncio', duration: 5, spawn: () => [] }
const rng = () => 0.5

function run(sim: DodgeSim, seconds: number, input = { dx: 0, dy: 0 }) {
  for (let i = 0; i < Math.round(seconds * 60); i++) sim = stepDodge(sim, input, 1 / 60)
  return sim
}

test('the soul starts in the middle of the box with no hits', () => {
  const sim = startDodge(quiet, rng)
  expect(sim.soul).toEqual({ x: 120, y: 120 })
  expect(sim.hits).toBe(0)
  expect(BOX).toBe(240)
})

test('the soul cannot leave the box', () => {
  const sim = run(startDodge(quiet, rng), 1, { dx: 1, dy: 0 })
  expect(sim.soul.x).toBeCloseTo(BOX - SOUL_RADIUS)
})

test('a long frame (hidden tab) only advances 50 ms', () => {
  const sim = stepDodge(startDodge(quiet, rng), { dx: 0, dy: 0 }, 2)
  expect(sim.t).toBeCloseTo(0.05)
})

test('a hit gives 0.8 s of invulnerability', () => {
  let sim: DodgeSim = { ...startDodge(quiet, rng), bullets: [{ x: 120, y: 120, vx: 0, vy: 0, r: 5 }] }
  sim = run(sim, 1 / 60)
  expect(sim.hits).toBe(1)
  sim = run(sim, 0.5)
  expect(sim.hits).toBe(1)
  sim = run(sim, 0.4)
  expect(sim.hits).toBe(2)
})

test('a tap target moves the soul at normal speed, never teleporting', () => {
  const sim = stepDodge(startDodge(quiet, rng), { target: { x: 200, y: 120 } }, 0.05)
  expect(sim.soul.x).toBeCloseTo(120 + SOUL_SPEED * 0.05)
  const arrived = run(startDodge(quiet, rng), 1, { target: { x: 200, y: 120 } } as never)
  expect(arrived.soul.x).toBeCloseTo(200)
})

test('diagonal input is normalised', () => {
  const sim = stepDodge(startDodge(quiet, rng), { dx: 1, dy: 1 }, 0.05)
  const moved = Math.hypot(sim.soul.x - 120, sim.soul.y - 120)
  expect(moved).toBeCloseTo(SOUL_SPEED * 0.05)
})

test.each(SPECTER_PATTERNS.map((p) => [p.name, p] as const))('%s spawns bullets and ends after 5 s', (_name, pattern) => {
  expect(pattern.duration).toBe(5)
  let sim = run(startDodge(pattern, rng), 4.9)
  expect(sim.done).toBe(false)
  expect(sim.spawned).toBeGreaterThan(0)
  sim = run(sim, 0.2)
  expect(sim.done).toBe(true)
})

test('the specter has the three console patterns', () => {
  expect(SPECTER_PATTERNS.map((p) => p.name)).toEqual(['Rajada de Dados', 'Colapso de Éter', 'Pulso do Núcleo'])
})

test('Rajada de Dados hits a soul standing in a lane that is not the gap', () => {
  const rajada = SPECTER_PATTERNS[0]
  // rng 0 → a fresta fica nas primeiras faixas, longe do centro
  let sim = startDodge(rajada, () => 0)
  for (let i = 0; i < 300; i++) sim = stepDodge(sim, { dx: 0, dy: 0 }, 1 / 60)
  expect(sim.hits).toBeGreaterThan(0)
})

test('the gap in Rajada de Dados is wide enough for the soul', () => {
  const rajada = SPECTER_PATTERNS[0]
  for (const r of [0, 0.3, 0.6, 0.99]) {
    const ys = rajada.spawn(0, () => r).map((b) => b.y).sort((a, b) => a - b)
    const edges = [0, ...ys, BOX]
    const widest = Math.max(...edges.slice(1).map((y, i) => y - edges[i]))
    // o vão entre dois projéteis (descontando os raios) cabe a alma com folga
    expect(widest - 2 * 12).toBeGreaterThan(SOUL_RADIUS * 2 + 4)
  }
})

test('Rajada de Dados has no safe spot between two full lanes', () => {
  const rajada = SPECTER_PATTERNS[0]
  const between = (4 + 0.5 + 0.5) * (BOX / 7) // fronteira entre as faixas 4 e 5
  let sim: DodgeSim = { ...startDodge(rajada, () => 0), soul: { x: 120, y: between } }
  for (let i = 0; i < 300; i++) sim = stepDodge(sim, { dx: 0, dy: 0 }, 1 / 60)
  expect(sim.hits).toBeGreaterThan(0)
})

test.each([ESPIRAL, LAMINAS, LAGRIMAS, GRADE].map((p) => [p.name, p] as const))('new pattern %s spawns bullets and ends on time', (_n, pattern) => {
  let sim = startDodge(pattern, rng)
  for (let i = 0; i < Math.round((pattern.duration - 0.1) * 60); i++) sim = stepDodge(sim, { dx: 0, dy: 0 }, 1 / 60)
  expect(sim.done).toBe(false)
  expect(sim.spawned).toBeGreaterThan(0)
  for (let i = 0; i < 12; i++) sim = stepDodge(sim, { dx: 0, dy: 0 }, 1 / 60)
  expect(sim.done).toBe(true)
})

test('every new pattern can hit a soul that never moves', () => {
  for (const pattern of [ESPIRAL, LAMINAS, LAGRIMAS, GRADE]) {
    let hits = 0
    for (const seed of [1, 2, 3]) {
      let x = seed
      const lcg = () => ((x = (x * 1103515245 + 12345) % 2147483648) / 2147483648)
      let sim = startDodge(pattern, lcg)
      while (!sim.done) sim = stepDodge(sim, { dx: 0, dy: 0 }, 1 / 60)
      hits += sim.hits
    }
    expect(hits, pattern.name).toBeGreaterThan(0)
  }
})
