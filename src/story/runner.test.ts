import { advance, cleanName, current, fillName, newStory } from './runner'
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
