import { useEffect, useState } from 'react'
import { enemyHits, MAGIC_COST, playerAction, startBattle, type Action, type Battle, type Outcome } from '@/game/battle'
import type { EnemyDef } from '@/game/enemies'
import type { Player } from '@/game/player'
import { DodgeBox } from './DodgeBox'
import { Hud } from './Hud'
import { Btn, Frame, NextButton } from './kit'
import { useTapGuard } from './useTapGuard'

type Phase = 'intro' | 'menu' | 'result' | 'dodge' | 'hit'

/** Uma luta: menu de ações ↔ caixa de desvio, até vencer, pacificar ou cair. */
export function BattleScreen({ player: initial, enemy, onFinish }: { player: Player; enemy: EnemyDef; onFinish: (o: Outcome, p: Player) => void }) {
  const [player, setPlayer] = useState(initial)
  const [battle, setBattle] = useState<Battle>(() => startBattle(enemy))
  const [phase, setPhase] = useState<Phase>('intro')
  const [log, setLog] = useState<string[]>(enemy.preBattle.map((l) => `“${l}”`))
  const [warning, setWarning] = useState<string | null>(null)
  const ready = useTapGuard(phase)

  const act = (a: Action) => {
    const r = playerAction(player, battle, a, Math.random)
    if (!r.usedTurn) {
      setWarning(r.log[0] ?? null)
      return
    }
    setWarning(null)
    setPlayer(r.player)
    setBattle(r.battle)
    setLog(r.log)
    setPhase('result')
  }

  const afterResult = () => (battle.outcome ? onFinish(battle.outcome, player) : setPhase('dodge'))

  const afterDodge = (hits: number) => {
    const r = enemyHits(player, battle, hits)
    setPlayer(r.player)
    setBattle(r.battle)
    setLog(hits === 0 ? ['Você desviou de tudo.'] : [`${enemy.name} acerta você ${hits === 1 ? 'uma vez' : `${hits} vezes`}. −${r.dealt} HP.`])
    setPhase('hit')
  }

  const afterHit = () => {
    if (battle.outcome === 'defeat') onFinish('defeat', player)
    else setPhase('menu')
  }

  const next = () => {
    if (phase === 'intro') setPhase('menu')
    else if (phase === 'result') afterResult()
    else if (phase === 'hit') afterHit()
  }

  // Teclado: Enter/espaço continua; 1, 2, 3 escolhem a ação.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.altKey || e.ctrlKey || e.metaKey || phase === 'dodge') return
      if ((e.target as HTMLElement)?.closest?.('button, input, a')) return
      if (phase === 'menu') {
        const action = ({ '1': 'attack', '2': 'magic', '3': 'pacify' } as const)[e.key as '1' | '2' | '3']
        if (action) {
          e.preventDefault()
          act(action)
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        next()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const pattern = enemy.patterns[(battle.turn - 1 + enemy.patterns.length) % enemy.patterns.length]
  const taunt = enemy.taunts[battle.turn % enemy.taunts.length]
  const mercy = '♡'.repeat(battle.mercy) + '·'.repeat(Math.max(0, enemy.mercyThreshold - battle.mercy))

  return (
    <Frame className="flex flex-col gap-3 sm:gap-5" aria-label={`Luta contra ${enemy.name}`}>
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-3xl text-amber-glow sm:text-4xl">{enemy.name.toUpperCase()}</h2>
        <span className="text-xs text-amber-dim">{enemy.humanCorrupted ? 'humano corrompido — mente apagada' : ''}</span>
      </header>
      <div className="grid gap-2 text-sm sm:grid-cols-2">
        <div className="flex items-center gap-2" aria-label="Vida do inimigo">
          <span className="text-amber-dim">HP</span>
          <div className="h-2 flex-1 bg-line/60">
            <div className="h-full bg-danger transition-[width] duration-300" style={{ width: `${(battle.enemyHp / enemy.maxHp) * 100}%` }} />
          </div>
          <span className="tabular-nums">
            {battle.enemyHp}/{enemy.maxHp}
          </span>
        </div>
        {enemy.canPacify && (
          <div className="text-soul-fg sm:text-right" aria-label="Pacificar">
            PACIFICAR <span className="tracking-[0.3em]">{mercy}</span>
          </div>
        )}
      </div>

      <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 sm:min-h-[300px] sm:gap-4">
        {phase === 'dodge' ? (
          <DodgeBox key={battle.turn} pattern={pattern} onDone={afterDodge} />
        ) : (
          <>
            <pre aria-hidden="true" className="text-[9px] leading-[9px] text-amber-dim opacity-80 sm:text-[10px] sm:leading-[10px]">
              {enemy.portrait}
            </pre>
            <div className="flex w-full flex-col gap-2" aria-live="polite">
              {phase === 'menu' && battle.turn > 0 && <p className="text-amber-hi">“{taunt}”</p>}
              {phase !== 'menu' && log.map((l, i) => <p key={i} className={i === 0 ? 'text-amber-hi' : 'text-amber'}>{l}</p>)}
            </div>
          </>
        )}
      </div>

      <Hud player={player} />

      {phase === 'menu' ? (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2.5">
            <Btn tone="danger" className="!px-2 text-center text-sm sm:text-base" onClick={() => ready() && act('attack')}>
              Atacar
            </Btn>
            <Btn tone="glow" className="!px-2 text-center text-sm sm:text-base" onClick={() => ready() && act('magic')} disabled={player.mp < MAGIC_COST}>
              Magia
            </Btn>
            <Btn tone="soul" className="!px-2 text-center text-sm sm:text-base" onClick={() => ready() && act('pacify')}>
              Pacificar
            </Btn>
          </div>
          <p className="text-xs text-amber-dim">[1] Atacar −8 Humanidade · [2] Magia {MAGIC_COST} MP, −4 · [3] Pacificar +8</p>
          {warning && <p className="text-sm text-danger">{warning}</p>}
        </div>
      ) : phase === 'dodge' ? null : (
        <div className="flex justify-end">
          <NextButton onClick={next} />
        </div>
      )}
    </Frame>
  )
}
