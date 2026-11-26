import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '@/App'
import { saveGame } from '@/game/save'
import { newPlayer } from '@/game/player'
import { newStory } from '@/story/runner'
import { BattleScreen } from './BattleScreen'
import { TOWER_SPECTER } from '@/game/enemies'
import { SceneScreen } from './SceneScreen'

/** Espera passar a trava contra toque duplo. */
const armed = () => new Promise((r) => setTimeout(r, 450))

vi.mock('./DodgeBox', () => ({
  DodgeBox: ({ onDone }: { onDone: (hits: number) => void }) => (
    <button type="button" onClick={() => onDone(0)}>
      fim do ataque
    </button>
  ),
}))

test('title without a save offers new game and credits only', () => {
  render(<App />)
  expect(screen.getByRole('button', { name: 'Novo jogo' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Créditos' })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Continuar' })).not.toBeInTheDocument()
})

test('title with a save offers to continue it', async () => {
  saveGame({ player: newPlayer('Ana'), story: newStory(1) })
  render(<App />)
  await userEvent.click(screen.getByRole('button', { name: 'Continuar' }))
  expect(await screen.findByText(/A Torre Inicial/)).toBeInTheDocument()
})

test('an empty name starts the game as Viajante', async () => {
  const user = userEvent.setup()
  render(<App />)
  await user.click(screen.getByRole('button', { name: 'Novo jogo' }))
  await user.type(screen.getByLabelText(/seu nome/i), '   ')
  await user.click(screen.getByRole('button', { name: 'Começar' }))
  expect(await screen.findByText(/A Torre Inicial/)).toBeInTheDocument()
  expect(JSON.parse(localStorage.getItem('ruins-of-aether:save')!).player.name).toBe('Viajante')
})

async function startNewGame() {
  const user = userEvent.setup()
  render(<App />)
  await user.click(screen.getByRole('button', { name: 'Novo jogo' }))
  await user.type(screen.getByLabelText(/seu nome/i), 'Ana')
  await user.click(screen.getByRole('button', { name: 'Começar' }))
  return user
}

test('Enter advances narration but never picks a choice', async () => {
  const user = await startNewGame()
  for (let i = 0; i < 5; i++) await user.keyboard('{Enter}')
  expect(screen.getByRole('button', { name: /Tentar me lembrar/ })).toBeInTheDocument()
  await user.keyboard('{Enter}')
  await user.keyboard('{Enter}')
  expect(screen.getByRole('button', { name: /Tentar me lembrar/ })).toBeInTheDocument()
  await user.keyboard('2')
  expect(screen.queryByRole('button', { name: /Tentar me lembrar/ })).not.toBeInTheDocument()
})

test('clicking an option advances the scene', async () => {
  const user = await startNewGame()
  for (let i = 0; i < 5; i++) await user.click(screen.getByRole('button', { name: /continuar/i }))
  await armed()
  await user.click(screen.getByRole('button', { name: /Me levantar e explorar/ }))
  expect(screen.getByText(/As pernas tremem/)).toBeInTheDocument()
})

test('sparing the specter three times ends the fight as pacified', async () => {
  const user = userEvent.setup()
  const onFinish = vi.fn()
  render(<BattleScreen player={newPlayer('Ana')} enemy={TOWER_SPECTER} onFinish={onFinish} />)
  await user.click(screen.getByRole('button', { name: /continuar/i }))
  for (let i = 0; i < 3; i++) {
    await armed()
    await user.click(screen.getByRole('button', { name: 'Pacificar' }))
    if (i < 2) {
      await user.click(screen.getByRole('button', { name: /continuar/i }))
      await user.click(screen.getByRole('button', { name: 'fim do ataque' }))
      await user.click(screen.getByRole('button', { name: /continuar/i }))
    }
  }
  expect(screen.getByLabelText('Humanidade')).toHaveTextContent('74')
  await user.click(screen.getByRole('button', { name: /continuar/i }))
  expect(onFinish).toHaveBeenCalledWith('pacified', expect.objectContaining({ humanity: 74 }))
})

test('the fight can be played with the keyboard', async () => {
  const user = userEvent.setup()
  render(<BattleScreen player={newPlayer('Ana')} enemy={TOWER_SPECTER} onFinish={vi.fn()} />)
  await user.keyboard('{Enter}')
  await user.keyboard('3')
  expect(screen.getByLabelText('Humanidade')).toHaveTextContent('58')
  await user.keyboard('{Enter}')
  expect(screen.getByRole('button', { name: 'fim do ataque' })).toBeInTheDocument()
})

test('credits carry the Hydra Labs badge', async () => {
  render(<App />)
  await userEvent.click(screen.getByRole('button', { name: 'Créditos' }))
  const img = screen.getByAltText('Desenvolvido por Hydra Labs')
  expect(img.closest('a')).toHaveAttribute('href', 'https://hydra-labs-studio.vercel.app')
})

test('chapter 1 end chains directly into chapter 2', async () => {
  const story = { ...newStory(1), cursor: { label: 'conclusao', index: 12 } }
  saveGame({ player: newPlayer('Ana'), story })
  render(<App />)
  await userEvent.click(screen.getByRole('button', { name: 'Continuar' }))
  const end = await screen.findByRole('region', { name: /Capítulo 1 concluído/ })
  const nextBtn = within(end).getByRole('button', { name: /Continuar para o Capítulo 2/ })
  await userEvent.click(nextBtn)
  expect(await screen.findByRole('heading', { name: 'Os Arquivos de Lyra' })).toBeInTheDocument()
  expect(JSON.parse(localStorage.getItem('ruins-of-aether:save')!).story.chapter).toBe(2)
})

test('chapter 5 end shows the reached ending and final statistics', async () => {
  const story = {
    ...newStory(5),
    cursor: { label: 'fim_destruicao', index: 9 },
    flags: { ending: 'destruction', knows_true_function: true, game_complete: true },
    pacified: 4,
    killed: 1,
  }
  saveGame({ player: { ...newPlayer('Ana'), humanity: 78, level: 4 }, story })
  render(<App />)
  await userEvent.click(screen.getByRole('button', { name: 'Continuar' }))
  const end = await screen.findByRole('region', { name: /Final: Destruição/ })
  expect(within(end).getByRole('heading', { name: 'Final: Destruição' })).toBeInTheDocument()
  expect(within(end).getByText(/78%/)).toBeInTheDocument()
  expect(within(end).getByText(/Inimigos pacificados:/)).toHaveTextContent('4')
  expect(within(end).getByText(/Derrotados:/)).toHaveTextContent('1')
  expect(within(end).getByText(/Verdade descoberta:/)).toHaveTextContent('Sim')
  expect(within(end).getByText(/Jogue novamente\. As pistas estão em todo lugar\./)).toBeInTheDocument()
  expect(within(end).getByRole('button', { name: 'Créditos' })).toBeInTheDocument()
  expect(within(end).getByRole('button', { name: /Voltar ao título/ })).toBeInTheDocument()
})

test('reloading a save in chapter 3 after a humanity step does not re-apply the shift', async () => {
  const user = userEvent.setup()
  // index 7 in chapter 3 start is right before { kind: 'humanity', delta: 10 } (index 8)
  const story = { ...newStory(3), cursor: { label: 'start', index: 7 } }
  saveGame({ player: newPlayer('Ana'), story })
  const { unmount } = render(<App />)
  await user.click(screen.getByRole('button', { name: 'Continuar' }))
  // Advance once past index 7 ("Você chora..."), settling through humanity +10 onto index 10 ("Luz e código...")
  await user.keyboard('{Enter}')
  await user.keyboard('{Enter}')
  const savedOnce = JSON.parse(localStorage.getItem('ruins-of-aether:save')!)
  expect(savedOnce.player.humanity).toBe(60)
  expect(savedOnce.story.humanityShift).toBe(0)
  unmount()

  render(<App />)
  await user.click(screen.getByRole('button', { name: 'Continuar' }))
  const savedAfterReload = JSON.parse(localStorage.getItem('ruins-of-aether:save')!)
  expect(savedAfterReload.player.humanity).toBe(60)
})

test('a double tap on Continuar does not pick the choice that appears under it', async () => {
  const onChoose = vi.fn()
  const step = { kind: 'choice' as const, prompt: 'E agora?', options: [{ label: 'A', goto: 'a' }, { label: 'B', goto: 'b' }] }
  render(<SceneScreen step={step} player={newPlayer('Ana')} onNext={vi.fn()} onChoose={onChoose} />)
  fireEvent.click(screen.getByRole('button', { name: /B/ }))
  expect(onChoose).not.toHaveBeenCalled()
  await armed()
  fireEvent.click(screen.getByRole('button', { name: /B/ }))
  expect(onChoose).toHaveBeenCalledWith(1)
})

test('a double tap on Continuar in a fight does not trigger an action', async () => {
  render(<BattleScreen player={newPlayer('Ana')} enemy={TOWER_SPECTER} onFinish={vi.fn()} />)
  fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
  fireEvent.click(screen.getByRole('button', { name: 'Pacificar' }))
  expect(screen.getByLabelText('Humanidade')).toHaveTextContent('50')
  await armed()
  fireEvent.click(screen.getByRole('button', { name: 'Pacificar' }))
  expect(screen.getByLabelText('Humanidade')).toHaveTextContent('58')
})

test('a save that no longer fits the story is dropped instead of crashing', async () => {
  saveGame({ player: newPlayer('Ana'), story: { ...newStory(1), cursor: { label: 'capitulo-que-sumiu', index: 3 } } })
  render(<App />)
  expect(screen.queryByRole('button', { name: 'Continuar' })).not.toBeInTheDocument()
  expect(localStorage.getItem('ruins-of-aether:save')).toBeNull()
})
