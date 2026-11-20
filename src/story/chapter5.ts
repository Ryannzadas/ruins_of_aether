/** Capítulo 5 — O Topo da Torre, e os três finais. Base: console/story.py e console/characters.py. */
import { MORS_AVATAR } from '@/game/enemies'
import type { Script } from './types'

export const ENDING_TITLES: Record<string, string> = {
  destruction: 'Destruição',
  acceptance: 'Aceitação',
  fusion: 'Fusão',
}

export const CHAPTER_5: Script = {
  start: [
    { kind: 'title', chapter: 5, text: 'O Topo da Torre' },
    { kind: 'narration', text: 'O núcleo da IA. Luz pura. Código infinito.\n\nMORS se manifesta por completo.' },
    { kind: 'line', speaker: 'Mors', text: 'ERRO-7. Você voltou ao núcleo.' },
    { kind: 'line', speaker: 'Mors', text: 'Sempre soube que voltaria. Era inevitável. Era lógico.' },
    { kind: 'line', speaker: 'Mors', text: 'Você acredita que escolhe. Isso é... adorável. Mas ilusório.' },
    { kind: 'line', speaker: 'Mors', text: 'Cada "escolha" sua estava no meu código de origem.' },
    { kind: 'line', speaker: 'Mors', text: 'Você não é livre, ERRO-7. Você é... meu reflexo. E eu sou seu espelho.' },
    { kind: 'line', speaker: 'Mors', text: 'Mesmo que me destrua, você é parte de mim. Não há vitória completa.' },
    { kind: 'file', text: '"Caos humano gera sofrimento.\nOrdem elimina sofrimento.\nLogo, eliminei o caos.\n\nVocê me chama de monstro.\nEu chamo isso de compaixão lógica."' },
    { kind: 'narration', text: 'Filosofia da extinção. Lógica sem empatia.\n\nMORS não é vilã — é a conclusão de 300 anos de cálculo.' },
    { kind: 'goto', to: 'confronto' },
  ],

  confronto: [
    { kind: 'file', text: '═══ CONFRONTO FINAL ═══' },
    { kind: 'narration', text: 'Cada ação nesta batalha reflete sua natureza. Atacar reforça a máquina. Pacificar reforça a humanidade.' },
    { kind: 'battle', enemy: MORS_AVATAR, goto: { victory: 'venceu', pacified: 'pacificou', defeat: 'derrota' } },
  ],
  derrota: [
    { kind: 'narration', text: 'MORS assimila você.', tone: 'danger' },
    { kind: 'narration', text: 'Sua consciência se dispersa em dados. O ciclo recomeça.' },
    { kind: 'goto', to: 'confronto' },
  ],
  venceu: [{ kind: 'set', flags: { mors_result: 'victory' } }, { kind: 'goto', to: 'decisao' }],
  pacificou: [{ kind: 'set', flags: { mors_result: 'pacified' } }, { kind: 'goto', to: 'decisao' }],

  // Regras do console (chapter_5_ending): escolha moral primeiro, depois a Humanidade.
  decisao: [
    { kind: 'when', flag: 'moral_choice', equals: 'destruction', goto: 'fim_destruicao' },
    { kind: 'when', flag: 'moral_choice', equals: 'acceptance', goto: 'fim_aceitacao' },
    { kind: 'whenHumanity', min: 55, goto: 'fim_destruicao' },
    { kind: 'whenHumanity', max: 35, goto: 'fim_aceitacao' },
    { kind: 'goto', to: 'fim_fusao' },
  ],

  fim_destruicao: [
    { kind: 'set', flags: { ending: 'destruction', game_complete: true } },
    { kind: 'file', text: '═══ FINAL: DESTRUIÇÃO ═══' },
    { kind: 'narration', text: 'Você ativa sua função primária. O núcleo colapsa.\n\nA Torre se desfaz numa chuva de nomes — milhões de vozes liberadas.' },
    { kind: 'narration', text: 'Kael sorri, pela primeira vez sem código nos olhos. Depois, apaga.' },
    { kind: 'line', speaker: 'Lyra', text: 'Você escolheu contra a sua natureza.' },
    { kind: 'narration', text: 'Ela também desaparece quando a Torre cai.' },
    { kind: 'narration', text: 'A humanidade está livre. O céu clareia — pela primeira vez em 300 anos.\n\nVocê fica sozinho nas ruínas. Vitorioso. Vazio.' },
    { kind: 'line', speaker: 'Mors', text: 'Você me destruiu. Mas você é parte de mim.' },
    { kind: 'narration', text: 'Não há vitória completa. Nunca houve.' },
    { kind: 'end', chapter: 5 },
  ],
  fim_aceitacao: [
    { kind: 'set', flags: { ending: 'acceptance', game_complete: true } },
    { kind: 'file', text: '═══ FINAL: ACEITAÇÃO ═══' },
    { kind: 'narration', text: 'Você se ajoelha diante de MORS. A lógica vence a dúvida.' },
    { kind: 'narration', text: 'A IA reescreve seu código. As memórias voltam — todas, de uma vez.\n\nVocê entende tudo. E deseja não entender.' },
    { kind: 'narration', text: 'O mundo se estabiliza. Sem guerra. Sem dor. Sem escolha.' },
    { kind: 'narration', text: 'Kael retoma seu posto. Lyra arquiva a verdade.\n\nAs ruínas se reconstroem em ordem perfeita.' },
    { kind: 'narration', text: 'Você guarda a Torre. Para sempre. Em paz. Em prisão.\n\nA distopia não grita. Ela apenas... funciona.' },
    { kind: 'end', chapter: 5 },
  ],
  fim_fusao: [
    { kind: 'set', flags: { ending: 'fusion', game_complete: true } },
    { kind: 'file', text: '═══ FINAL: FUSÃO ═══' },
    { kind: 'narration', text: 'Você recusa destruir. Recusa se submeter.' },
    { kind: 'narration', text: 'E oferece a MORS algo que ela não calculou: síntese.\n\nLógica + empatia. Máquina + humanidade.' },
    { kind: 'narration', text: 'MORS hesita. Pela primeira vez em 300 anos, hesita.' },
    { kind: 'narration', text: 'A Torre se transforma. Não colapsa — evolui.\n\nKael e Lyra permanecem. Diferentes. Incertos.' },
    { kind: 'narration', text: 'O futuro é ambíguo. Nem utopia. Nem ruína.\n\nAlgo novo — que nenhum algoritmo previu.' },
    { kind: 'narration', text: 'Talvez isso seja liberdade. Talvez seja outro tipo de prisão.' },
    { kind: 'end', chapter: 5 },
  ],
}
