import { advance, current, newStory } from './runner'
import { CHAPTER_TITLES, LAST_CHAPTER, SCRIPTS } from './index'
import type { Flags, Script, Story } from './types'

function jumps(script: Script): string[] {
  const out: string[] = []
  for (const steps of Object.values(script))
    for (const st of steps) {
      if (st.kind === 'goto') out.push(st.to)
      if (st.kind === 'when' || st.kind === 'whenHumanity') out.push(st.goto)
      if (st.kind === 'choice') st.options.forEach((o) => out.push(o.goto))
      if (st.kind === 'battle') out.push(st.goto.victory, st.goto.pacified, st.goto.defeat)
    }
  return out
}

function play(script: Script, start: Story, opts: { option?: number; result?: 'victory' | 'pacified'; humanity?: number } = {}) {
  let story = start
  let battles = 0
  const h = opts.humanity ?? 50
  for (let i = 0; i < 2000; i++) {
    const st = current(script, story, h)
    if (st.kind === 'end') return { story, battles, end: st }
    if (st.kind === 'choice') story = advance(script, story, { option: Math.min(opts.option ?? 0, st.options.length - 1) }, h)
    else if (st.kind === 'battle') {
      battles++
      story = advance(script, story, { battle: opts.result ?? 'pacified' }, h)
    } else story = advance(script, story, undefined, h)
  }
  throw new Error('o capítulo não terminou')
}

test('there is a script and a title for every chapter up to the last', () => {
  expect(LAST_CHAPTER).toBe(5)
  for (let n = 1; n <= LAST_CHAPTER; n++) {
    expect(SCRIPTS[n], `capítulo ${n}`).toBeDefined()
    expect(CHAPTER_TITLES[n]).toBeTruthy()
  }
})

describe.each([1, 2, 3, 4, 5])('chapter %i', (n) => {
  const script = SCRIPTS[n]

  test('every jump points to a label that exists, and every label leaves', () => {
    for (const l of jumps(script)) expect(script, l).toHaveProperty(l)
    for (const [label, steps] of Object.entries(script)) expect(['goto', 'end', 'choice', 'battle'], label).toContain(steps.at(-1)!.kind)
  })

  test.each([0, 1, 2])('always option %i, sparing everyone, reaches the end of the chapter', (option) => {
    const { end, battles } = play(script, newStory(n), { option })
    expect(end).toEqual({ kind: 'end', chapter: n })
    expect(battles).toBeGreaterThanOrEqual(1)
  })

  test('killing everyone also reaches the end', () => {
    expect(play(script, newStory(n), { result: 'victory' }).end.kind).toBe('end')
  })

  test('losing a fight goes back to before it', () => {
    let story = newStory(n)
    for (let i = 0; i < 2000 && current(script, story).kind !== 'battle'; i++) {
      const st = current(script, story)
      story = advance(script, story, st.kind === 'choice' ? { option: 0 } : undefined)
    }
    const before = current(script, story)
    story = advance(script, story, { battle: 'defeat' })
    for (let i = 0; i < 50 && current(script, story).kind !== 'battle'; i++) story = advance(script, story)
    expect(current(script, story)).toEqual(before)
  })
})

test('chapter 2: keeping the promise to Lyra raises humanity by 10', () => {
  const kept = play(SCRIPTS[2], newStory(2), { option: 0 }).story
  const refused = play(SCRIPTS[2], newStory(2), { option: 1 }).story
  expect(kept.flags.promised_lyra).toBe(true)
  expect((kept.humanityShift ?? 0) - (refused.humanityShift ?? 0)).toBe(10)
})

test('chapter 3: seeing the deleted names and Kael confessing add 15 humanity', () => {
  expect(play(SCRIPTS[3], newStory(3)).story.humanityShift).toBe(15)
})

test.each([
  [0, 'destruction', 5],
  [1, 'acceptance', -10],
  [2, 'fusion', 0],
])('chapter 4: moral choice option %i is %s and shifts humanity by %i', (option, moral, delta) => {
  const { story } = play(SCRIPTS[4], newStory(4), { option })
  expect(story.flags.moral_choice).toBe(moral)
  expect(story.humanityShift).toBe(delta)
})

describe('chapter 5 endings follow the console rules', () => {
  const ending = (moral: string, humanity: number) => {
    const start: Story = { ...newStory(5), flags: { moral_choice: moral } as Flags }
    return play(SCRIPTS[5], start, { humanity }).story.flags.ending
  }
  test.each([
    ['destruction', 10, 'destruction'],
    ['acceptance', 90, 'acceptance'],
    ['fusion', 55, 'destruction'],
    ['fusion', 54, 'fusion'],
    ['fusion', 35, 'acceptance'],
    ['fusion', 36, 'fusion'],
  ])('moral %s with humanity %i → %s', (moral, h, expected) => {
    expect(ending(moral, h)).toBe(expected)
  })
})
