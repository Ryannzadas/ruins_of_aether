import { useId, useState } from 'react'
import type { Player } from '@/game/player'
import { CHAPTER_TITLES, ENDING_TITLES, LAST_CHAPTER } from '@/story'
import { NAME_MAX } from '@/story/runner'
import type { Story } from '@/story/types'
import { Btn, Frame } from './kit'

export function TitleScreen({ hasSave, onContinue, onNew, onCredits }: { hasSave: boolean; onContinue: () => void; onNew: () => void; onCredits: () => void }) {
  const [confirming, setConfirming] = useState(false)
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-10 text-center">
      <div className="flex flex-col gap-3">
        <h1 className="font-display glow text-6xl leading-none tracking-widest text-amber-glow sm:text-8xl">RUINS OF AETHER</h1>
        <p className="text-sm tracking-[0.4em] text-amber-dim">A TALE OF LOST WORLDS</p>
      </div>
      <p className="max-w-md text-amber">Você acorda sem memória no interior de uma torre antiga. A Torre não é um santuário.</p>
      {confirming ? (
        <div className="flex w-full max-w-xs flex-col gap-2.5">
          <p className="text-sm text-danger">Isso apaga o progresso salvo.</p>
          <Btn tone="danger" className="text-center" onClick={onNew}>
            Apagar e começar
          </Btn>
          <Btn className="text-center" onClick={() => setConfirming(false)}>
            Voltar
          </Btn>
        </div>
      ) : (
        <nav className="flex w-full max-w-xs flex-col gap-2.5" aria-label="Menu principal">
          {hasSave && (
            <Btn tone="soul" className="text-center" onClick={onContinue}>
              Continuar
            </Btn>
          )}
          <Btn tone={hasSave ? 'plain' : 'soul'} className="text-center" onClick={() => (hasSave ? setConfirming(true) : onNew())}>
            Novo jogo
          </Btn>
          <Btn className="text-center" onClick={onCredits}>
            Créditos
          </Btn>
        </nav>
      )}
    </div>
  )
}

export function NameScreen({ onSubmit, onBack }: { onSubmit: (raw: string) => void; onBack: () => void }) {
  const id = useId()
  const [name, setName] = useState('')
  return (
    <Frame className="mx-auto flex w-full max-w-lg flex-col gap-6">
      <p className="whitespace-pre-line text-amber">{'Um lugar escuro.\nVocê acorda sem memórias.\nApenas um dever vago queimando na mente.'}</p>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit(name)
        }}
      >
        <label htmlFor={id} className="text-sm tracking-[0.2em] text-amber-dim">
          QUAL É O SEU NOME, VIAJANTE?
        </label>
        <input
          id={id}
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={NAME_MAX}
          autoComplete="off"
          autoFocus
          placeholder="Viajante"
          className="min-h-11 border border-line bg-transparent px-3 text-lg text-amber-hi placeholder:text-amber-dim/60 focus:border-amber focus:outline-none"
        />
        <div className="flex gap-2.5">
          <Btn type="submit" tone="soul" className="flex-1 text-center">
            Começar
          </Btn>
          <Btn onClick={onBack}>Voltar</Btn>
        </div>
      </form>
    </Frame>
  )
}

function chapterFate(chapter: number, story: Story): string {
  switch (chapter) {
    case 1:
      return story.flags.specter_result === 'pacified'
        ? 'Você alcançou o Espectro. Ele se foi em paz.'
        : 'Você destruiu o Espectro. Ele era humano, antes.'
    case 2:
      return story.flags.shadow_result === 'pacified'
        ? 'O Guardião das Sombras baixou a arma e descansou.'
        : 'O Guardião das Sombras tombou nas ruínas.'
    case 3:
      return 'A parede de nomes e a confissão de Kael revelaram a natureza da Torre.'
    case 4:
      return story.flags.remnant_result === 'pacified'
        ? 'O último humano puro encontrou paz antes da subida final.'
        : 'O caminho até o núcleo de MORS está aberto.'
    default:
      return ''
  }
}

export function ChapterEnd({
  chapter,
  title,
  player,
  story,
  onNextChapter,
  onCredits,
  onTitle,
}: {
  chapter: number
  title: string
  player: Player
  story: Story
  onNextChapter?: () => void
  onCredits?: () => void
  onTitle: () => void
}) {
  if (chapter >= LAST_CHAPTER) {
    const endingKey = String(story.flags.ending ?? 'fusion')
    const endingTitle = ENDING_TITLES[endingKey] ?? 'Fusão'
    const knowsTruth = Boolean(story.flags.knows_true_function || story.flags.found_erro7_file)
    return (
      <Frame className="mx-auto flex w-full max-w-xl flex-col gap-6 text-center" aria-label={`Capítulo ${chapter} concluído — Final: ${endingTitle}`}>
        <p className="text-sm tracking-[0.4em] text-amber-dim">HISTÓRIA COMPLETA · FINAL</p>
        <h2 className="font-display glow text-5xl text-amber-glow">Final: {endingTitle}</h2>
        <div className="flex flex-col gap-2 border border-line p-4 text-amber">
          <p>
            Humanidade: <span className={player.humanity >= 50 ? 'text-soul-fg' : 'text-danger'}>{player.humanity}%</span> · Nível {player.level}
          </p>
          <p>
            Inimigos pacificados: <span className="text-soul-fg">{story.pacified}</span> · Derrotados: <span className="text-danger">{story.killed}</span>
          </p>
          <p>
            Verdade descoberta: <span className="text-amber-hi">{knowsTruth ? 'Sim (ERRO-7)' : 'Parcial'}</span>
          </p>
        </div>
        <p className="whitespace-pre-line text-amber-hi">
          {'Jogue novamente. As pistas estão em todo lugar.\nNa primeira vez, você suspeita.\nNa segunda, você vê.\nNa terceira, você entende.'}
        </p>
        <div className="flex flex-col gap-2.5">
          {onCredits && (
            <Btn tone="soul" className="text-center" onClick={onCredits}>
              Créditos
            </Btn>
          )}
          <Btn className="text-center" onClick={onTitle}>
            Voltar ao título
          </Btn>
        </div>
      </Frame>
    )
  }

  const fate = chapterFate(chapter, story)
  const nextChapter = chapter + 1
  const nextTitle = CHAPTER_TITLES[nextChapter]
  const label = `Capítulo ${chapter} concluído — ${title}`
  return (
    <Frame className="mx-auto flex w-full max-w-xl flex-col gap-6 text-center" aria-label={label}>
      <p className="text-sm tracking-[0.4em] text-amber-dim">CAPÍTULO {chapter} CONCLUÍDO</p>
      <h2 className="font-display glow text-5xl text-amber-glow">{title}</h2>
      <p className="text-amber">{fate}</p>
      <p className="text-amber">
        Humanidade: <span className={player.humanity >= 50 ? 'text-soul-fg' : 'text-danger'}>{player.humanity}%</span> · Nível {player.level}
      </p>
      {nextTitle && <p className="border border-line p-4 text-amber-hi">Próximo capítulo: {nextTitle}</p>}
      <div className="flex flex-col gap-2.5">
        {onNextChapter && (
          <Btn tone="soul" className="text-center" onClick={onNextChapter}>
            Continuar para o Capítulo {nextChapter}
          </Btn>
        )}
        <Btn className="text-center" onClick={onTitle}>
          Voltar ao título
        </Btn>
      </div>
    </Frame>
  )
}

export function Credits({ onBack }: { onBack: () => void }) {
  return (
    <Frame className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 text-center">
      <h2 className="font-display glow text-5xl text-amber-glow">CRÉDITOS</h2>
      <div className="flex flex-col gap-2 text-amber">
        <p>Ruins of Aether — A Tale of Lost Worlds</p>
        <p className="text-sm text-amber-dim">Um RPG narrativo de escolhas: lutar ou alcançar o que resta de humano.</p>
        <p className="text-sm text-amber-dim">Fontes: VT323 e IBM Plex Mono (Google Fonts, licença OFL).</p>
      </div>
      <a href="https://hydra-labs-studio.vercel.app" target="_blank" rel="noreferrer" className="opacity-80 transition-opacity hover:opacity-100">
        <img src="/hydra-labs-selo.svg" alt="Desenvolvido por Hydra Labs" width={196} height={28} />
      </a>
      <Btn className="text-center" onClick={onBack}>
        Voltar
      </Btn>
    </Frame>
  )
}
