import { backingSize } from './canvasSize'

test('the canvas backing size is a whole number so it is not rebuilt every frame', () => {
  expect(backingSize(287, 1.25)).toBe(359)
  expect(backingSize(288, 2.625)).toBe(756)
  expect(Number.isInteger(backingSize(333, 1.5))).toBe(true)
})
