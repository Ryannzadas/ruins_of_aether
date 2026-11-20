/** Luta por turnos. O turno do inimigo é a caixa de desvio; aqui só entra o número de acertos. */
import type { EnemyDef } from './enemies'
import { damageAfterDefense, gainExp, shiftHumanity, takeDamage, type Player } from './player'

export type Outcome = 'victory' | 'pacified' | 'defeat'
export type Battle = { enemy: EnemyDef; enemyHp: number; mercy: number; turn: number; outcome: Outcome | null }
export type Action = 'attack' | 'magic' | 'pacify'

export const MAGIC_COST = 5

export function startBattle(enemy: EnemyDef): Battle {
  return { enemy, enemyHp: enemy.maxHp, mercy: 0, turn: 0, outcome: null }
}

/** Inteiro de lo a hi (inclusive). */
const roll = (rng: () => number, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1))

export function playerAction(
  p: Player,
  b: Battle,
  a: Action,
  rng: () => number,
): { player: Player; battle: Battle; log: string[]; usedTurn: boolean } {
  if (b.outcome) return { player: p, battle: b, log: [], usedTurn: false }
  const e = b.enemy
  let player = p
  let battle = b
  const log: string[] = []

  if (a === 'attack') {
    const dealt = damageAfterDefense(p.attack + roll(rng, -2, 2), e.defense)
    battle = { ...b, enemyHp: Math.max(0, b.enemyHp - dealt) }
    player = shiftHumanity(p, -8)
    log.push(`Você ataca. ${dealt} de dano.`, e.attackLine)
  } else if (a === 'magic') {
    if (p.mp < MAGIC_COST) return { player: p, battle: b, log: ['MP insuficiente.'], usedTurn: false }
    const dealt = damageAfterDefense(Math.floor(p.attack * 1.5) + roll(rng, 0, 3), e.defense)
    battle = { ...b, enemyHp: Math.max(0, b.enemyHp - dealt) }
    player = shiftHumanity({ ...p, mp: p.mp - MAGIC_COST }, -4)
    log.push(`Protocolo ofensivo ativado. ${dealt} de dano.`, 'Energia bruta. Sem hesitação. Sem remorso.')
  } else {
    if (!e.canPacify) return { player: p, battle: b, log: ['Pacificar é inútil aqui.'], usedTurn: false }
    const mercy = b.mercy + 1
    battle = { ...b, mercy }
    player = shiftHumanity(p, 8)
    log.push(e.pacifyLines[(mercy - 1) % e.pacifyLines.length])
  }

  battle = { ...battle, turn: battle.turn + 1 }
  if (battle.mercy >= e.mercyThreshold) {
    battle = { ...battle, outcome: 'pacified' }
    log.push(e.onPacify)
  } else if (battle.enemyHp <= 0) {
    battle = { ...battle, outcome: 'victory' }
    log.push(e.onDefeat)
  }
  if (battle.outcome) player = gainExp(player, e.expReward).player
  return { player, battle, log, usedTurn: true }
}

export function enemyHits(p: Player, b: Battle, hits: number): { player: Player; battle: Battle; dealt: number } {
  let player = p
  let dealt = 0
  for (let i = 0; i < hits && player.hp > 0; i++) {
    const r = takeDamage(player, b.enemy.attack)
    player = r.player
    dealt += r.dealt
  }
  return { player, battle: player.hp === 0 ? { ...b, outcome: 'defeat' } : b, dealt }
}
