import { damageAfterDefense, gainExp, newPlayer, shiftHumanity, takeDamage } from './player'

test('a new player starts with the console stats', () => {
  expect(newPlayer('Ana')).toEqual({ name: 'Ana', hp: 30, maxHp: 30, mp: 15, maxMp: 15, level: 1, exp: 0, attack: 8, defense: 3, humanity: 50 })
})

test('humanity is clamped between 0 and 100', () => {
  expect(shiftHumanity({ ...newPlayer('a'), humanity: 96 }, 8).humanity).toBe(100)
  expect(shiftHumanity({ ...newPlayer('a'), humanity: 4 }, -8).humanity).toBe(0)
})

test('very human players hit softer and defend better', () => {
  const p = shiftHumanity({ ...newPlayer('a'), humanity: 66 }, 8)
  expect(p).toMatchObject({ humanity: 74, attack: 7, defense: 4 })
})

test('very mechanical players hit harder', () => {
  const p = shiftHumanity({ ...newPlayer('a'), humanity: 34 }, -8)
  expect(p).toMatchObject({ humanity: 26, attack: 9, defense: 3 })
})

test('shiftHumanity does not mutate its input', () => {
  const p = newPlayer('a')
  shiftHumanity(p, -8)
  expect(p.humanity).toBe(50)
})

test('damage always lands at least 1 and hp never goes below 0', () => {
  expect(damageAfterDefense(2, 3)).toBe(1)
  expect(damageAfterDefense(10, 3)).toBe(7)
  const { player, dealt } = takeDamage({ ...newPlayer('a'), hp: 2 }, 20)
  expect(dealt).toBe(17)
  expect(player.hp).toBe(0)
})

test('experience levels the player up following the console table', () => {
  const { player, levelsGained } = gainExp(newPlayer('a'), 50)
  expect(levelsGained).toBe(1)
  expect(player).toMatchObject({ level: 2, maxHp: 35, hp: 35, maxMp: 18, mp: 18, attack: 10, defense: 4, exp: 50 })
  expect(gainExp(newPlayer('a'), 130).player.level).toBe(3)
  expect(gainExp(newPlayer('a'), 99_999).player.level).toBe(6)
})
