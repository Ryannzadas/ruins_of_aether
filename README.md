# Ruins of Aether — A Tale of Lost Worlds

RPG narrativo para console, inspirado em **Undertale** e **Deltarune**. Fantasia pós-apocalíptica em que você acorda sem memória no interior de uma torre antiga, guardada pelo enigmático Kael.

## Requisitos

- Python 3.8 ou superior
- Windows (console PowerShell ou CMD)

## Instalação

```bash
pip install -r requirements.txt
```

## Como jogar

```bash
python main.py
```

Use as **setas ↑↓** para navegar nos menus e **Enter** para confirmar.

## Menu principal

| Opção         | Descrição                          |
|---------------|------------------------------------|
| Novo Jogo     | Inicia uma nova jornada            |
| Carregar Jogo | Continua de um save existente      |
| Créditos      | Informações sobre o jogo           |
| Sair          | Encerra o programa                 |

## Capítulos

| # | Título              | Status        |
|---|---------------------|---------------|
| 1 | A Torre Inicial     | Implementado  |
| 2 | Os Arquivos de Lyra | Em breve      |
| 3 | O Éter Corrompido   | Em breve      |
| 4 | Ecos de Mors        | Em breve      |
| 5 | O Topo da Torre     | Em breve      |

## Personagens

- **Você** — Protagonista sem memória, desaparecido na Torre durante o Cataclismo
- **Kael** — Guardião veterano da Torre
- **Lyra** — Arqueóloga (capítulos futuros)
- **Mors** — Entidade misteriosa (capítulos futuros)

## Sistemas de jogo

### Personagem
- Nome, HP, MP, Level, Experiência
- Attack e Defense
- Inventário básico

### Combate
- Turnos alternados entre jogador e inimigo
- **Atacar** — dano físico
- **Magia** — dano aumentado (custa 5 MP)
- **Pacificar** — acalma o inimigo sem matá-lo (estilo Undertale)
- **Esquiva** — padrão visual + escolha de direção para evitar ataques
- Barras de HP coloridas e ganho de XP ao vencer

### História
- Diálogos com NPCs
- Escolhas que afetam a narrativa
- Story flags para rastrear progresso
- Save/Load automático em JSON

## Primeira batalha — Espectro da Torre

| Stat    | Valor |
|---------|-------|
| HP      | 40    |
| Attack  | 6     |
| Defense | 2     |
| XP      | 50    |

## Estrutura do projeto

```
ruins_of_aether/
├── main.py           # Menu e game loop
├── core.py           # Classes (Character, Enemy, Story, Game)
├── combat.py         # Sistema de combate
├── story.py          # Diálogos e eventos
├── requirements.txt  # Dependências
└── saves/
    └── save.json     # Progresso salvo (gerado ao jogar)
```

## Cores no terminal

| Cor     | Uso                    |
|---------|------------------------|
| Ciano   | Títulos e interface    |
| Amarelo | Narração               |
| Verde   | Sucesso                |
| Vermelho| Perigo                 |
| Magenta | Pacificar              |

## Dependências

- [inquirer](https://pypi.org/project/inquirer/) — menus interativos com setas
- [colorama](https://pypi.org/project/colorama/) — cores no terminal Windows

## Licença

Projeto pessoal — livre para uso e modificação.
