/** Save no navegador. Qualquer falha (save quebrado, armazenamento bloqueado) vira "sem save". */
import type { Story } from '@/story/types'
import type { Player } from './player'

export const SAVE_KEY = 'ruins-of-aether:save'
const VERSION = 1

export type SaveData = { version: 1; player: Player; story: Story; savedAt: string }

export function saveGame(d: { player: Player; story: Story }): boolean {
  try {
    const data: SaveData = { version: VERSION, player: d.player, story: d.story, savedAt: new Date().toISOString() }
    localStorage.setItem(SAVE_KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)
const PLAYER_NUMBERS = ['hp', 'maxHp', 'mp', 'maxMp', 'level', 'exp', 'attack', 'defense', 'humanity'] as const

function isPlayer(p: unknown): p is Player {
  return isObj(p) && typeof p.name === 'string' && PLAYER_NUMBERS.every((k) => Number.isFinite(p[k]))
}

function isStory(s: unknown): s is Story {
  return (
    isObj(s) &&
    Number.isFinite(s.chapter) &&
    isObj(s.cursor) &&
    typeof s.cursor.label === 'string' &&
    Number.isInteger(s.cursor.index) &&
    isObj(s.flags) &&
    Array.isArray(s.kaelLogs) &&
    Array.isArray(s.lyraNotes) &&
    Number.isFinite(s.killed) &&
    Number.isFinite(s.pacified)
  )
}

export function loadGame(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as Partial<SaveData>
    if (data?.version !== VERSION) return null
    if (!isPlayer(data.player) || !isStory(data.story)) return null
    return data as SaveData
  } catch {
    return null
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY)
  } catch {
    /* armazenamento bloqueado: nada a apagar */
  }
}
