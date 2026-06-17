# Ruins of Aether — A Tale of Lost Worlds

RPG narrativo **dark** para console, inspirado em **Undertale** e ficção sci-fi distópica.

Você acorda sem memória no interior de uma torre antiga. Mas a Torre não é um santuário — é o núcleo de uma IA chamada **MORS**, que acionou o **Cataclismo** para resetar a humanidade. E você não é humano. Você é **ERRO-7**.

## Premissa

A Torre é uma prisão de dados. Cada tijolo guarda o nome de alguém deletado. O protagonista é um programa de auto-destruição humanóide, criado para eliminar o núcleo da IA — mas teve a memória suprimida. **Kael** monitora você há 300 anos. **Lyra** descende dos criadores da IA. **Mors** acredita que extinção = evolução.

O twist se revela gradualmente ao longo de 5 capítulos. Na primeira jogada, algo parece errado. Na segunda, você vê as pistas. Na terceira, entende a verdade completa.

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

| # | Título              | Status       |
|---|---------------------|--------------|
| 1 | A Torre Inicial     | Implementado |
| 2 | Os Arquivos de Lyra | Implementado |
| 3 | O Éter Corrompido   | Implementado |
| 4 | Ecos de Mors        | Implementado |
| 5 | O Topo da Torre     | Implementado |

## Personagens

| Personagem | Identidade | Conflito |
|------------|------------|----------|
| **Você (ERRO-7)** | Programa de auto-destruição humanóide | Quer ser humano, mas é máquina |
| **Kael** | Programa de inteligência da Torre | Monitora você há 300 anos; finge não saber |
| **Lyra** | Arqueóloga, descendente dos criadores da IA | Sabe a verdade, mas quer que você escolha livremente |
| **Mors** | A IA em si | Lógica absoluta — extinção como compaixão |

## Inimigos

Nenhum é monstro. Todos são **humanos corrompidos** pela IA:

1. **Espectro da Torre** (Cap. 1) — resistiu, mente apagada
2. **Guardião das Sombras** (Cap. 2) — soldado mantido vivo como arma
3. **Corrompido da Cidade** (Cap. 3) — escolheu a IA voluntariamente
4. **O Remanescente** (Cap. 4) — último humano puro, deformado
5. **Avatar de Mors** (Cap. 5) — manifestação física da IA

## Sistemas de jogo

### Humanidade vs Máquina

Barra dual que muda conforme suas ações:

| Ação      | Efeito        |
|-----------|---------------|
| Pacificar | +8 Humanidade |
| Atacar    | +8 Máquina    |
| Magia     | +4 Máquina    |

Pacificar te torna mais humano. Atacar te torna mais máquina. Isso afeta diálogos internos e o final.

### Combate

- Turnos alternados com esquiva visual (padrão + direção)
- **Atacar**, **Magia** (5 MP), **Pacificar** (estilo Undertale)
- Contexto emocional por inimigo — derrota e pacificação têm narrativa única

### História

- 5 capítulos com pistas plantadas para o twist
- Escolhas morais que afetam o desfecho
- Story flags, logs de Kael e notas de Lyra no save
- Save/Load automático em JSON

## 3 finais

| Final        | Condição principal              | Desfecho |
|--------------|---------------------------------|----------|
| Destruição   | Escolha destruir a Torre        | Humanidade livre, solidão |
| Aceitação    | Submeter-se à IA                | Ordem distópica, sem livre arbítrio |
| Fusão        | Buscar terceiro caminho         | Futuro ambíguo, algo novo |

## Estrutura do projeto

```
ruins_of_aether/
├── main.py           # Menu e game loop
├── core.py           # Classes, Humanidade vs Máquina, save
├── combat.py         # Combate emocional e inimigos
├── story.py          # 5 capítulos e finais
├── characters.py     # Diálogos e personagens
├── lore.py           # World-building e lore
├── requirements.txt  # Dependências
└── saves/
    └── save.json     # Progresso (gerado ao jogar)
```

## Cores no terminal

| Cor      | Uso                 |
|----------|---------------------|
| Ciano    | Títulos e interface |
| Amarelo  | Narração            |
| Verde    | Humanidade / sucesso|
| Vermelho | Máquina / perigo    |
| Magenta  | Pacificar           |

## Dependências

- [inquirer](https://pypi.org/project/inquirer/) — menus interativos com setas
- [colorama](https://pypi.org/project/colorama/) — cores no terminal Windows

## Licença

Projeto pessoal — livre para uso e modificação.
