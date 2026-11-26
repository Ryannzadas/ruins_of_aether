# Ruins of Aether Web — Capítulos 2 a 5 e finais

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Steps use checkbox (`- [ ]`).

**Goal:** O jogo inteiro (5 capítulos, 5 lutas + o Avatar Menor, 3 finais) jogável no navegador.

**Architecture:** O motor de roteiro ganha passos de Humanidade e de desvio por Humanidade; os capítulos viram scripts separados (`SCRIPTS[n]`) encadeados pelo App. Cada inimigo traz retrato e padrões próprios.

**Spec:** `docs/superpowers/specs/2026-11-20-ruins-of-aether-web-design.md` (ordem de entrega, passo 3). Conteúdo: `console/story.py`, `console/combat.py`, `console/characters.py`, `console/lore.py`.

## Global Constraints

- Tudo da Global Constraints do plano do capítulo 1 continua valendo.
- Mudanças de Humanidade fora da luta iguais ao console: promessa à Lyra +10; nomes apagados +10; confissão do Kael +5; escolha moral destruição +5, aceitação −10, fusão 0.
- Final (console `chapter_5_ending`): destruição se moral = destruição ou (Humanidade ≥ 55 e moral ≠ aceitação); senão aceitação se moral = aceitação ou Humanidade ≤ 35; senão fusão.
- A luta final não dá XP. Derrota em qualquer luta volta para antes dela.
- Saves do capítulo 1 já existentes continuam carregando.

## Review Focus

1. Save no meio do capítulo 3 com Humanidade alterada por passo de roteiro → recarregar não aplica a mudança de novo (Task 1).
2. Terminar o capítulo 1 com save antigo (cursor no `end` do cap. 1) → "Continuar para o Capítulo 2" funciona (Task 4).
3. Humanidade exatamente 55 ou 35 no fim → final certo pelas regras acima (Task 3).
4. Cada inimigo novo tem padrões que terminam e geram projéteis (Task 2).
5. Janela perde o foco com seta apertada no desvio → a alma para (Task 5).

---

### Task 1: Motor — passos de Humanidade e desvio por Humanidade

**Files:** Modify `src/story/types.ts`, `src/story/runner.ts`, `src/App.tsx`; Test `src/story/runner.test.ts`

**Interfaces — Produces:**
- Passos invisíveis `{ kind: 'humanity'; delta: number }` e `{ kind: 'whenHumanity'; min?: number; max?: number; goto: string }`.
- `Story` ganha `humanityShift: number` (acumulado ainda não aplicado ao jogador; saves antigos sem o campo contam como 0).
- `current(script, story, humanity = 50)` e `advance(script, story, input?, humanity = 50)`: `whenHumanity` compara com `humanity + story.humanityShift`.
- `takeHumanityShift(story): { story: Story; delta: number }` — zera o acumulado. O App aplica `shiftHumanity(player, delta)` e salva os dois juntos.

- [ ] Testes: `humanity` acumula +10 e +5 → 15; `whenHumanity {min:55}` com humanidade 50 e shift 5 pula; com shift 4 não pula; `takeHumanityShift` devolve 15 e zera. RED → implementar → GREEN. Commit.

### Task 2: Inimigos e padrões novos

**Files:** Modify `src/game/enemies.ts`, `src/game/patterns.ts`, `src/game/battle.ts`; Test `src/game/battle.test.ts`, `src/game/dodge.test.ts`

**Interfaces — Produces:**
- `EnemyDef` ganha `portrait: string` e `givesExp: boolean` (falso só no Avatar de Mors).
- `SHADOW_GUARDIAN`, `CITY_CORRUPTED`, `LESSER_AVATAR` (corrompido com HP 70, XP 80, falas do console), `THE_REMNANT`, `MORS_AVATAR` — números e falas de `combat.py`; `pacifyLines`/`attackLine` do capítulo de cada um.
- Padrões novos: `ESPIRAL` (braços girando a partir do centro-topo), `LAMINAS` (diagonais vindas dos cantos), `LAGRIMAS` (gotas lentas), `GRADE` (linhas horizontais e verticais com fresta). Cada inimigo usa 2–4 padrões.
- `playerAction` adiciona ao log `+N XP` e `EVOLUÇÃO DE SISTEMA — Nível N` quando sobe de nível; sem XP se `!givesExp`.

- [ ] Testes: números de cada inimigo; Mors não dá XP; pacificar o Espectro registra a mensagem de nível; cada padrão novo termina em `duration` e gera projéteis. RED → GREEN. Commit.

### Task 3: Roteiros dos capítulos 2 a 5 e finais

**Files:** Create `src/story/chapter2.ts` … `chapter5.ts`, `src/story/index.ts` (`SCRIPTS: Record<number, Script>`, `CHAPTER_TITLES`, `LAST_CHAPTER = 5`); Modify `src/story/chapter1.ts` (flags `specter_pacified`/`specter_defeated`); Test `src/story/chapters.test.ts`

- Capítulo 5 termina em rótulos `fim_destruicao` / `fim_aceitacao` / `fim_fusao`, cada um com `set {ending}` e `{ kind: 'end', chapter: 5 }`.
- [ ] Testes para cada capítulo: todo salto existe; todo rótulo termina em saída; percorrer com a opção 0 e `pacified` chega ao `end`; derrota volta para antes da luta. Capítulo 5: com moral destruição → `ending = destruction`; aceitação → `acceptance`; fusão com Humanidade 55 → destruction, 35 → acceptance, 50 → fusion. RED → GREEN. Commit.

### Task 4: App encadeia capítulos e tela final

**Files:** Modify `src/App.tsx`, `src/ui/MenuScreens.tsx`, `src/ui/BattleScreen.tsx`, `src/ui/SceneScreen.tsx`, `src/ui/portraits.ts`; Test `src/ui/screens.test.tsx`

- Fim de capítulo < 5: "Continuar para o Capítulo N+1" → `story = { ...story, chapter: n+1, cursor: start }`.
- Fim do 5: tela final com o nome do final, Humanidade, pacificados/derrotados, "Verdade descoberta" e as linhas "Jogue novamente…" do console; botões "Créditos" e "Voltar ao título".
- Retratos de Kael, Lyra e Mors nas falas; retrato do inimigo na luta.
- Luta: depois da ação decisiva, um só "Continuar" até o resultado (minor adiado do cap. 1).
- [ ] Testes: save no `end` do cap. 1 → botão leva ao título do cap. 2; tela final mostra o final e as estatísticas. RED → GREEN. Commit.

### Task 5: Acabamento do desvio

**Files:** Modify `src/ui/DodgeBox.tsx`; Test `src/ui/dodgeKeys.test.ts`

- Extrair `heldKeys` para um módulo testável: `blur` limpa as teclas; espaço é engolido durante o desvio.
- [ ] Testes RED → GREEN. Commit.

### Task 6: Publicar

- [ ] README (capítulos todos "Navegador e console"), revisão final do branch com revisor novo, PR, prévia, merge após o João aprovar.
