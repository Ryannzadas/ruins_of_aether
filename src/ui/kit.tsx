import type { ButtonHTMLAttributes, ReactNode } from 'react'

/** Moldura de terminal: borda âmbar escura e linhas de varredura. */
export function Frame({ children, className = '', ...rest }: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={`border border-line bg-void/80 p-4 sm:p-7 ${className}`} {...rest}>
      {children}
    </section>
  )
}

type Tone = 'plain' | 'soul' | 'danger' | 'glow'
const tones: Record<Tone, string> = {
  plain: 'border border-line text-amber hover:border-amber hover:text-amber-hi',
  soul: 'bg-soul-bg text-soul-fg shadow-[0_0_18px_rgb(80_255_130_/_0.35)] hover:brightness-125',
  danger: 'border border-danger text-danger hover:bg-danger/10',
  glow: 'border border-amber text-amber-glow hover:bg-amber/10',
}

export function Btn({ tone = 'plain', className = '', ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: Tone }) {
  return (
    <button
      type="button"
      className={`min-h-11 px-4 py-2.5 font-mono text-base transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${tones[tone]} ${className}`}
      {...rest}
    />
  )
}

/** Botão discreto de "continuar" usado em cenas e lutas. */
export function NextButton({ onClick, label = 'Continuar' }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className="self-end min-h-11 px-3 text-sm tracking-[0.2em] text-amber-dim hover:text-amber-hi cursor-pointer animate-pulse">
      {label.toUpperCase()} ▸
    </button>
  )
}
