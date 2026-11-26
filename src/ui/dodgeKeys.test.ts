import { heldKeys } from './dodgeKeys'

const evt = (key: string) => ({ key, preventDefault: vi.fn() })

test('arrows and WASD set direction and call preventDefault', () => {
  const keys = heldKeys()
  const left = evt('ArrowLeft')
  const down = evt('s')
  expect(keys.keyDown(left)).toBe(true)
  expect(left.preventDefault).toHaveBeenCalled()
  expect(keys.keyDown(down)).toBe(true)
  expect(keys.dir()).toEqual({ dx: -1, dy: 1 })

  keys.keyUp({ key: 'ArrowLeft' })
  expect(keys.dir()).toEqual({ dx: 0, dy: 1 })
})

test('window blur clears all held keys so the soul stops moving', () => {
  const keys = heldKeys()
  keys.keyDown(evt('ArrowRight'))
  keys.keyDown(evt('w'))
  expect(keys.dir()).toEqual({ dx: 1, dy: -1 })

  keys.blur()
  expect(keys.dir()).toEqual({ dx: 0, dy: 0 })
})

test('space is swallowed during dodge without changing direction', () => {
  const keys = heldKeys()
  const space = evt(' ')
  expect(keys.keyDown(space)).toBe(false)
  expect(space.preventDefault).toHaveBeenCalled()
  expect(keys.dir()).toEqual({ dx: 0, dy: 0 })
})
