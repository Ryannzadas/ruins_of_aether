# Ruins of Aether Web — Capítulo 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** O capítulo 1 do Ruins of Aether jogável no navegador (PC e celular), publicado na Vercel, com a luta do Espectro usando desvio em tempo real.

**Architecture:** Lógica do jogo em TypeScript puro (`src/game/`), história como dados (`src/story/`), telas React por cima (`src/ui/`). A caixa de desvio é uma simulação pura (`stepDodge`) desenhada num `<canvas>`. Save em localStorage.

**Tech Stack:** Vite, React 19, TypeScript, Tailwind 4, Vitest + Testing Library (jsdom). Sem backend.

**Spec:** `docs/superpowers/specs/2026-11-20-ruins-of-aether-web-design.md`

## Global Constraints

- Todo texto do jogo em português (pt-BR).
- Conteúdo da história vem do `master` (commit `0c580d7`); cenas extras do Kael do branch `2026-06-17-id6i` podem entrar no capítulo 1.
- Humanidade: começa 50, limite 0–100. Atacar −8, Magia −4 (custa 5 MP), Pacificar +8.
- Jogador inicial: HP 30, MP 15, ataque 8, defesa 3, nível 1. Tabela de XP `{2:50, 3:120, 4:250, 5:500, 6:800}`; cada nível: +5 HP máx, +3 MP máx, +2 ataque, +1 defesa, cura total.
- Dano: `max(1, valor − defesa)`.
- Visual próprio (nada de copiar Undertale). Sem marquee.
- Selo "Desenvolvido por Hydra Labs" (SVG copiado de `D:\desenvolvimento\hydra-labs\public\selo\`) nos créditos, com link para https://hydra-labs-studio.vercel.app.
- Commits sem co-autoria/atribuição do Claude.

## Review Focus

1. Nome do jogador vazio, só espaços, muito longo ou com `<tags>` → vira "Viajante" se vazio, corta em 16 caracteres, renderiza como texto (Task 5).
2. Save corrompido, de versão antiga ou localStorage bloqueado → o jogo abre normalmente, "Continuar" some, nada quebra (Task 6).
3. Aba escondida ou travada no meio do desvio → o `dt` é limitado (máx 50 ms) e a simulação pausa; o jogador não leva vários golpes de uma vez ao voltar (Task 3).
4. Enter/espaço segurado ou toque duplo → não pula uma escolha sem querer; escolhas exigem ação explícita (Task 7).
5. Celular em retrato, tela pequena (360×640) → a caixa de desvio cabe, o toque move a alma de forma relativa ao dedo, sem rolar a página (Task 7).

---

### Task 0: Direção visual (precisa da escolha do João)

**Files:**
- Create: mockup HTML no scratchpad, publicado como Artifact.

- [ ] **Step 1:** Abrir 2–3 sites de referência do João (lista no CLAUDE.md) com o Chrome e tirar captura; anotar de qual site vem cada elemento. Evitar o que já foi usado na Hydra Labs e no Dex Lab.
- [ ] **Step 2:** Montar uma página com 3 direções lado a lado. Cada uma mostra a mesma cena (fala do Kael + 3 escolhas) e um quadro da luta (HUD de HP/MP/Humanidade + caixa de desvio). Paleta, fontes e um efeito de "glitch" próprios em cada.
- [ ] **Step 3:** Publicar e pedir ao João que escolha. Registrar a escolha (tokens de cor, fontes, efeitos) no ledger como `Ruling`.

### Task 1: Base do projeto

**Files:**
- Move: `*.py`, `requirements.txt` → `console/` (o jogo em Python continua rodando com `cd console && python main.py`)
- Create: `package.json`, `vite.config.ts`, `tsconfig*.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/test/setup.ts`
- Modify: `.gitignore` (+ `node_modules/`, `dist/`, `.vercel/`)
- Test: `src/App.test.tsx`

**Interfaces:**
- Produces: scripts `npm test` (vitest run), `npm run build` (tsc -b && vite build), `npm run dev`. Alias `@/` → `src/`.

- [ ] **Step 1:** Mover os arquivos Python com `git mv`; rodar `cd console && python -c "import story"` → sem erro.
- [ ] **Step 2:** Criar o projeto Vite + React + TS + Tailwind 4 + Vitest (jsdom, `@testing-library/jest-dom`).
- [ ] **Step 3:** Teste `renders the title`: `render(<App/>)`; espera `getByRole('heading', {name: /Ruins of Aether/i})`. Rodar → FAIL.
- [ ] **Step 4:** `App` mostra o título com os tokens da Task 0. Rodar `npm test` → PASS; `npm run build` → sem erros.
- [ ] **Step 5:** Commit "Base web: Vite + React; jogo em Python vai para console/".

### Task 2: Estado do jogador e Humanidade

**Files:**
- Create: `src/game/player.ts`
- Test: `src/game/player.test.ts`

**Interfaces:**
- Produces:
  - `type Player = { name; hp; maxHp; mp; maxMp; level; exp; attack; defense; humanity }`
  - `newPlayer(name: string): Player`
  - `shiftHumanity(p: Player, delta: number): Player` — limita a 0–100; se a nova Humanidade > 70 e delta > 0: ataque −1 (mín 6), defesa +1 (máx 8); se < 30 e delta < 0: ataque +1 (máx 20). (Igual ao Python.)
  - `takeDamage(p: Player, amount: number): { player: Player; dealt: number }`
  - `gainExp(p: Player, amount: number): { player: Player; levelsGained: number }`
  - `damageAfterDefense(amount: number, defense: number): number` → `max(1, amount − defense)`

- [ ] **Step 1:** Testes:
  - `newPlayer('Ana')` → `{hp:30,maxHp:30,mp:15,maxMp:15,level:1,exp:0,attack:8,defense:3,humanity:50}`.
  - `shiftHumanity` com +8 a partir de 96 → 100; com −8 a partir de 4 → 0.
  - `shiftHumanity` de 66 com +8 → humanidade 74, ataque 7, defesa 4.
  - `takeDamage` com 2 e defesa 3 → `dealt` 1; HP nunca abaixo de 0.
  - `gainExp(newPlayer, 50)` → nível 2, maxHp 35, hp 35, maxMp 18, ataque 10, defesa 4; `gainExp(…, 130)` a partir do zero → nível 3.
- [ ] **Step 2:** Rodar → FAIL. **Step 3:** Implementar (funções puras, sem mutar a entrada). **Step 4:** PASS.
- [ ] **Step 5:** Commit "Jogador, dano, XP e Humanidade".

### Task 3: Simulação da caixa de desvio

**Files:**
- Create: `src/game/dodge.ts`, `src/game/patterns.ts`
- Test: `src/game/dodge.test.ts`

**Interfaces:**
- Produces:
  - Caixa lógica fixa de 240×240 unidades; alma é um círculo de raio 6, velocidade 140 u/s.
  - `type Bullet = { x; y; vx; vy; r }`
  - `type Pattern = { id: string; name: string; duration: number /* s */; spawn(t: number, rng: () => number): Bullet[] /* projéteis que nascem no instante t (passo fixo de 1/60 s) */ }`
  - `type DodgeSim = { soul: {x;y}; bullets: Bullet[]; t: number; hits: number; invuln: number; done: boolean; pattern: Pattern }`
  - `startDodge(pattern: Pattern, rng: () => number): DodgeSim` — alma no centro.
  - `type DodgeInput = { dx: number; dy: number } /* −1..1 cada, normalizado se diagonal */ | { target: {x;y} } /* toque: anda até o ponto na velocidade normal */`
  - `stepDodge(sim: DodgeSim, input: DodgeInput, dt: number): DodgeSim` — `dt` limitado a 0.05; alma presa dentro da caixa; colisão círculo-círculo soma 1 em `hits` e dá 0.8 s de invulnerabilidade; projéteis fora da caixa saem da lista; `done` quando `t >= duration`.
  - `patterns.ts`: `SPECTER_PATTERNS: Pattern[]` com 3 padrões do Python: "Rajada de Dados" (da esquerda), "Colapso de Éter" (de cima), "Pulso do Núcleo" (dos 4 cantos para o centro). Cada um dura 5 s.

- [ ] **Step 1:** Testes:
  - `startDodge` → alma em (120,120), `hits` 0.
  - Input `{dx:1,dy:0}` por 1 s em passos de 1/60 → alma presa em x = 234 (240 − raio 6).
  - `stepDodge` com `dt` 2 avança só 0.05 em `t`.
  - Projétil parado sobre a alma: 1 hit; mais 0.5 s ainda 1 hit (invulnerável); após 0.9 s, 2 hits.
  - Cada padrão de `SPECTER_PATTERNS` com rng fixo e alma parada no centro termina com `done` em 5 s e gera ao menos 1 projétil.
  - Input `{target:{x:200,y:120}}` move a alma no máximo 140×dt por passo.
- [ ] **Step 2:** FAIL. **Step 3:** Implementar. **Step 4:** PASS.
- [ ] **Step 5:** Commit "Simulação do desvio e padrões do Espectro".

### Task 4: Motor de luta

**Files:**
- Create: `src/game/battle.ts`, `src/game/enemies.ts`
- Test: `src/game/battle.test.ts`

**Interfaces:**
- Consumes: Task 2 (`Player`, `shiftHumanity`, `takeDamage`, `gainExp`, `damageAfterDefense`), Task 3 (`Pattern`).
- Produces:
  - `type EnemyDef = { id; name; maxHp; attack; defense; expReward; mercyThreshold; canPacify; humanCorrupted; preBattle: string[]; taunts: string[]; onDefeat: string; onPacify: string; pacifyLines: string[]; attackLine: string; patterns: Pattern[] }`
  - `enemies.ts`: `TOWER_SPECTER: EnemyDef` com os valores do Python (HP 40, ataque 6, defesa 2, XP 50, misericórdia 3) e textos de `create_tower_specter`, `PACIFY_LINES[1]`, `ATTACK_LINES[1]`.
  - `type Battle = { enemy: EnemyDef; enemyHp: number; mercy: number; turn: number; outcome: null | 'victory' | 'pacified' | 'defeat' }`
  - `startBattle(def: EnemyDef): Battle`
  - `type Action = 'attack' | 'magic' | 'pacify'`
  - `playerAction(p: Player, b: Battle, a: Action, rng: () => number): { player; battle; log: string[]; usedTurn: boolean }` — ataque: `attack + inteiro(−2..2)`, Humanidade −8; magia: custa 5 MP, `floor(attack×1.5) + inteiro(0..3)`, Humanidade −4, sem MP → `usedTurn:false`; pacificar: misericórdia +1, Humanidade +8, se `!canPacify` → `usedTurn:false`. Vitória/pacificação dão XP.
  - `enemyHits(p: Player, b: Battle, hits: number): { player; battle; dealt: number }` — cada hit causa `damageAfterDefense(enemy.attack, p.defense)`; HP 0 → `outcome:'defeat'`.

- [ ] **Step 1:** Testes (rng fixo retornando 0.5):
  - Atacar o Espectro com jogador novo → HP do inimigo 40 − max(1, 8+0−2) = 34; Humanidade 42.
  - Magia → MP 10, Humanidade 46; com MP 4 → `usedTurn:false` e nada muda.
  - 3× pacificar → `outcome:'pacified'`, Humanidade 74, XP 50 → nível 2.
  - `enemyHits(p, b, 2)` com defesa 3 → 2×max(1,6−3) = 6 de dano.
  - Levar HP a 0 → `outcome:'defeat'`.
- [ ] **Step 2:** FAIL. **Step 3:** Implementar. **Step 4:** PASS.
- [ ] **Step 5:** Commit "Motor de luta e Espectro da Torre".

### Task 5: Roteiro do capítulo 1 e executor de história

**Files:**
- Create: `src/story/types.ts`, `src/story/runner.ts`, `src/story/chapter1.ts`
- Test: `src/story/runner.test.ts`, `src/story/chapter1.test.ts`

**Interfaces:**
- Consumes: Task 2 (`Player`), Task 4 (`EnemyDef`, `TOWER_SPECTER`).
- Produces:
  - `type Step = { kind:'title'; chapter:number; text:string } | { kind:'narration'; text:string } | { kind:'line'; speaker:'Kael'|'Você'|'Lyra'|'Mors'|'Sistema'; text:string } | { kind:'glitch'; text:string } | { kind:'file'; text:string } | { kind:'choice'; prompt:string; options:{ label:string; set?:Record<string,string|boolean>; goto:string }[] } | { kind:'battle'; enemy:EnemyDef; goto:{ victory:string; pacified:string; defeat:string } } | { kind:'goto'; to:string } | { kind:'when'; flag:string; equals:string|boolean; goto:string } | { kind:'end'; chapter:number }`
  - `type Script = Record<string /* label */, Step[]>` — começa em `'start'`.
  - `type Cursor = { label: string; index: number }`
  - `type Story = { chapter: number; cursor: Cursor; flags: Record<string,string|boolean>; kaelLogs: string[]; lyraNotes: string[]; killed: number; pacified: number }`
  - `current(script: Script, story: Story): Step` — resolve `goto`/`when` sozinho até achar um passo visível.
  - `advance(script, story, input?: { option?: number; battle?: 'victory'|'pacified'|'defeat' }): Story`
  - `fillName(text: string, name: string): string` — troca `{nome}`.
  - `cleanName(raw: string): string` — trim, vazio → "Viajante", corta em 16.
  - `chapter1.ts`: `CHAPTER_1: Script` com as cenas do `master` (despertar, glitch, encontro com Kael e as 3 respostas, o grito, o Espectro, a luta, conclusão diferente para pacificar/vencer, olhos em binário do Kael, arquivo ERRO-7, monólogo, fim) + cenas extras do Kael do branch `2026-06-17-id6i` (312 anos, câmara de descanso, arquivo na parede durante a noite, "Você viu algo na câmara?") encaixadas antes do Espectro. Derrota volta para o rótulo antes da luta.

- [ ] **Step 1:** Testes:
  - `cleanName('   ')` → 'Viajante'; `cleanName('a'.repeat(30)).length` → 16; `cleanName('<b>x</b>')` → '<b>x</b>' (só texto; React escapa).
  - `advance` numa escolha sem `option` não muda o cursor.
  - `when` com flag igual pula para o rótulo.
  - `chapter1.test.ts`: todo `goto` de `CHAPTER_1` existe; percorrer escolhendo sempre a opção 0 e `pacified` chega a `{kind:'end', chapter:1}` com `flags.specter_result === 'pacified'` e `found_erro7_file === true`; o mesmo com `victory` → `specter_result === 'victory'`; `defeat` volta ao passo anterior à luta.
- [ ] **Step 2:** FAIL. **Step 3:** Implementar runner e escrever o roteiro. **Step 4:** PASS.
- [ ] **Step 5:** Commit "Roteiro do capítulo 1".

### Task 6: Save

**Files:**
- Create: `src/game/save.ts`
- Test: `src/game/save.test.ts`

**Interfaces:**
- Consumes: `Player` (Task 2), `Story` (Task 5).
- Produces: `type SaveData = { version: 1; player: Player; story: Story; savedAt: string }`; `saveGame(d: Omit<SaveData,'version'|'savedAt'>): boolean`; `loadGame(): SaveData | null`; `clearSave(): void`. Chave `ruins-of-aether:save`. Tudo em try/catch.

- [ ] **Step 1:** Testes: salvar e carregar devolve o mesmo; JSON inválido → `null`; `version` diferente → `null`; `localStorage.setItem` lançando erro → `saveGame` retorna `false` sem lançar.
- [ ] **Step 2:** FAIL. **Step 3:** Implementar. **Step 4:** PASS.
- [ ] **Step 5:** Commit "Save no navegador".

### Task 7: Telas

**Files:**
- Create: `src/ui/TitleScreen.tsx`, `src/ui/NameScreen.tsx`, `src/ui/SceneScreen.tsx`, `src/ui/BattleScreen.tsx`, `src/ui/DodgeBox.tsx`, `src/ui/ChapterEnd.tsx`, `src/ui/Credits.tsx`, `src/ui/Hud.tsx`, `public/hydra-labs-selo.svg`
- Modify: `src/App.tsx` (máquina de telas: título → nome → cena ↔ luta → fim de capítulo; créditos)
- Test: `src/ui/*.test.tsx`

**Interfaces:**
- Consumes: tudo acima.
- `DodgeBox` props: `{ pattern: Pattern; onDone(hits: number): void }` — `requestAnimationFrame` chamando `stepDodge`; canvas escala a caixa lógica 240×240 para a largura disponível (máx 360 px); teclado (setas/WASD); toque/arrasto vira `{target}` convertido para coordenadas lógicas; `touch-action: none` na caixa; pausa quando `document.hidden`.

- [ ] **Step 1:** Testes (Testing Library):
  - Título: sem save → "Novo jogo" e "Créditos", sem "Continuar"; com save → "Continuar" aparece.
  - Nome: enviar vazio começa o jogo como "Viajante".
  - Cena: clicar/Enter avança narração; numa escolha, Enter sozinho não avança; clicar uma opção avança; teclas 1–3 escolhem.
  - Luta: clicar "Pacificar" 3× (com `DodgeBox` substituído por um falso que chama `onDone(0)`) leva ao fim com "pacificado"; Humanidade na HUD mostra 74.
  - Créditos: link do selo aponta para https://hydra-labs-studio.vercel.app e a imagem tem alt "Desenvolvido por Hydra Labs".
  - Fim do capítulo: mostra "Capítulo 2 em breve" e um botão para o título.
- [ ] **Step 2:** FAIL. **Step 3:** Implementar com a direção da Task 0 (efeito de digitação respeitando `prefers-reduced-motion`). **Step 4:** PASS; `npm run build` limpo.
- [ ] **Step 5:** Verificação manual: abrir no navegador em 1280×800 e 360×640, jogar o capítulo 1 inteiro pelos dois caminhos (pacificar e lutar) e perder uma vez de propósito. Conferir que a página não rola durante o desvio.
- [ ] **Step 6:** Commit "Telas do capítulo 1".

### Task 8: Publicar

**Files:**
- Modify: `README.md` (como jogar no navegador, como rodar local, versão console em `console/`)

- [ ] **Step 1:** Atualizar README e a descrição do repositório (`gh repo edit`). Perguntar ao João antes de adicionar o tópico `hydra-labs`.
- [ ] **Step 2:** Push do branch `web`, PR para `master`.
- [ ] **Step 3:** Criar o projeto na Vercel a partir do repositório (painel, pelo Chrome) apontando para o branch de produção `master`; o preview do PR serve para o João testar antes do merge.
- [ ] **Step 4:** Abrir o link de preview e jogar o capítulo 1 até o fim.
