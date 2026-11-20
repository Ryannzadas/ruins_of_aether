/** Padrões de ataque. Cada um é uma função de nascimento por tique (60/s). */
import { BOX, type Bullet, type Pattern } from './dodge'

const at = (seconds: number) => Math.round(seconds * 60)

/** Rajada de Dados: fileiras de bits vindo da esquerda, sempre com uma fresta. */
const rajada: Pattern = {
  id: 'rajada',
  name: 'Rajada de Dados',
  duration: 5,
  spawn(tick, rng) {
    if (tick % at(0.6) !== 0 || tick > at(4)) return []
    // 7 faixas com projéteis grandes: entre duas faixas cheias a alma não passa; só a fresta (2 faixas vizinhas) é segura.
    const lanes = 7
    const gap = Math.floor(rng() * (lanes - 1))
    const out: Bullet[] = []
    for (let i = 0; i < lanes; i++) {
      if (i === gap || i === gap + 1) continue
      out.push({ x: -8, y: (i + 0.5) * (BOX / lanes), vx: 120, vy: 0, r: 12 })
    }
    return out
  },
}

/** Colapso de Éter: gotas caindo de cima em posições aleatórias. */
const colapso: Pattern = {
  id: 'colapso',
  name: 'Colapso de Éter',
  duration: 5,
  spawn(tick, rng) {
    if (tick % at(0.25) !== 0 || tick > at(4.2)) return []
    return [{ x: 12 + rng() * (BOX - 24), y: -8, vx: 0, vy: 110 + rng() * 40, r: 5 }]
  },
}

/** Pulso do Núcleo: os cantos e os meios das bordas disparam para o centro, alternando. */
const pulso: Pattern = {
  id: 'pulso',
  name: 'Pulso do Núcleo',
  duration: 5,
  spawn(tick) {
    const waves = [at(0.4), at(1.4), at(2.4), at(3.4)]
    const w = waves.indexOf(tick)
    if (w < 0) return []
    const c = BOX / 2
    const points =
      w % 2 === 0
        ? [[0, 0], [BOX, 0], [0, BOX], [BOX, BOX]]
        : [[c, 0], [BOX, c], [c, BOX], [0, c]]
    const speed = 90
    return points.map(([x, y]) => {
      const d = Math.hypot(c - x, c - y)
      return { x, y, vx: ((c - x) / d) * speed, vy: ((c - y) / d) * speed, r: 7 }
    })
  },
}

export const SPECTER_PATTERNS: Pattern[] = [rajada, colapso, pulso]
