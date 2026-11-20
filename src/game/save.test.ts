import { newStory } from '@/story/runner'
import { newPlayer } from './player'
import { clearSave, loadGame, saveGame, SAVE_KEY } from './save'

const data = { player: newPlayer('Ana'), story: newStory(1) }

test('saves and loads the same game', () => {
  expect(saveGame(data)).toBe(true)
  expect(loadGame()).toMatchObject({ version: 1, ...data })
  clearSave()
  expect(loadGame()).toBeNull()
})

test('broken or old saves are ignored', () => {
  localStorage.setItem(SAVE_KEY, '{nope')
  expect(loadGame()).toBeNull()
  localStorage.setItem(SAVE_KEY, JSON.stringify({ version: 0, ...data }))
  expect(loadGame()).toBeNull()
  localStorage.setItem(SAVE_KEY, JSON.stringify({ version: 1, player: null }))
  expect(loadGame()).toBeNull()
})

test('a blocked storage does not crash the game', () => {
  const set = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('blocked')
  })
  const get = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('blocked')
  })
  expect(saveGame(data)).toBe(false)
  expect(loadGame()).toBeNull()
  set.mockRestore()
  get.mockRestore()
})
