# Ruins of Aether no navegador — design

Aprovado pelo João em 20/11/2026 ("sim, pode ir").

## Intenção

O Ruins of Aether é um RPG narrativo de console em Python (5 capítulos, 3 finais, medidor Humanidade vs Máquina). O João quer que **outras pessoas joguem**. Hoje isso exige Python + `pip install`, e o "desvio" é escolher uma opção num menu. A versão web vira um link que qualquer um abre (PC ou celular) e o desvio vira habilidade de verdade.

## Objetivos

- Jogo inteiro no navegador, em português, jogável no PC (teclado) e no celular (toque).
- Mesma história do `master` (commit `0c580d7`): 5 capítulos, 5 lutas, 3 finais (destruição, aceitação, fusão), Humanidade decidindo o rumo. Do capítulo 1, aproveitar as cenas extras com o Kael do branch `2026-06-17-id6i` onde forem mais ricas.
- Luta por turnos: **Atacar**, **Magia**, **Pacificar**. No turno do inimigo, uma **caixa de desvio em tempo real** onde o jogador move o ERRO-7 entre projéteis. Cada inimigo tem padrões próprios.
- Atacar/Magia baixam a Humanidade, Pacificar sobe (mesmos valores do Python: −8, −4, +8).
- Save automático no navegador (localStorage), com "Continuar" no menu.
- Publicado na Vercel, com o selo "Desenvolvido por Hydra Labs" nos créditos.

## Não-objetivos

- Login, servidor, ranking online.
- Inglês (pode vir depois; o texto fica em arquivos de dados para facilitar).
- Exploração de mapa andando com personagem. O jogo é cenas + escolhas + lutas.

## Anti-objetivos

- Copiar o visual, sons ou personagens do Undertale. Ele é inspiração de gênero; a cara do jogo é própria (sci-fi sombrio, terminal corrompido).
- Desvio injusto no celular (controles que não respondem bem ao toque).
- Faixas de marquee/carrossel infinito.

## Abordagens consideradas

1. **Vite + React + TypeScript, desvio em canvas** — escolhida. Quase tudo é diálogo, escolhas e menus, que o React resolve bem; o canvas fica isolado só na caixa de desvio. Mesma stack dos outros projetos do João.
2. **Phaser** — ajuda só na caixa de desvio e piora o resto (texto, menus, acessibilidade).
3. **TypeScript sem framework** — leve, mas diálogos, save e telas dariam trabalho repetido.

## Decisões de como fazer

- O app web fica na raiz do repositório; o jogo em Python vai para `console/` e continua rodando.
- História como dados (cenas, falas, escolhas, flags) separada do motor.
- Lógica do jogo (personagem, inimigo, luta, Humanidade, finais) em TypeScript puro e testada; telas por cima.
- Antes das telas, uma rodada de mockups com 2 ou 3 direções visuais, inspiradas nos sites de referência do João; ele escolhe.

## Ordem de entrega

1. Mockups de direção visual → João escolhe.
2. Capítulo 1 completo e jogável no ar (diálogos, escolhas, a luta do Espectro com desvio real).
3. Capítulos 2 a 5 e os três finais.

## Fica para quem constrói

Balanceamento fino dos padrões de desvio, sons/música (só se houver fonte livre adequada), animações.
