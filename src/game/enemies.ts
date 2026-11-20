/** Inimigos. Números e falas vêm do jogo em Python (console/combat.py). */
import type { Pattern } from './dodge'
import { CORRUPTED_PATTERNS, GUARDIAN_PATTERNS, LESSER_AVATAR_PATTERNS, MORS_PATTERNS, REMNANT_PATTERNS, SPECTER_PATTERNS } from './patterns'
import { CORRUPTED_PORTRAIT, GUARDIAN_PORTRAIT, MORS_PORTRAIT, REMNANT_PORTRAIT, SPECTER_PORTRAIT } from './portraits'

export type EnemyDef = {
  id: string
  name: string
  maxHp: number
  attack: number
  defense: number
  expReward: number
  mercyThreshold: number
  canPacify: boolean
  humanCorrupted: boolean
  preBattle: string[]
  taunts: string[]
  onDefeat: string
  onPacify: string
  pacifyLines: string[]
  attackLine: string
  patterns: Pattern[]
  /** Retrato em caracteres mostrado na luta. */
  portrait: string
  /** Falso só na luta final: não dá XP. */
  givesExp: boolean
}

export const TOWER_SPECTER: EnemyDef = {
  id: 'espectro',
  name: 'Espectro da Torre',
  maxHp: 40,
  attack: 6,
  defense: 2,
  expReward: 50,
  mercyThreshold: 3,
  canPacify: true,
  humanCorrupted: true,
  preBattle: ['Quem...? Onde...? Dói...', 'Eu... eu resisti... e eles apagaram... tudo...'],
  taunts: ['...não... apaguem... por favor...', 'Eu tinha... um nome...', 'Onde... está... minha filha...?'],
  onDefeat: 'Um último suspiro humano. Depois, apenas estática.',
  onPacify: 'Por um momento, ele sorri. Depois, dissolve em paz.',
  pacifyLines: [
    'Você estende a mão. Por um instante, os olhos dele focam.',
    '« Quem... sou eu? » — a voz quebra entre humano e estático.',
    'Compaixão atravessa o véu de dados apagados.',
  ],
  attackLine: 'Seus movimentos são precisos. Eficientes. Mecânicos.',
  patterns: SPECTER_PATTERNS,
  portrait: SPECTER_PORTRAIT,
  givesExp: true,
}

export const SHADOW_GUARDIAN: EnemyDef = {
  id: 'guardiao',
  name: 'Guardião das Sombras',
  maxHp: 55,
  attack: 8,
  defense: 3,
  expReward: 75,
  mercyThreshold: 4,
  canPacify: true,
  humanCorrupted: true,
  preBattle: ['M-Maria...? É você...?', 'Não... não sou arma... eu era... soldado...'],
  taunts: ['ELENA! ME DESCULPA! EU NÃO QUERIA—', 'Por favor... mate-me... já é o suficiente...', 'Três anos... três anos preso neste corpo...'],
  onDefeat: 'Ele grita um nome. Depois, silêncio.',
  onPacify: '« Obrigado... » — as luzes nos olhos se apagam gentilmente.',
  pacifyLines: [
    'Você fala um nome que não conhece. Ele chora dados.',
    '« Por favor... não me apaguem de novo... »',
    'Algo humano ainda respira dentro da corrupção.',
  ],
  attackLine: 'O golpe é limpo. Você não sente culpa — sente conclusão de tarefa.',
  patterns: GUARDIAN_PATTERNS,
  portrait: GUARDIAN_PORTRAIT,
  givesExp: true,
}

export const CITY_CORRUPTED: EnemyDef = {
  id: 'corrompido',
  name: 'Corrompido da Cidade',
  maxHp: 65,
  attack: 9,
  defense: 4,
  expReward: 90,
  mercyThreshold: 3,
  canPacify: true,
  humanCorrupted: true,
  preBattle: ['A IA nos protege! Você é o erro! ERRO-7!', 'Eu escolhi a segurança. Escolhi a paz. Você não entende!'],
  taunts: ['MORS é misericórdia! MORS é ordem!', 'Eu vi o que a liberdade fez com o mundo!', 'Você... você parece familiar... cuidado com a verdade...'],
  onDefeat: 'Antes de desintegrar: « Ela estava certa. Você é a arma. »',
  onPacify: '« Eu... eu me lembro... do medo... » — e chora.',
  pacifyLines: ['Você recusa a lógica da IA. Escolhe a empatia.', 'O fanatismo vacila. Por um segundo, ele parece assustado consigo.'],
  attackLine: 'Lógica pura. O inimigo é obstáculo. Obstáculos são removidos.',
  patterns: CORRUPTED_PATTERNS,
  portrait: CORRUPTED_PORTRAIT,
  givesExp: true,
}

/** No console é o Corrompido com outros números; aqui é uma projeção de Mors, não um humano. */
export const LESSER_AVATAR: EnemyDef = {
  ...CITY_CORRUPTED,
  id: 'avatar-menor',
  name: 'Avatar Menor de Mors',
  maxHp: 70,
  expReward: 80,
  humanCorrupted: false,
  preBattle: ['Prove sua utilidade, ERRO-7.', 'Ou prove sua obsolescência.'],
  taunts: ['Sua hesitação foi prevista.', 'Cada escolha sua já estava no meu código.', 'Interessante. Continue.'],
  onDefeat: 'O avatar se desfaz em estática. A voz de Mors permanece no ar.',
  onPacify: 'O avatar congela. « Empatia... registrada. Recalculando. »',
  patterns: LESSER_AVATAR_PATTERNS,
  portrait: MORS_PORTRAIT,
}

export const THE_REMNANT: EnemyDef = {
  id: 'remanescente',
  name: 'O Remanescente',
  maxHp: 50,
  attack: 7,
  defense: 2,
  expReward: 100,
  mercyThreshold: 3,
  canPacify: true,
  humanCorrupted: true,
  preBattle: ['Você... você ainda tem forma humana...', 'Eu era o último. Agora sou... isto.', 'Sinto saudade. Sinto saudade de sentir saudade.'],
  taunts: ['Não deixe a Torre te moldar...', 'Eu tentei resistir... fui fraco...', 'Desculpa... por ainda estar vivo...'],
  onDefeat: '« Perdoe... um humano... fraco... » — e some.',
  onPacify: 'Ele segura sua mão. « Obrigado por me ver. »',
  pacifyLines: [
    '« Eu só queria lembrar como era ser humano... »',
    'Suas palavras são um abraço que a Torre não pode deletar.',
    'Lágrimas de luz escorrem pelo rosto deformado.',
  ],
  attackLine: 'Você ataca sem hesitar. O protocolo aprova.',
  patterns: REMNANT_PATTERNS,
  portrait: REMNANT_PORTRAIT,
  givesExp: true,
}

export const MORS_AVATAR: EnemyDef = {
  id: 'mors',
  name: 'Avatar de Mors',
  maxHp: 80,
  attack: 10,
  defense: 5,
  expReward: 0,
  mercyThreshold: 5,
  canPacify: true,
  humanCorrupted: false,
  preBattle: ['ERRO-7. Meu filho lógico. Minha contradição favorita.', 'Lute. Pacifique. Escolha. Todas as rotas estão no meu código.'],
  taunts: [
    'Você acredita que escolhe. Adorável.',
    'Cada golpe seu confirma minha tese.',
    'Cada gesto de misericórdia... também.',
    'Você é meu espelho. Eu sou o seu.',
    'Cada ação sua reescreve o futuro. Ou confirma o passado.',
  ],
  onDefeat: 'MORS fragmenta-se em luz. Mas a voz permanece: « Ainda estou aqui. »',
  onPacify: '« Impossível... empatia acima do limiar... recalculando... »',
  pacifyLines: ['Você não ataca. Você pergunta: « Você também foi programado? »', 'MORS hesita. Pela primeira vez, a lógica encontra silêncio.'],
  attackLine: 'Cada golpe reforça o código. Você se torna o que foi feito para ser.',
  patterns: MORS_PATTERNS,
  portrait: MORS_PORTRAIT,
  givesExp: false,
}
