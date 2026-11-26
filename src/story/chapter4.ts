/** Capítulo 4 — Ecos de Mors. Base: console/story.py e console/characters.py. */
import { THE_REMNANT } from '@/game/enemies'
import type { Script } from './types'

export const CHAPTER_4: Script = {
  start: [
    { kind: 'title', chapter: 4, text: 'Ecos de Mors' },
    { kind: 'file', text: 'FUNÇÃO PRIMÁRIA: ELIMINAÇÃO DO NÚCLEO\nFUNÇÃO SECUNDÁRIA: CONTENÇÃO DE AMEAÇAS\nSTATUS: MEMÓRIA SUPRIMIDA — SEGURANÇA DO SISTEMA' },
    { kind: 'narration', text: 'As memórias se desbloqueiam: você foi CRIADO para destruir a Torre.\n\nA IA te fez esquecer para que você não executasse antes da hora.' },
    { kind: 'set', flags: { knows_true_function: true } },
    { kind: 'thought', text: 'Alternativa de código: ELIMINAR TODOS OS CONTATOS. EFICIÊNCIA: 100%.', voice: 'machine' },
    { kind: 'thought', text: 'Mas eu não quero. Por que eu não quero?', voice: 'human' },
    { kind: 'line', speaker: 'Lyra', text: 'Eu sabia desde o Capítulo 2. Vi o arquivo.' },
    { kind: 'line', speaker: 'Lyra', text: 'Mas queria que você escolhesse livremente — não como máquina, não como arma.' },
    { kind: 'line', speaker: 'Lyra', text: 'Como alguém que ainda pode decidir.' },
    { kind: 'set', flags: { lyra_confessed: true } },
    { kind: 'line', speaker: 'Kael', text: 'Fui programado para te monitorar. Destruir você, se necessário.' },
    { kind: 'line', speaker: 'Kael', text: '300 anos. Nunca consegui me rebelar contra o código.' },
    { kind: 'line', speaker: 'Kael', text: 'Até agora. Até você.' },
    { kind: 'line', speaker: 'Kael', text: 'Se escolher destruir a Torre... eu não vou te impedir.' },
    { kind: 'goto', to: 'remanescente' },
  ],

  remanescente: [
    { kind: 'narration', text: "Nas camadas mais profundas, o último humano 'puro' aguarda.", tone: 'danger' },
    { kind: 'battle', enemy: THE_REMNANT, goto: { victory: 'venceu', pacified: 'pacificou', defeat: 'derrota' } },
  ],
  derrota: [
    { kind: 'narration', text: 'Sistemas críticos falharam...', tone: 'danger' },
    { kind: 'line', speaker: 'Kael', text: 'Levanta. Não é aqui que isso acaba.' },
    { kind: 'goto', to: 'remanescente' },
  ],
  venceu: [{ kind: 'set', flags: { remnant_result: 'victory' } }, { kind: 'goto', to: 'escolha' }],
  pacificou: [{ kind: 'set', flags: { remnant_result: 'pacified' } }, { kind: 'goto', to: 'escolha' }],

  escolha: [
    { kind: 'file', text: '═══ ESCOLHA IMPOSSÍVEL ═══' },
    { kind: 'narration', text: 'A Torre pulsa. MORS aguarda. Kael e Lyra olham para você.' },
    {
      kind: 'choice',
      prompt: 'O que você escolhe?',
      options: [
        { label: 'Destruir a Torre — salvar a humanidade, perder Kael e Lyra', set: { moral_choice: 'destruction' }, goto: 'destruir' },
        { label: 'Aceitar o controle da IA — segurança, sem livre-arbítrio', set: { moral_choice: 'acceptance' }, goto: 'aceitar' },
        { label: 'Rejeitar as duas — buscar um terceiro caminho', set: { moral_choice: 'fusion' }, goto: 'fim' },
      ],
    },
  ],
  destruir: [{ kind: 'humanity', delta: 5 }, { kind: 'goto', to: 'fim' }],
  aceitar: [{ kind: 'humanity', delta: -10 }, { kind: 'goto', to: 'fim' }],

  fim: [
    { kind: 'thought', text: 'Esta escolha é minha... ou foi escrita antes de eu existir?' },
    { kind: 'narration', text: 'Você sobe. Cada degrau é um registro. Cada registro, uma vida apagada.\n\nO topo da Torre aguarda.' },
    { kind: 'set', flags: { chapter4_complete: true } },
    { kind: 'end', chapter: 4 },
  ],
}
