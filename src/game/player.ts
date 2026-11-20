/** O ERRO-7: atributos, dano, experiência e Humanidade. Funções puras. */
export type Player = {
  name: string
  hp: number
  maxHp: number
  mp: number
  maxMp: number
  level: number
  exp: number
  attack: number
  defense: number
  /** 0 = máquina, 100 = humano. */
  humanity: number
}

/** XP total para chegar em cada nível. */
const EXP_TABLE: Record<number, number> = { 2: 50, 3: 120, 4: 250, 5: 500, 6: 800 }
const MAX_LEVEL = 6

export function newPlayer(name: string): Player {
  return { name, hp: 30, maxHp: 30, mp: 15, maxMp: 15, level: 1, exp: 0, attack: 8, defense: 3, humanity: 50 }
}

export function damageAfterDefense(amount: number, defense: number): number {
  return Math.max(1, amount - defense)
}

export function shiftHumanity(p: Player, delta: number): Player {
  const humanity = Math.max(0, Math.min(100, p.humanity + delta))
  let { attack, defense } = p
  if (humanity > 70 && delta > 0) {
    attack = Math.max(6, attack - 1)
    defense = Math.min(8, defense + 1)
  }
  if (humanity < 30 && delta < 0) attack = Math.min(20, attack + 1)
  return { ...p, humanity, attack, defense }
}

export function takeDamage(p: Player, amount: number): { player: Player; dealt: number } {
  const dealt = damageAfterDefense(amount, p.defense)
  return { player: { ...p, hp: Math.max(0, p.hp - dealt) }, dealt }
}

export function gainExp(p: Player, amount: number): { player: Player; levelsGained: number } {
  let player = { ...p, exp: p.exp + amount }
  let levelsGained = 0
  while (player.level < MAX_LEVEL && player.exp >= EXP_TABLE[player.level + 1]) {
    const maxHp = player.maxHp + 5
    const maxMp = player.maxMp + 3
    player = { ...player, level: player.level + 1, maxHp, hp: maxHp, maxMp, mp: maxMp, attack: player.attack + 2, defense: player.defense + 1 }
    levelsGained++
  }
  return { player, levelsGained }
}
