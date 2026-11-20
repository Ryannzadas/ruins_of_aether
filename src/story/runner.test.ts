import { advance, cleanName, current, fillName, newStory, takeHumanityShift } from './runner'
import type { Script } from './types'

const script: Script = {
  start: [
    { kind: 'narration', text: 'Olá, {nome}.' },
    { kind: 'choice', prompt: 'E agora?', options: [{ label: 'A', set: { pick: 'a' }, goto: 'a' }, { label: 'B', goto: 'b' }] },
  ],
  a: [{ kind: 'set', flags: { visited: true } }, { kind: 'when', flag: 'pick', equals: 'a', goto: 'fim' }, { kind: 'narration', text: 'não devia chegar aqui' }, { kind: 'goto', to: 'fim' }],
  b: [{ kind: 'narration', text: 'B' }, { kind: 'goto', to: 'fim' }],
  fim: [{ kind: 'note', who: 'kael', text: 'log' }, { kind: 'end', chapter: 1 }],
}

test('cleanName trims, defaults and caps the name', () => {
  expect(cleanName('   ')).toBe('Viajante')
  expect(cleanName('  Ana  ')).toBe('Ana')
  expect(cleanName('a'.repeat(30))).toHaveLength(16)
  expect(cleanName('<b>x</b>')).toBe('<b>x</b>')
})

test('fillName replaces {nome}', () => {
  expect(fillName('Olá, {nome}. {nome}?', 'Ana')).toBe('Olá, Ana. Ana?')
})

test('narration advances one step', () => {
  const s = advance(script, newStory(1))
  expect(current(script, s)).toMatchObject({ kind: 'choice' })
})

test('a choice does not advance without an option', () => {
  const s = advance(script, newStory(1))
  expect(advance(script, s)).toEqual(s)
  expect(advance(script, s, { option: 7 })).toEqual(s)
})

test('choices set flags, invisible steps run on their own and notes are kept', () => {
  let s = advance(script, newStory(1))
  s = advance(script, s, { option: 0 })
  expect(current(script, s)).toEqual({ kind: 'end', chapter: 1 })
  expect(s.flags).toMatchObject({ pick: 'a', visited: true })
  expect(s.kaelLogs).toEqual(['log'])
})

describe('humanity in the script', () => {
  const s2: Script = {
    start: [
      { kind: 'humanity', delta: 10 },
      { kind: 'humanity', delta: 5 },
      { kind: 'narration', text: 'x' },
      { kind: 'whenHumanity', min: 55, goto: 'alto' },
      { kind: 'whenHumanity', max: 35, goto: 'baixo' },
      { kind: 'end', chapter: 1 },
    ],
    alto: [{ kind: 'narration', text: 'alto' }, { kind: 'end', chapter: 2 }],
    baixo: [{ kind: 'narration', text: 'baixo' }, { kind: 'end', chapter: 3 }],
  }

  test('humanity steps accumulate until the app takes them', () => {
    const s = advance(s2, newStory(1), undefined, 50)
    expect(s.humanityShift).toBe(15)
    const taken = takeHumanityShift(s)
    expect(taken.delta).toBe(15)
    expect(taken.story.humanityShift).toBe(0)
  })

  test('whenHumanity counts the shift not yet applied', () => {
    const at = (h: number, shift: number) => {
      const s = { ...newStory(1), cursor: { label: 'start', index: 2 }, humanityShift: shift }
      return current(s2, advance(s2, s, undefined, h), h)
    }
    expect(at(50, 5)).toEqual({ kind: 'narration', text: 'alto' })
    expect(at(50, 4)).toEqual({ kind: 'end', chapter: 1 })
    expect(at(35, 0)).toEqual({ kind: 'narration', text: 'baixo' })
  })

  test('old saves without humanityShift count as zero', () => {
    const { humanityShift: _h, ...old } = newStory(1)
    expect(takeHumanityShift(old as never).delta).toBe(0)
  })
})
