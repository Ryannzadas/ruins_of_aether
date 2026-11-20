import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from './ErrorBoundary'

function Boom(): never {
  throw new Error('quebrou')
}

test('a crash shows a way back instead of a blank page', () => {
  const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
  localStorage.setItem('ruins-of-aether:save', '{"version":1}')
  render(
    <ErrorBoundary>
      <Boom />
    </ErrorBoundary>,
  )
  expect(screen.getByRole('button', { name: /Recomeçar/ })).toBeInTheDocument()
  expect(localStorage.getItem('ruins-of-aether:save')).toBeNull()
  spy.mockRestore()
})
