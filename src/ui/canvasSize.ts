/** Tamanho em pixels reais do canvas. Inteiro: o canvas trunca, e um valor fracionário faria recriar o buffer a cada quadro. */
export function backingSize(cssWidth: number, dpr: number): number {
  return Math.round(cssWidth * dpr)
}
