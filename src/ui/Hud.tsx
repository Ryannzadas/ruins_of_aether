import type { Player } from '@/game/player'

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-2 text-sm" aria-label={label}>
      <span className="w-7 text-amber-dim">{label}</span>
      <div className="h-2.5 flex-1 bg-line/60" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
        <div className="h-full transition-[width] duration-300" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="tabular-nums w-14 text-right">
        {value}/{max}
      </span>
    </div>
  )
}

/** Régua de tracinhos: à esquerda o humano (verde), à direita a máquina (vermelho). */
export function HumanityMeter({ humanity }: { humanity: number }) {
  return (
    <div className="flex flex-col gap-1.5" aria-label="Humanidade">
      <div className="flex justify-between text-xs tracking-[0.2em]">
        <span className="text-soul-fg">HUMANO {humanity}%</span>
        <span className="text-danger">MÁQUINA {100 - humanity}%</span>
      </div>
      <div className="relative h-4" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg, #ff6a3d 0px, #ff6a3d 2px, transparent 2px, transparent 7px)', opacity: 0.35 }}
        />
        <div
          className="absolute inset-y-0 left-0 transition-[width] duration-500"
          style={{ width: `${humanity}%`, backgroundImage: 'repeating-linear-gradient(90deg, #b9ffc9 0px, #b9ffc9 2px, transparent 2px, transparent 7px)' }}
        />
      </div>
    </div>
  )
}

export function Hud({ player }: { player: Player }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between text-xs tracking-[0.2em] text-amber-dim">
        <span>{player.name.toUpperCase()}</span>
        <span>NV {player.level}</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Bar label="HP" value={player.hp} max={player.maxHp} color="#ffb547" />
        <Bar label="MP" value={player.mp} max={player.maxMp} color="#ffcf7a" />
      </div>
      <HumanityMeter humanity={player.humanity} />
    </div>
  )
}
