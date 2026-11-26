/** Controle de teclado durante a esquiva: setas/WASD movem, espaço não rola a página, blur solta tudo. */
const KEYS: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  a: [-1, 0],
  A: [-1, 0],
  ArrowRight: [1, 0],
  d: [1, 0],
  D: [1, 0],
  ArrowUp: [0, -1],
  w: [0, -1],
  W: [0, -1],
  ArrowDown: [0, 1],
  s: [0, 1],
  S: [0, 1],
}

export type KeyEventLike = { key: string; preventDefault: () => void }

export function heldKeys() {
  const held = new Set<string>()
  return {
    keyDown(e: KeyEventLike): boolean {
      if (KEYS[e.key]) {
        e.preventDefault()
        held.add(e.key)
        return true
      }
      if (e.key === ' ') {
        e.preventDefault()
      }
      return false
    },
    keyUp(e: { key: string }) {
      held.delete(e.key)
    },
    blur() {
      held.clear()
    },
    dir(): { dx: number; dy: number } {
      let dx = 0
      let dy = 0
      for (const k of held) {
        dx += KEYS[k][0]
        dy += KEYS[k][1]
      }
      return {
        dx: dx === 0 ? 0 : Math.sign(dx),
        dy: dy === 0 ? 0 : Math.sign(dy),
      }
    },
  }
}
