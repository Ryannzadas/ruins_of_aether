import { TOWER_SPECTER } from '@/game/enemies'
import { CHAPTER_1 } from './chapter1'
import { advance, current, newStory } from './runner'
import type { Story } from './types'

function labelsUsed(): string[] {
  const out: string[] = []
  for (const steps of Object.values(CHAPTER_1))
    for (const st of steps) {
      if (st.kind === 'goto') out.push(st.to)
      if (st.kind === 'when') out.push(st.goto)
      if (st.kind === 'choice') st.options.forEach((o) => out.push(o.goto))
      if (st.kind === 'battle') out.push(st.goto.victory, st.goto.pacified, st.goto.defeat)
    }
  return out
}

test('every jump points to a label that exists', () => {
  for (const l of labelsUsed()) expect(CHAPTER_1, l).toHaveProperty(l)
  expect(CHAPTER_1).toHaveProperty('start')
})

test('every label ends in a step that leaves it', () => {
  for (const [label, steps] of Object.entries(CHAPTER_1)) expect(['goto', 'end', 'choice', 'battle'], label).toContain(steps.at(-1)!.kind)
})

function play(result: 'victory' | 'pacified', option = 0, limit = 500): { story: Story; sawBattle: number } {
  let story = newStory(1)
  let sawBattle = 0
  for (let i = 0; i < limit; i++) {
    const st = current(CHAPTER_1, story)
    if (st.kind === 'end') return { story, sawBattle }
    if (st.kind === 'choice') story = advance(CHAPTER_1, story, { option: Math.min(option, st.options.length - 1) })
    else if (st.kind === 'battle') {
      sawBattle++
      expect(st.enemy).toBe(TOWER_SPECTER)
      story = advance(CHAPTER_1, story, { battle: result })
    } else story = advance(CHAPTER_1, story)
  }
  throw new Error('o capítulo não terminou')
}

test.each([0, 1, 2])('sparing the specter (always option %i) reaches the end', (option) => {
  const { story, sawBattle } = play('pacified', option)
  expect(sawBattle).toBe(1)
  expect(story.flags).toMatchObject({ specter_result: 'pacified', found_erro7_file: true, met_kael: true })
  expect(story.pacified).toBe(1)
  expect(current(CHAPTER_1, story)).toEqual({ kind: 'end', chapter: 1 })
})

test('killing the specter is remembered', () => {
  const { story } = play('victory')
  expect(story.flags.specter_result).toBe('victory')
  expect(story.killed).toBe(1)
})

test('losing goes back to before the fight', () => {
  let story = newStory(1)
  for (let i = 0; i < 500 && current(CHAPTER_1, story).kind !== 'battle'; i++) {
    const st = current(CHAPTER_1, story)
    story = advance(CHAPTER_1, story, st.kind === 'choice' ? { option: 0 } : undefined)
  }
  const before = story
  story = advance(CHAPTER_1, story, { battle: 'defeat' })
  expect(current(CHAPTER_1, story).kind).not.toBe('end')
  for (let i = 0; i < 50 && current(CHAPTER_1, story).kind !== 'battle'; i++) story = advance(CHAPTER_1, story)
  expect(current(CHAPTER_1, story)).toEqual(current(CHAPTER_1, before))
})
