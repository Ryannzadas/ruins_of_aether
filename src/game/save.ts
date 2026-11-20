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

export function loadGame(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as Partial<SaveData>
    if (data?.version !== VERSION) return null
    if (!data.player || typeof data.player.hp !== 'number') return null
    if (!data.story || typeof data.story.cursor?.label !== 'string') return null
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
