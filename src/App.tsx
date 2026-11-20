import { useState } from 'react'
import type { Outcome } from '@/game/battle'
import { newPlayer, type Player } from '@/game/player'
import { clearSave, loadGame, saveGame } from '@/game/save'
import { CHAPTER_1 } from '@/story/chapter1'
import { advance, cleanName, current, newStory } from '@/story/runner'
import type { Story } from '@/story/types'
import { BattleScreen } from '@/ui/BattleScreen'
import { ChapterEnd, Credits, NameScreen, TitleScreen } from '@/ui/MenuScreens'
import { SceneScreen } from '@/ui/SceneScreen'

type Screen = { kind: 'title' } | { kind: 'name' } | { kind: 'credits' } | { kind: 'play'; player: Player; story: Story }

const CHAPTER_TITLES: Record<number, string> = { 1: 'A Torre Inicial' }

/** O save só vale se ainda cabe no roteiro atual (rótulo e posição existem). Se não, é descartado. */
function loadPlayableSave() {
  const s = loadGame()
  if (!s) return null
  try {
    current(CHAPTER_1, s.story)
    return s
  } catch {
    clearSave()
    return null
  }
}

export function App() {
  const [screen, setScreen] = useState<Screen>({ kind: 'title' })
  const [hasSave, setHasSave] = useState(() => loadPlayableSave() !== null)

  const play = (player: Player, story: Story) => {
    saveGame({ player, story })
    setScreen({ kind: 'play', player, story })
  }

  let content
  if (screen.kind === 'title') {
    content = (
      <TitleScreen
        hasSave={hasSave}
        onContinue={() => {
          const s = loadPlayableSave()
          if (s) setScreen({ kind: 'play', player: s.player, story: s.story })
          else setHasSave(false)
        }}
        onNew={() => {
          clearSave()
          setHasSave(false)
          setScreen({ kind: 'name' })
        }}
        onCredits={() => setScreen({ kind: 'credits' })}
      />
    )
  } else if (screen.kind === 'name') {
    content = <NameScreen onSubmit={(raw) => play(newPlayer(cleanName(raw)), newStory(1))} onBack={() => setScreen({ kind: 'title' })} />
  } else if (screen.kind === 'credits') {
    content = <Credits onBack={() => setScreen({ kind: 'title' })} />
  } else {
    const { player, story } = screen
    const step = current(CHAPTER_1, story)
    if (step.kind === 'battle') {
      const finish = (o: Outcome, p: Player) =>
        // Na derrota, o ERRO-7 "reinicia": volta como estava antes da luta, com a vida cheia.
        play(o === 'defeat' ? { ...player, hp: player.maxHp, mp: player.maxMp } : p, advance(CHAPTER_1, story, { battle: o }))
      content = <BattleScreen key={`${story.cursor.label}:${story.killed + story.pacified}`} player={player} enemy={step.enemy} onFinish={finish} />
    } else if (step.kind === 'end') {
      content = (
        <ChapterEnd
          chapter={step.chapter}
          title={CHAPTER_TITLES[step.chapter]}
          player={player}
          story={story}
          onTitle={() => {
            setHasSave(loadPlayableSave() !== null)
            setScreen({ kind: 'title' })
          }}
        />
      )
    } else {
      content = (
        <SceneScreen
          step={step}
          player={player}
          onNext={() => play(player, advance(CHAPTER_1, story))}
          onChoose={(i) => play(player, advance(CHAPTER_1, story, { option: i }))}
        />
      )
    }
  }

  return (
    <main className="scanlines min-h-full">
      <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col justify-center px-3 py-3 sm:px-6 sm:py-8">
        {screen.kind === 'play' && (
          <p className="mb-2 text-[10px] tracking-[0.3em] text-amber-dim sm:mb-3 sm:text-xs">
            RUINS OF AETHER · CAPÍTULO {screen.story.chapter} · {CHAPTER_TITLES[screen.story.chapter]?.toUpperCase()}
          </p>
        )}
        {content}
      </div>
    </main>
  )
}
