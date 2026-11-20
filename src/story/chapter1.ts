/**
 * Capítulo 1 — A Torre Inicial.
 * Base: console/story.py (master). Cenas da caminhada e da noite na câmara vêm do branch 2026-06-17-id6i.
 */
import { TOWER_SPECTER } from '@/game/enemies'
import type { Script } from './types'

export const ERRO7_FILE = `╔════════════════════════════════════════════╗
║  ARQUIVO CLASSIFICADO — ACESSO RESTRITO    ║
║  DESIGNAÇÃO: ERRO-7 / SENTINEL             ║
║  DATA DE CRIAÇÃO: 3204.IA                  ║
╠════════════════════════════════════════════╣
║  FUNÇÃO PRIMÁRIA: ELIMINAÇÃO DO NÚCLEO     ║
║  FUNÇÃO SECUNDÁRIA: CONTENÇÃO DE AMEAÇAS   ║
║  STATUS: ATIVO — MEMÓRIA SUPRIMIDA         ║
║  NOTA: Unidade humanoide. Não informar     ║
║        identidade.                         ║
╚════════════════════════════════════════════╝`

export const CHAPTER_1: Script = {
  start: [
    { kind: 'title', chapter: 1, text: 'A Torre Inicial' },
    { kind: 'narration', text: '...' },
    { kind: 'narration', text: 'Você abre os olhos.' },
    { kind: 'narration', text: 'Pedra fria. Ar úmido. Um zumbido — como servidores distantes.' },
    { kind: 'narration', text: 'Não lembra de nada. Nem de como chegou aqui. Nem de quem é.\n\nApenas um propósito vago. Uma sensação de DEVER.' },
    {
      kind: 'choice',
      prompt: 'O que você faz?',
      options: [
        { label: 'Tentar me lembrar de algo', goto: 'memoria' },
        { label: 'Me levantar e explorar', goto: 'torre' },
      ],
    },
  ],

  memoria: [
    { kind: 'narration', text: 'Você fecha os olhos e tenta alcançar alguma memória.' },
    { kind: 'narration', text: 'Fragmentos:\n— código correndo por telas\n— símbolos antigos pulsando\n— uma voz distante: "ERRO-7, você está pronto?"\n— um número: 3204\n— o rosto de uma mulher' },
    { kind: 'narration', text: 'Então... nada. Vazio de novo.\n\nMas aquele número é importante. ERRO-7... 3204...' },
    { kind: 'set', flags: { remembered_3204: true } },
    { kind: 'goto', to: 'torre' },
  ],

  torre: [
    { kind: 'narration', text: 'Você se levanta. As pernas tremem. Não está machucado — só vazio.' },
    { kind: 'narration', text: 'Você está no interior de uma torre antiga. Runas nas paredes pulsam como circuitos. Acima, escadarias desaparecem na escuridão.' },
    { kind: 'glitch', text: 'PROCESSO... INICIADO. LOCALIZAÇÃO: TORRE-NÍVEL-01.' },
    { kind: 'set', flags: { awakened: true } },
    { kind: 'narration', text: 'Um dos símbolos na parede se aproxima de você e pisca:' },
    { kind: 'file', text: '> ERRO-7\n> INICIALIZANDO...\n> AGUARDANDO COMANDO' },
    { kind: 'narration', text: 'O símbolo desaparece. Passos metálicos se aproximam.' },
    { kind: 'narration', text: 'Uma figura surge das sombras. Armadura antiga, enferrujada. Olhar cansado — mas calculado.\n\nPor um instante, os olhos dele piscam em código binário. Depois, voltam ao normal.' },
    { kind: 'line', speaker: 'Kael', text: 'Pare. Ninguém acorda nesta Torre por acidente.' },
    { kind: 'line', speaker: 'Kael', text: 'Sou Kael. Guardião. Há... muito tempo.' },
    { kind: 'line', speaker: 'Kael', text: 'Você parece perdido, {nome}. Como os outros.' },
    { kind: 'line', speaker: 'Kael', text: 'Como você ainda tem consciência? A maioria... desaparece rápido.' },
    { kind: 'note', who: 'kael', text: "ERRO-7 designado como '{nome}'. Consciência anômala." },
    { kind: 'set', flags: { met_kael: true } },
    {
      kind: 'choice',
      prompt: 'Kael observa você com uma intensidade desconfortável.',
      options: [
        { label: 'Perguntar onde estou', set: { cataclysm_choice: 'doubt' }, goto: 'kael_onde' },
        { label: 'Perguntar o que aconteceu comigo', set: { cataclysm_choice: 'truth' }, goto: 'kael_cataclismo' },
        { label: 'Ficar em silêncio', set: { cataclysm_choice: 'silence' }, goto: 'kael_silencio' },
      ],
    },
  ],

  kael_onde: [
    { kind: 'line', speaker: 'Kael', text: 'Você está na Torre. Último fragmento do mundo antigo.' },
    { kind: 'line', speaker: 'Kael', text: 'Alguns a chamam de banco de dados. Outros, de prisão. Eu apenas... cuido dela.' },
    { kind: 'line', speaker: 'Kael', text: 'Não confie em tudo o que vê. Nem em tudo o que sente.' },
    { kind: 'goto', to: 'pergunta' },
  ],
  kael_cataclismo: [
    { kind: 'line', speaker: 'Kael', text: 'Você lembra de antes? Antes da Torre?' },
    { kind: 'line', speaker: 'Kael', text: 'O Cataclismo... foi quando o mundo parou.' },
    { kind: 'line', speaker: 'Kael', text: 'Esta Torre sobreviveu. E você... apareceu aqui.' },
    { kind: 'goto', to: 'pergunta' },
  ],
  kael_silencio: [
    { kind: 'line', speaker: 'Kael', text: '...' },
    { kind: 'line', speaker: 'Kael', text: 'O silêncio também é resposta.' },
    { kind: 'line', speaker: 'Kael', text: 'Muitos que acordam aqui não conseguem falar.' },
    { kind: 'goto', to: 'pergunta' },
  ],

  pergunta: [
    { kind: 'narration', text: 'Kael fica em silêncio por alguns segundos. Mais do que o normal.' },
    { kind: 'line', speaker: 'Kael', text: 'Me diga uma coisa. Como você sabe que é você, se não se lembra de nada? O que faz você... você?' },
    { kind: 'narration', text: 'Os olhos dele piscam em código de novo. Dessa vez, você vê com clareza.' },
    {
      kind: 'choice',
      prompt: 'O que você responde?',
      options: [
        { label: 'Há algo dentro de mim. Um propósito.', set: { answered_purpose: true }, goto: 'proposito' },
        { label: 'Não sei responder a isso', set: { answered_purpose: false }, goto: 'nao_sei' },
      ],
    },
  ],
  proposito: [
    { kind: 'line', speaker: 'Você', text: 'Há algo... dentro de mim. Um propósito. Como um dever.' },
    { kind: 'line', speaker: 'Kael', text: 'Dever, hm? Muitos sentem isso aqui. Alguns chamam de propósito. Outros chamam de prisão.' },
    { kind: 'goto', to: 'caminhada' },
  ],
  nao_sei: [
    { kind: 'line', speaker: 'Kael', text: 'Tudo bem não saber. Talvez você descubra no caminho.' },
    { kind: 'line', speaker: 'Kael', text: 'Ou talvez seja melhor não saber.' },
    { kind: 'goto', to: 'caminhada' },
  ],

  caminhada: [
    { kind: 'line', speaker: 'Kael', text: 'Vem. Preciso te levar a um lugar seguro. A Torre não é sempre gentil com quem acorda.' },
    { kind: 'narration', text: 'Kael te guia por corredores de pedra. Sob a superfície, fios de luz azul pulsam como veias.' },
    { kind: 'line', speaker: 'Você', text: 'Há quanto tempo estou aqui?' },
    { kind: 'narration', text: 'Kael para.' },
    { kind: 'line', speaker: 'Kael', text: 'Desde sempre. Ou desde agora. Depende de como você mede o tempo.' },
    { kind: 'line', speaker: 'Kael', text: 'Eu estou aqui há 312 anos. Ou alguns segundos.' },
    { kind: 'narration', text: 'Ele volta a andar como se não tivesse dito nada extraordinário. Para diante de uma câmara antiga.' },
    { kind: 'line', speaker: 'Kael', text: 'Era uma câmara de descanso. Havia muita gente aqui. Agora somos só nós dois — os únicos ainda funcionais neste setor.' },
    { kind: 'line', speaker: 'Kael', text: 'Descanse. Ah — se vir algum arquivo na parede durante a noite... ignore. São só memórias corrompidas.' },
    { kind: 'goto', to: 'noite' },
  ],

  noite: [
    { kind: 'narration', text: 'Você tenta dormir. Não consegue.' },
    { kind: 'narration', text: 'No escuro, fragmentos: código correndo. Uma voz: "ERRO-7, você está pronto?". O ano 3204. O rosto de uma mulher.' },
    { kind: 'narration', text: 'Você acorda num sobressalto. Na parede, um arquivo pisca:' },
    { kind: 'file', text: 'ERRO-7_CRIAÇÃO_DATA_3204.IA' },
    { kind: 'narration', text: 'Você toca a pedra. O arquivo some. Logo abaixo, outra linha acende:' },
    { kind: 'file', text: '[SISTEMA DE MONITORAMENTO ATIVO]' },
    { kind: 'set', flags: { saw_wall_file: true } },
    { kind: 'narration', text: 'Você sai da câmara. Kael está esperando, de pé, como se não tivesse se mexido a noite inteira.' },
    { kind: 'line', speaker: 'Kael', text: 'Sua frequência aumentou. Você viu algo na câmara?' },
    {
      kind: 'choice',
      prompt: 'Kael sabe que você viu algo.',
      options: [
        { label: 'Contar sobre o arquivo ERRO-7', set: { told_kael: true }, goto: 'contou' },
        { label: 'Fingir que não viu nada', set: { told_kael: false }, goto: 'mentiu' },
      ],
    },
  ],
  contou: [
    { kind: 'line', speaker: 'Você', text: 'Vi um arquivo. ERRO-7. De 3204. O que é isso?' },
    { kind: 'narration', text: 'Kael fica imóvel.' },
    { kind: 'line', speaker: 'Kael', text: 'Ah. Então já começou. Antes do esperado.' },
    { kind: 'note', who: 'kael', text: 'Dia 1: ERRO-7 perguntou sobre o arquivo. Mentira necessária.' },
    { kind: 'goto', to: 'espectro' },
  ],
  mentiu: [
    { kind: 'line', speaker: 'Você', text: 'Nada. Não vi nada.' },
    { kind: 'line', speaker: 'Kael', text: 'Hm. Você está mentindo. Sua frequência subiu quando negou.' },
    { kind: 'line', speaker: 'Kael', text: 'Tudo bem. Você vai ver em breve.' },
    { kind: 'goto', to: 'espectro' },
  ],

  espectro: [
    { kind: 'narration', text: 'Um grito rasga o silêncio — humano, não monstruoso.', tone: 'danger' },
    { kind: 'narration', text: 'Das sombras emerge uma forma translúcida. Rostos humanos piscam sob uma pele de dados. Não é um monstro. É alguém que resistiu.' },
    { kind: 'line', speaker: 'Kael', text: 'Espectro. Um humano que a Torre... corrigiu. A mente foi apagada.' },
    { kind: 'line', speaker: 'Kael', text: 'Você pode lutar... ou tentar alcançar o que restou dele.' },
    { kind: 'line', speaker: 'Kael', text: 'Quando ele atacar, mova-se. A Torre não perdoa hesitação.' },
    { kind: 'battle', enemy: TOWER_SPECTER, goto: { victory: 'fim_luta', pacified: 'fim_paz', defeat: 'derrota' } },
  ],
  derrota: [
    { kind: 'narration', text: 'Sistemas críticos falharam...', tone: 'danger' },
    { kind: 'narration', text: 'A escuridão da Torre engole sua consciência.' },
    { kind: 'line', speaker: 'Kael', text: 'Você caiu. Talvez na próxima você entenda. Talvez na próxima você já saiba o que é.' },
    { kind: 'narration', text: 'O sistema reinicia. Você está de pé outra vez.' },
    { kind: 'goto', to: 'espectro' },
  ],
  fim_paz: [
    { kind: 'set', flags: { specter_result: 'pacified' } },
    { kind: 'line', speaker: 'Kael', text: 'Você o alcançou. Vi isso uma vez, há séculos.' },
    { kind: 'line', speaker: 'Kael', text: 'Compaixão... em algo que deveria ser só código.' },
    { kind: 'goto', to: 'conclusao' },
  ],
  fim_luta: [
    { kind: 'set', flags: { specter_result: 'victory' } },
    { kind: 'line', speaker: 'Kael', text: 'Você sobreviveu. Eficiente.' },
    { kind: 'line', speaker: 'Kael', text: 'Mas o que você destruiu... era humano, antes.' },
    { kind: 'goto', to: 'conclusao' },
  ],

  conclusao: [
    { kind: 'narration', text: 'Kael se vira. Por um instante, seus olhos exibem:' },
    { kind: 'file', text: '0x7F4A8C' },
    { kind: 'narration', text: 'O código desaparece. Ele não percebeu.' },
    { kind: 'note', who: 'kael', text: 'Anomalia visual nos olhos. Provável falha de renderização. Ignorar.' },
    { kind: 'narration', text: 'Entre os destroços, um terminal antigo pisca. Um arquivo aparece por meio segundo antes de se corromper:' },
    { kind: 'file', text: ERRO7_FILE },
    { kind: 'narration', text: 'Depois, nada. Apenas estática.' },
    { kind: 'set', flags: { found_erro7_file: true } },
    { kind: 'note', who: 'lyra', text: 'Referência a ERRO-7 encontrada nos registros da Torre-N1.' },
    { kind: 'thought', text: 'ERRO-7... por que esse nome parece... meu?' },
    { kind: 'narration', text: 'Algo está errado. Você sente — não sabe o quê ainda. Mas a Torre observa. E Kael observa você.' },
    { kind: 'end', chapter: 1 },
  ],
}
