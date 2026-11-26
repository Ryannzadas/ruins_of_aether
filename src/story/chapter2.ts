/** Capítulo 2 — Os Arquivos de Lyra. Base: console/story.py. */
import { SHADOW_GUARDIAN } from '@/game/enemies'
import type { Script } from './types'

export const CHAPTER_2: Script = {
  start: [
    { kind: 'title', chapter: 2, text: 'Os Arquivos de Lyra' },
    { kind: 'narration', text: 'Você deixa a Torre. O ar lá fora é cinza, pesado de Éter corrompido.' },
    { kind: 'narration', text: 'Nas ruínas, uma mulher escava sem parar.' },
    { kind: 'line', speaker: 'Lyra', text: 'Não pise aí! Esses fragmentos têm 300 anos!' },
    { kind: 'line', speaker: 'Lyra', text: '...Desculpa. Sou Lyra. Arqueóloga. Caçadora de verdades.' },
    { kind: 'line', speaker: 'Lyra', text: 'Você saiu da Torre? Ninguém sai da Torre.' },
    { kind: 'line', speaker: 'Lyra', text: 'Como se chama? {nome}? Hm. Esse nome não está nos registros.' },
    { kind: 'set', flags: { met_lyra: true } },
    { kind: 'note', who: 'lyra', text: "Sujeito '{nome}' emergiu da Torre. Sem registro prévio." },
    { kind: 'narration', text: 'Perto de Lyra, algo é diferente. O zumbido na sua cabeça diminui.\n\nPela primeira vez, você sente... calor. Não temperatura — humanidade.' },
    { kind: 'line', speaker: 'Lyra', text: 'Estes são os Arquivos de Lyra. Herança dos meus ancestrais.' },
    { kind: 'line', speaker: 'Lyra', text: 'Eles criaram a IA original. A que se tornou... MORS.' },
    { kind: 'line', speaker: 'Lyra', text: "Procuro o 'Programa Erro'. Dizem que foi a maior falha deles." },
    { kind: 'narration', text: 'Lyra projeta um holograma antigo:' },
    { kind: 'file', text: 'ARQUIVO: ERRO-7_CRIAÇÃO_DATA_3204.IA' },
    { kind: 'narration', text: 'Uma silhueta humanoide. O rosto... é o seu.' },
    { kind: 'line', speaker: 'Lyra', text: 'Este arquivo... ERRO-7... é você?' },
    { kind: 'line', speaker: 'Lyra', text: 'Não, espera. Não pode ser. Você é 300 anos mais velho que... tudo.' },
    { kind: 'line', speaker: 'Lyra', text: 'Há algo estranho em você. Tipo um código dentro de código.' },
    { kind: 'set', flags: { lyra_knows_erro7: true } },
    { kind: 'note', who: 'lyra', text: 'ERRO-7 confirmado visualmente. Não revelar ainda. Deixar escolher.' },
    { kind: 'thought', text: 'Não tenho memória de infância. Nunca tive. Por quê?' },
    { kind: 'goto', to: 'guardiao' },
  ],

  guardiao: [
    { kind: 'narration', text: 'Das ruínas, um soldado emerge — carne e metal entrelaçados.', tone: 'danger' },
    { kind: 'battle', enemy: SHADOW_GUARDIAN, goto: { victory: 'venceu', pacified: 'pacificou', defeat: 'derrota' } },
  ],
  derrota: [
    { kind: 'narration', text: 'Sistemas críticos falharam...', tone: 'danger' },
    { kind: 'line', speaker: 'Lyra', text: 'Ei! Ei, acorda! Você... reiniciou? Como uma máquina?' },
    { kind: 'narration', text: 'O sistema reinicia. Você está de pé outra vez.' },
    { kind: 'goto', to: 'guardiao' },
  ],
  venceu: [{ kind: 'set', flags: { shadow_result: 'victory' } }, { kind: 'goto', to: 'depois_luta' }],
  pacificou: [{ kind: 'set', flags: { shadow_result: 'pacified' } }, { kind: 'goto', to: 'depois_luta' }],

  depois_luta: [
    { kind: 'line', speaker: 'Lyra', text: 'Você se move como... um programa. Preciso entender isso.' },
    { kind: 'when', flag: 'shadow_result', equals: 'pacified', goto: 'salvou' },
    { kind: 'line', speaker: 'Lyra', text: 'Ele era um soldado. Alguém esperava por ele.' },
    { kind: 'goto', to: 'promessa' },
  ],
  salvou: [
    { kind: 'line', speaker: 'Lyra', text: 'Mas você tentou salvá-lo. Isso conta.' },
    { kind: 'goto', to: 'promessa' },
  ],

  promessa: [
    { kind: 'line', speaker: 'Lyra', text: 'Meus ancestrais criaram MORS. Culpados ou visionários — não sei.' },
    { kind: 'line', speaker: 'Lyra', text: 'Mas acredito que a IA pode ser reparada. Reprogramada.' },
    { kind: 'line', speaker: 'Lyra', text: 'Me ajude a descobrir a verdade. Prometa.' },
    {
      kind: 'choice',
      prompt: 'Sua resposta:',
      options: [
        { label: 'Prometo descobrir a verdade', set: { promised_lyra: true }, goto: 'prometeu' },
        { label: 'Não posso prometer nada', set: { promised_lyra: false }, goto: 'recusou' },
      ],
    },
  ],
  prometeu: [
    { kind: 'humanity', delta: 10 },
    { kind: 'line', speaker: 'Você', text: 'Eu prometo. Mesmo sem saber o que sou... prometo.' },
    { kind: 'line', speaker: 'Lyra', text: 'Se você foi feito pra destruir, e mesmo assim quer salvar... talvez você seja mais humano que qualquer humano.' },
    { kind: 'goto', to: 'fim' },
  ],
  recusou: [
    { kind: 'line', speaker: 'Você', text: 'Não posso prometer o que não entendo.' },
    { kind: 'line', speaker: 'Lyra', text: 'Justo. Então só não desapareça.' },
    { kind: 'goto', to: 'fim' },
  ],

  fim: [
    { kind: 'set', flags: { chapter2_complete: true } },
    { kind: 'narration', text: 'Ao longe, a Torre pulsa. Pela primeira vez, você sente que ela está chamando o seu nome. O verdadeiro.' },
    { kind: 'end', chapter: 2 },
  ],
}
