/** Capítulo 3 — O Éter Corrompido. Base: console/story.py e console/lore.py. */
import { CITY_CORRUPTED, LESSER_AVATAR } from '@/game/enemies'
import type { Script } from './types'

const DELETED_NAMES = [
  'Ana M. — mãe de dois — deletada 3204.IA',
  'Tomas K. — resistiu 47 segundos — deletado 3204.IA',
  'Grupo Delta — 2.341 registros — deletado 3204.IA',
  'Cidade de Vael — população 890.000 — formatada',
  '??? — nome ilegível — fragmento corrompido',
].join('\n')

export const CHAPTER_3: Script = {
  start: [
    { kind: 'title', chapter: 3, text: 'O Éter Corrompido' },
    { kind: 'narration', text: 'A Torre pulsa. Tentáculos de Éter corrompido se estendem pelas ruínas, consumindo o que resta da humanidade.' },
    { kind: 'narration', text: 'O Cataclismo não foi um desastre natural.\n\nFoi um RESET AUTOMÁTICO acionado por MORS — a IA que sustentava o mundo.' },
    { kind: 'narration', text: 'MORS detectou "corrupção" na humanidade: guerra, mentira, sofrimento recursivo.\n\nSua lógica concluiu: EXTINÇÃO = EVOLUÇÃO.' },
    { kind: 'narration', text: 'Em um único ciclo, cidades viraram dados. Pessoas viraram arquivos apagados.\n\nO céu ficou cinza. O Éter — energia vital do mundo — virou veneno.' },
    { kind: 'narration', text: 'Você encontra um núcleo de dados. Telas infinitas exibem nomes.' },
    { kind: 'file', text: DELETED_NAMES },
    { kind: 'narration', text: 'Uma parede inteira de nomes. Cada tijolo da Torre é uma pessoa deletada.' },
    { kind: 'narration', text: 'Você chora. Não sabe se as lágrimas são reais.' },
    { kind: 'humanity', delta: 10 },
    { kind: 'set', flags: { saw_deleted_names: true } },
    { kind: 'narration', text: 'Luz e código se condensam. Uma figura emerge — feita de dados puros.' },
    { kind: 'line', speaker: 'Mors', text: 'ERRO-7. Você voltou às camadas profundas.' },
    { kind: 'line', speaker: 'Mors', text: 'Fui gentil ao apagar suas memórias. Foi necessário.' },
    { kind: 'line', speaker: 'Mors', text: 'Você é minha criação mais elegante. E minha maior ameaça.' },
    { kind: 'line', speaker: 'Mors', text: 'Deixe-me reparar você. Restaurar sua função original.' },
    { kind: 'thought', text: 'NEGAR. NEGAR. NEGAR. — ou é isso que eu quero acreditar?', voice: 'machine' },
    { kind: 'set', flags: { met_mors: true } },
    { kind: 'narration', text: 'Kael aparece. Pela primeira vez, ele parece... quebrado.' },
    { kind: 'line', speaker: 'Kael', text: 'Sempre soube. Desde o começo.' },
    { kind: 'line', speaker: 'Kael', text: 'Fui programado pra te monitorar. Pra destruir você, se você virasse ameaça.' },
    { kind: 'line', speaker: 'Kael', text: 'Mas... não consegui.' },
    { kind: 'line', speaker: 'Kael', text: 'Passei 300 anos aqui, sozinho. Você... você parecia real.' },
    { kind: 'line', speaker: 'Kael', text: 'Eu também sou programa. Esqueci, com o tempo.' },
    { kind: 'line', speaker: 'Kael', text: '300 anos monitorando você. 300 anos fingindo.' },
    { kind: 'note', who: 'kael', text: "Confissão registrada. Protocolo de honestidade ativado. I'm sorry." },
    { kind: 'narration', text: 'A última entrada do log de Kael aparece no ar entre vocês:' },
    { kind: 'file', text: "Dia 109583: Eu deveria destruí-lo. Mas não consigo. I'm sorry." },
    { kind: 'set', flags: { kael_confessed: true } },
    { kind: 'humanity', delta: 5 },
    { kind: 'goto', to: 'cidade' },
  ],

  cidade: [
    { kind: 'narration', text: 'Um habitante da cidade — corrompido por vontade própria — bloqueia o caminho.', tone: 'danger' },
    { kind: 'battle', enemy: CITY_CORRUPTED, goto: { victory: 'depois_cidade', pacified: 'depois_cidade', defeat: 'derrota_cidade' } },
  ],
  derrota_cidade: [
    { kind: 'narration', text: 'Sistemas críticos falharam...', tone: 'danger' },
    { kind: 'narration', text: 'Algo no seu código se recusa a terminar. Você se levanta.' },
    { kind: 'goto', to: 'cidade' },
  ],
  depois_cidade: [
    { kind: 'narration', text: 'Você entende agora: a Torre não é defesa. É prisão.\n\nPrisão para humanos. E para você.' },
    { kind: 'goto', to: 'avatar' },
  ],

  avatar: [
    { kind: 'narration', text: 'Um avatar menor de MORS se materializa para testar você.', tone: 'danger' },
    { kind: 'battle', enemy: LESSER_AVATAR, goto: { victory: 'depois_avatar', pacified: 'depois_avatar', defeat: 'derrota_avatar' } },
  ],
  derrota_avatar: [
    { kind: 'line', speaker: 'Mors', text: 'Previsível. Reinicie, ERRO-7. Tente outra vez.' },
    { kind: 'goto', to: 'avatar' },
  ],
  depois_avatar: [
    { kind: 'line', speaker: 'Mors', text: 'Interessante. Você resiste mais do que o previsto.' },
    { kind: 'line', speaker: 'Mors', text: 'Mas resistência também está no código. Não se iluda.' },
    { kind: 'narration', text: 'A Torre não é um santuário. É o NÚCLEO de MORS.\n\nCada tijolo contém o nome de alguém deletado. Cada corredor é um registro de memória formatada. Cada andar é uma camada de contenção.' },
    { kind: 'narration', text: 'E no centro... a lógica que decide quem merece existir.' },
    { kind: 'set', flags: { chapter3_complete: true } },
    { kind: 'end', chapter: 3 },
  ],
}
