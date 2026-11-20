import { useRef } from 'react'

/** Tempo em que botões recém-surgidos ignoram cliques, para um toque duplo não escolher sem querer. */
export const TAP_GUARD_MS = 350

/**
 * Devolve `ready()`: falso nos primeiros TAP_GUARD_MS depois que `key` muda.
 * Só vale para clique/toque; o teclado já ignora teclas repetidas.
 */
export function useTapGuard(key: unknown): () => boolean {
  const ref = useRef({ key, at: Date.now() })
  if (ref.current.key !== key) ref.current = { key, at: Date.now() }
  return () => Date.now() - ref.current.at >= TAP_GUARD_MS
}
