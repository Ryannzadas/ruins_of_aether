/** Inimigos. Números e falas vêm do jogo em Python (console/combat.py). */
import type { Pattern } from './dodge'
import { SPECTER_PATTERNS } from './patterns'

export type EnemyDef = {
  id: string
  name: string
  maxHp: number
  attack: number
  defense: number
  expReward: number
  mercyThreshold: number
  canPacify: boolean
  humanCorrupted: boolean
  preBattle: string[]
  taunts: string[]
  onDefeat: string
  onPacify: string
  pacifyLines: string[]
  attackLine: string
  patterns: Pattern[]
}

export const TOWER_SPECTER: EnemyDef = {
  id: 'espectro',
  name: 'Espectro da Torre',
  maxHp: 40,
  attack: 6,
  defense: 2,
  expReward: 50,
  mercyThreshold: 3,
  canPacify: true,
  humanCorrupted: true,
  preBattle: ['Quem...? Onde...? Dói...', 'Eu... eu resisti... e eles apagaram... tudo...'],
  taunts: ['...não... apaguem... por favor...', 'Eu tinha... um nome...', 'Onde... está... minha filha...?'],
  onDefeat: 'Um último suspiro humano. Depois, apenas estática.',
  onPacify: 'Por um momento, ele sorri. Depois, dissolve em paz.',
  pacifyLines: [
    'Você estende a mão. Por um instante, os olhos dele focam.',
    '« Quem... sou eu? » — a voz quebra entre humano e estático.',
    'Compaixão atravessa o véu de dados apagados.',
  ],
  attackLine: 'Seus movimentos são precisos. Eficientes. Mecânicos.',
  patterns: SPECTER_PATTERNS,
}
