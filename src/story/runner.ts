/** Caminha pelo roteiro. Funções puras: recebem uma Story e devolvem outra. */
import type { Outcome } from '@/game/battle'
import type { Script, Story, VisibleStep } from './types'

export const NAME_MAX = 16

export function cleanName(raw: string): string {
  const name = raw.trim().slice(0, NAME_MAX).trim()
  return name || 'Viajante'
}

export function fillName(text: string, name: string): string {
  return text.replaceAll('{nome}', name)
}

export function newStory(chapter: number): Story {
  return { chapter, cursor: { label: 'start', index: 0 }, flags: {}, kaelLogs: [], lyraNotes: [], killed: 0, pacified: 0, humanityShift: 0 }
}

const jump = (s: Story, label: string): Story => ({ ...s, cursor: { label, index: 0 } })
const next = (s: Story): Story => ({ ...s, cursor: { ...s.cursor, index: s.cursor.index + 1 } })

/** Aplica os passos invisíveis até parar num passo visível. */
function settle(script: Script, story: Story, humanity: number): Story {
  let s = story
  for (let guard = 0; guard < 1000; guard++) {
    const steps = script[s.cursor.label]
    if (!steps) throw new Error(`Rótulo inexistente: ${s.cursor.label}`)
    const st = steps[s.cursor.index]
    if (!st) throw new Error(`O rótulo ${s.cursor.label} acabou sem saída`)
    switch (st.kind) {
      case 'goto':
        s = jump(s, st.to)
        break
      case 'when':
        s = s.flags[st.flag] === st.equals ? jump(s, st.goto) : next(s)
        break
      case 'set':
        s = next({ ...s, flags: { ...s.flags, ...st.flags } })
        break
      case 'humanity':
        s = next({ ...s, humanityShift: (s.humanityShift ?? 0) + st.delta })
        break
      case 'whenHumanity': {
        const h = Math.max(0, Math.min(100, humanity + (s.humanityShift ?? 0)))
        const inRange = (st.min === undefined || h >= st.min) && (st.max === undefined || h <= st.max)
        s = inRange ? jump(s, st.goto) : next(s)
        break
      }
      case 'note':
        s = next(st.who === 'kael' ? { ...s, kaelLogs: [...s.kaelLogs, st.text] } : { ...s, lyraNotes: [...s.lyraNotes, st.text] })
        break
      default:
        return s
    }
  }
  throw new Error('Laço infinito no roteiro')
}

export function current(script: Script, story: Story, humanity = 50): VisibleStep {
  const s = settle(script, story, humanity)
  return script[s.cursor.label][s.cursor.index] as VisibleStep
}

export function advance(script: Script, story: Story, input?: { option?: number; battle?: Outcome }, humanity = 50): Story {
  const s = settle(script, story, humanity)
  const st = current(script, s, humanity)
  switch (st.kind) {
    case 'end':
      return s
    case 'choice': {
      const opt = input?.option === undefined ? undefined : st.options[input.option]
      if (!opt) return s
      return settle(script, jump({ ...s, flags: { ...s.flags, ...opt.set } }, opt.goto), humanity)
    }
    case 'battle': {
      const r = input?.battle
      if (!r) return s
      const counted = r === 'victory' ? { ...s, killed: s.killed + 1 } : r === 'pacified' ? { ...s, pacified: s.pacified + 1 } : s
      return settle(script, jump(counted, st.goto[r]), humanity)
    }
    default:
      return settle(script, next(s), humanity)
  }
}

/** Entrega ao App a Humanidade que o roteiro mudou, e zera o acumulado. */
export function takeHumanityShift(story: Story): { story: Story; delta: number } {
  return { story: { ...story, humanityShift: 0 }, delta: story.humanityShift ?? 0 }
}
