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

/** Espiral: um emissor acima da caixa varre de um lado ao outro, dois braços por vez. */
export const ESPIRAL: Pattern = {
  id: 'espiral',
  name: 'Espiral de Dados',
  duration: 5.5,
  spawn(tick) {
    if (tick % at(0.12) !== 0 || tick > at(4.8)) return []
    const t = tick / 60
    const sweep = Math.PI / 2 + Math.sin(t * 1.6) * 1.1 // vai e volta em torno de "para baixo"
    return [sweep - 0.28, sweep + 0.28].map((a) => ({ x: BOX / 2, y: -6, vx: Math.cos(a) * 95, vy: Math.sin(a) * 95, r: 5 }))
  },
}

/** Lâminas: ondas diagonais vindas de cima e da lateral, com um trecho livre; alterna o lado. */
export const LAMINAS: Pattern = {
  id: 'laminas',
  name: 'Lâminas de Éter',
  duration: 5,
  spawn(tick, rng) {
    if (tick % at(0.9) !== 0 || tick > at(3.8)) return []
    const wave = tick / at(0.9)
    const right = wave % 2 === 0 // desce para a direita ou para a esquerda
    const vx = right ? 70 : -70
    const vy = 90
    const slots = 16
    const gap = 2 + Math.floor(rng() * (slots - 6))
    const out: Bullet[] = []
    for (let i = 0; i < slots; i++) {
      if (i >= gap && i < gap + 3) continue
      // metade no topo, metade na lateral de onde a onda vem
      const k = (i % 8) * 30 + 15
      if (i < 8) out.push({ x: right ? k : BOX - k, y: -6, vx, vy, r: 7 })
      else out.push({ x: right ? -6 : BOX + 6, y: k, vx, vy, r: 7 })
    }
    return out
  },
}

/** Lágrimas de Luz: gotas lentas, muitas, caindo devagar. */
export const LAGRIMAS: Pattern = {
  id: 'lagrimas',
  name: 'Lágrimas de Luz',
  duration: 5,
  spawn(tick, rng) {
    if (tick % at(0.15) !== 0 || tick > at(4.4)) return []
    return [{ x: 10 + rng() * (BOX - 20), y: -6, vx: (rng() - 0.5) * 20, vy: 55 + rng() * 20, r: 6 }]
  },
}

/** Grade: paredes alternadas (da esquerda e de cima), cada uma com uma fresta de três vãos. */
export const GRADE: Pattern = {
  id: 'grade',
  name: 'Grade do Núcleo',
  duration: 5.5,
  spawn(tick, rng) {
    if (tick % at(1.1) !== 0 || tick > at(4.4)) return []
    const wave = tick / at(1.1)
    const slots = 12
    const gap = 1 + Math.floor(rng() * (slots - 4))
    const out: Bullet[] = []
    for (let i = 0; i < slots; i++) {
      if (i >= gap && i < gap + 3) continue
      const k = i * (BOX / slots) + BOX / slots / 2
      out.push(wave % 2 === 0 ? { x: -6, y: k, vx: 100, vy: 0, r: 7 } : { x: k, y: -6, vx: 0, vy: 100, r: 7 })
    }
    return out
  },
}

const [RAJADA, COLAPSO, PULSO] = SPECTER_PATTERNS
export const GUARDIAN_PATTERNS: Pattern[] = [LAMINAS, RAJADA, COLAPSO]
export const CORRUPTED_PATTERNS: Pattern[] = [ESPIRAL, GRADE, COLAPSO]
export const LESSER_AVATAR_PATTERNS: Pattern[] = [PULSO, ESPIRAL, LAMINAS]
export const REMNANT_PATTERNS: Pattern[] = [LAGRIMAS, PULSO, ESPIRAL]
export const MORS_PATTERNS: Pattern[] = [GRADE, ESPIRAL, LAMINAS, PULSO]
