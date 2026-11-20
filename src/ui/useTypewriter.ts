import { useEffect, useState } from 'react'

const CHARS_PER_SECOND = 55

/** Sem animação quando o sistema pede menos movimento (ou não há matchMedia, como nos testes). */
export function prefersMotion(): boolean {
  return typeof window.matchMedia === 'function' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Revela o texto aos poucos. `finish()` mostra tudo de uma vez. */
export function useTypewriter(text: string) {
  const [state, setState] = useState(() => ({ text, count: prefersMotion() ? 0 : text.length }))
  // Texto novo: recomeça (ajuste de estado durante a renderização).
  if (state.text !== text) setState({ text, count: prefersMotion() ? 0 : text.length })
  const count = state.text === text ? state.count : 0
  const done = count >= text.length

  useEffect(() => {
    if (done) return
    const id = window.setTimeout(() => setState((s) => (s.text === text ? { ...s, count: s.count + 1 } : s)), 1000 / CHARS_PER_SECOND)
    return () => window.clearTimeout(id)
  }, [text, count, done])

  return { shown: text.slice(0, count), done, finish: () => setState({ text, count: text.length }) }
}
