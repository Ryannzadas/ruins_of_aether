/** Todos os capítulos, na ordem. */
import { CHAPTER_1 } from './chapter1'
import { CHAPTER_2 } from './chapter2'
import { CHAPTER_3 } from './chapter3'
import { CHAPTER_4 } from './chapter4'
import { CHAPTER_5 } from './chapter5'
import type { Script } from './types'

export { ENDING_TITLES } from './chapter5'

export const SCRIPTS: Record<number, Script> = { 1: CHAPTER_1, 2: CHAPTER_2, 3: CHAPTER_3, 4: CHAPTER_4, 5: CHAPTER_5 }

export const CHAPTER_TITLES: Record<number, string> = {
  1: 'A Torre Inicial',
  2: 'Os Arquivos de Lyra',
  3: 'O Éter Corrompido',
  4: 'Ecos de Mors',
  5: 'O Topo da Torre',
}

export const LAST_CHAPTER = 5
