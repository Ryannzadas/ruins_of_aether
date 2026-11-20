import { Component, type ReactNode } from 'react'
import { clearSave } from '@/game/save'

/** Se algo quebrar ao desenhar, mostra uma saída em vez de uma tela preta. O save é descartado: ele pode ser a causa. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    clearSave()
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <main className="scanlines flex min-h-full flex-col items-center justify-center gap-6 p-6 text-center">
        <p className="font-display glow text-4xl text-amber-glow">ERRO DE SISTEMA</p>
        <p className="max-w-sm text-amber">A Torre corrompeu este registro. O progresso salvo foi descartado.</p>
        <button type="button" onClick={() => window.location.reload()} className="min-h-11 cursor-pointer border border-amber px-5 text-amber-glow hover:bg-amber/10">
          Recomeçar
        </button>
      </main>
    )
  }
}
