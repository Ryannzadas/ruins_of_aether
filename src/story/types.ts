/** Formato do roteiro. A história é dado; o motor (runner.ts) só caminha por ele. */
import type { EnemyDef } from '@/game/enemies'

export type Speaker = 'Kael' | 'Você' | 'Lyra' | 'Mors' | 'Sistema'
export type FlagValue = string | boolean
export type Flags = Record<string, FlagValue>

export type Step =
  // Passos que o jogador vê
  | { kind: 'title'; chapter: number; text: string }
  | { kind: 'narration'; text: string; tone?: 'danger' }
  | { kind: 'line'; speaker: Speaker; text: string }
  /** Fala do ERRO-7 "sem perceber": voz de máquina. */
  | { kind: 'glitch'; text: string }
  /** Pensamento: verde se mais humano, vermelho se mais máquina. */
  | { kind: 'thought'; text: string }
  /** Bloco de arquivo/terminal, mostrado em fonte fixa. */
  | { kind: 'file'; text: string }
  | { kind: 'choice'; prompt: string; options: { label: string; set?: Flags; goto: string }[] }
  | { kind: 'battle'; enemy: EnemyDef; goto: { victory: string; pacified: string; defeat: string } }
  | { kind: 'end'; chapter: number }
  // Passos invisíveis: o motor aplica sozinho
  | { kind: 'goto'; to: string }
  | { kind: 'when'; flag: string; equals: FlagValue; goto: string }
  | { kind: 'set'; flags: Flags }
  | { kind: 'note'; who: 'kael' | 'lyra'; text: string }
  /** Muda a Humanidade do jogador (o App aplica). */
  | { kind: 'humanity'; delta: number }
  /** Pula se a Humanidade (já contando o que falta aplicar) estiver na faixa. */
  | { kind: 'whenHumanity'; min?: number; max?: number; goto: string }

export type VisibleStep = Extract<Step, { kind: 'title' | 'narration' | 'line' | 'glitch' | 'thought' | 'file' | 'choice' | 'battle' | 'end' }>

/** Rótulo → passos. Começa em 'start'. */
export type Script = Record<string, Step[]>

export type Cursor = { label: string; index: number }

export type Story = {
  chapter: number
  cursor: Cursor
  flags: Flags
  kaelLogs: string[]
  lyraNotes: string[]
  killed: number
  pacified: number
  /** Humanidade mudada pelo roteiro e ainda não aplicada ao jogador. Saves antigos não têm. */
  humanityShift?: number
}
