import { enemyHits, playerAction, startBattle } from './battle'
import { CITY_CORRUPTED, LESSER_AVATAR, MORS_AVATAR, SHADOW_GUARDIAN, THE_REMNANT, TOWER_SPECTER } from './enemies'
import { newPlayer } from './player'

const rng = () => 0.5

test('the tower specter keeps the console numbers', () => {
  expect(TOWER_SPECTER).toMatchObject({ name: 'Espectro da Torre', maxHp: 40, attack: 6, defense: 2, expReward: 50, mercyThreshold: 3, canPacify: true })
  expect(TOWER_SPECTER.patterns).toHaveLength(3)
})

test('attacking hurts the enemy and costs 8 humanity', () => {
  const r = playerAction(newPlayer('a'), startBattle(TOWER_SPECTER), 'attack', rng)
  expect(r.battle.enemyHp).toBe(34)
  expect(r.player.humanity).toBe(42)
  expect(r.usedTurn).toBe(true)
  expect(r.log.length).toBeGreaterThan(0)
})

test('magic costs 5 MP and 4 humanity, and does nothing without MP', () => {
  const r = playerAction(newPlayer('a'), startBattle(TOWER_SPECTER), 'magic', rng)
  expect(r.player.mp).toBe(10)
  expect(r.player.humanity).toBe(46)
  expect(r.battle.enemyHp).toBe(40 - (Math.floor(8 * 1.5) + 2 - 2))
  const broke = { ...newPlayer('a'), mp: 4 }
  const b = startBattle(TOWER_SPECTER)
  const r2 = playerAction(broke, b, 'magic', rng)
  expect(r2.usedTurn).toBe(false)
  expect(r2.player).toEqual(broke)
  expect(r2.battle).toEqual(b)
})

test('pacifying three times spares the specter and levels up', () => {
  let p = newPlayer('a')
  let b = startBattle(TOWER_SPECTER)
  for (let i = 0; i < 3; i++) ({ player: p, battle: b } = playerAction(p, b, 'pacify', rng))
  expect(b.outcome).toBe('pacified')
  expect(p.humanity).toBe(74)
  expect(p.exp).toBe(50)
  expect(p.level).toBe(2)
})

test('defeating the specter gives experience', () => {
  let p = newPlayer('a')
  let b = { ...startBattle(TOWER_SPECTER), enemyHp: 3 }
  ;({ player: p, battle: b } = playerAction(p, b, 'attack', rng))
  expect(b.outcome).toBe('victory')
  expect(p.exp).toBe(50)
})

test('pacifying an enemy that cannot be pacified does not use the turn', () => {
  const b = startBattle({ ...TOWER_SPECTER, canPacify: false })
  const r = playerAction(newPlayer('a'), b, 'pacify', rng)
  expect(r.usedTurn).toBe(false)
  expect(r.battle.mercy).toBe(0)
})

test('each dodge hit deals the enemy attack minus defense', () => {
  const r = enemyHits(newPlayer('a'), startBattle(TOWER_SPECTER), 2)
  expect(r.dealt).toBe(6)
  expect(r.player.hp).toBe(24)
  expect(enemyHits(newPlayer('a'), startBattle(TOWER_SPECTER), 0).dealt).toBe(0)
})

test('reaching 0 hp is a defeat', () => {
  const r = enemyHits({ ...newPlayer('a'), hp: 2 }, startBattle(TOWER_SPECTER), 1)
  expect(r.player.hp).toBe(0)
  expect(r.battle.outcome).toBe('defeat')
})

describe('the other enemies keep the console numbers', () => {
  test.each([
    [SHADOW_GUARDIAN, 'Guardião das Sombras', 55, 8, 3, 75, 4],
    [CITY_CORRUPTED, 'Corrompido da Cidade', 65, 9, 4, 90, 3],
    [LESSER_AVATAR, 'Avatar Menor de Mors', 70, 9, 4, 80, 3],
    [THE_REMNANT, 'O Remanescente', 50, 7, 2, 100, 3],
    [MORS_AVATAR, 'Avatar de Mors', 80, 10, 5, 0, 5],
  ] as const)('%s', (e, name, hp, atk, def, exp, mercy) => {
    expect(e).toMatchObject({ name, maxHp: hp, attack: atk, defense: def, expReward: exp, mercyThreshold: mercy, canPacify: true })
    expect(e.patterns.length).toBeGreaterThanOrEqual(2)
    expect(e.portrait.length).toBeGreaterThan(0)
  })
})

test('the final boss gives no experience', () => {
  let p = newPlayer('a')
  let b = startBattle(MORS_AVATAR)
  for (let i = 0; i < 5; i++) ({ player: p, battle: b } = playerAction(p, b, 'pacify', rng))
  expect(b.outcome).toBe('pacified')
  expect(p.exp).toBe(0)
  expect(MORS_AVATAR.givesExp).toBe(false)
})

test('winning tells how much experience was gained and the new level', () => {
  let p = newPlayer('a')
  let b = startBattle(TOWER_SPECTER)
  let log: string[] = []
  for (let i = 0; i < 3; i++) ({ player: p, battle: b, log } = playerAction(p, b, 'pacify', rng))
  expect(log).toContain('+50 XP')
  expect(log).toContain('EVOLUÇÃO DE SISTEMA — Nível 2')
})
