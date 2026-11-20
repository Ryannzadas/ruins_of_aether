import { useEffect, useRef } from 'react'
import type { Player } from '@/game/player'
import { fillName } from '@/story/runner'
import type { VisibleStep } from '@/story/types'
import { Btn, Frame, NextButton } from './kit'
import { KAEL_PORTRAIT } from './portraits'
import { useTapGuard } from './useTapGuard'
import { useTypewriter } from './useTypewriter'

type SceneStep = Exclude<VisibleStep, { kind: 'battle' | 'end' }>

const speakerColor: Record<string, string> = {
  Kael: 'text-amber-hi',
  Você: 'text-soul-fg',
  Lyra: 'text-amber-glow',
  Mors: 'text-danger',
  Sistema: 'text-amber-glow',
}

function textOf(step: SceneStep): string {
  switch (step.kind) {
    case 'title':
      return step.text
    case 'choice':
      return step.prompt
    default:
      return step.text
  }
}

/** Uma cena: narração, fala, arquivo, pensamento ou escolha. */
export function SceneScreen({ step, player, onNext, onChoose }: { step: SceneStep; player: Player; onNext: () => void; onChoose: (i: number) => void }) {
  const text = fillName(textOf(step), player.name)
  const { shown, done, finish } = useTypewriter(text)
  const choiceRef = useRef<HTMLDivElement>(null)
  const ready = useTapGuard(step)

  const proceed = () => (done ? onNext() : finish())

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.altKey || e.ctrlKey || e.metaKey) return
      if (step.kind === 'choice') {
        const n = Number(e.key)
        if (Number.isInteger(n) && n >= 1 && n <= step.options.length) {
          e.preventDefault()
          onChoose(n - 1)
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault()
          const buttons = [...(choiceRef.current?.querySelectorAll('button') ?? [])]
          const i = buttons.indexOf(document.activeElement as HTMLButtonElement)
          const nextI = e.key === 'ArrowDown' ? (i + 1) % buttons.length : (i - 1 + buttons.length) % buttons.length
          buttons[i < 0 ? 0 : nextI]?.focus()
        }
        return
      }
      // Enter/espaço num botão já focado: o próprio botão cuida.
      if ((e.target as HTMLElement)?.closest?.('button, input, a')) return
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        proceed()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (step.kind === 'title') {
    return (
      <Frame className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center" onClick={proceed}>
        <p className="text-sm tracking-[0.4em] text-amber-dim">CAPÍTULO {step.chapter}</p>
        <h2 className="font-display glow text-5xl text-amber-glow sm:text-7xl">{step.text}</h2>
        <NextButton onClick={onNext} />
      </Frame>
    )
  }

  const showPortrait = step.kind === 'line' && step.speaker === 'Kael'
  let body
  if (step.kind === 'line') {
    body = (
      <div className="flex flex-col gap-2">
        <p className="text-xs tracking-[0.3em] text-amber-dim">{step.speaker.toUpperCase()}</p>
        <p className={`text-lg leading-relaxed sm:text-xl ${speakerColor[step.speaker]}`}>“{shown}”</p>
      </div>
    )
  } else if (step.kind === 'glitch') {
    body = (
      <p className="text-base leading-relaxed text-danger">
        <span className="text-amber-dim">[Você, sem perceber]: </span>“{shown}”
      </p>
    )
  } else if (step.kind === 'thought') {
    body = <p className={`text-lg italic leading-relaxed ${player.humanity >= 50 ? 'text-soul-fg' : 'text-danger'}`}>« {shown} »</p>
  } else if (step.kind === 'file') {
    body = (
      <pre className="overflow-x-auto whitespace-pre text-[11px] leading-snug text-amber-glow glow sm:text-sm" aria-label="Arquivo">
        {shown}
      </pre>
    )
  } else if (step.kind === 'narration') {
    body = <p className={`whitespace-pre-line text-lg leading-relaxed ${step.tone === 'danger' ? 'text-danger' : 'text-amber'}`}>{shown}</p>
  } else {
    body = <p className="text-sm tracking-[0.2em] text-amber-dim">&gt; {shown.toUpperCase()}</p>
  }

  return (
    <Frame className="flex min-h-[60vh] flex-col gap-6" onClick={step.kind === 'choice' ? undefined : proceed}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        {showPortrait && (
          <pre aria-hidden="true" className="shrink-0 text-[8px] leading-[8px] text-[#e39a3a] [text-shadow:0_0_6px_rgb(255_160_50_/_0.6)] sm:text-[9px] sm:leading-[9px]">
            {KAEL_PORTRAIT}
          </pre>
        )}
        <div className="min-w-0 flex-1">{body}</div>
      </div>
      {step.kind === 'choice' ? (
        <div ref={choiceRef} className="mt-auto flex flex-col gap-2.5" role="group" aria-label={step.prompt}>
          {step.options.map((o, i) => (
            <Btn
              key={o.label}
              className="text-left hover:!border-soul-bg hover:!bg-soul-bg hover:!text-soul-fg focus-visible:!bg-soul-bg focus-visible:!text-soul-fg"
              onClick={() => ready() && onChoose(i)}
            >
              [{i + 1}] {o.label}
            </Btn>
          ))}
        </div>
      ) : (
        <div className="mt-auto flex justify-end">
          <NextButton onClick={proceed} />
        </div>
      )}
    </Frame>
  )
}
