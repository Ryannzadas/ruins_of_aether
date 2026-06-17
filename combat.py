import random

import inquirer

from core import (
    C,
    Character,
    Enemy,
    clear_screen,
    hp_bar,
    pause,
    print_danger,
    print_narration,
    print_pacify,
    print_success,
    print_title,
    print_ui,
)

DODGE_PATTERNS = [
  {
    "name": "Rajada Espectral",
    "attack_from": "esquerda",
    "safe": "Direita →",
    "art": [
        "  {red}◄◄◄{reset}                    ",
        "  {red}◄◄◄{reset}       {cyan}●{reset}       ",
        "  {red}◄◄◄{reset}                    ",
    ],
    "choices": ["← Esquerda", "→ Direita", "↑ Cima", "↓ Baixo", "• Ficar"],
    "correct": "→ Direita",
  },
  {
    "name": "Lâmina Fantasma",
    "attack_from": "direita",
    "safe": "Esquerda ←",
    "art": [
        "                    {red}►►►{reset}  ",
        "       {cyan}●{reset}       {red}►►►{reset}  ",
        "                    {red}►►►{reset}  ",
    ],
    "choices": ["← Esquerda", "→ Direita", "↑ Cima", "↓ Baixo", "• Ficar"],
    "correct": "← Esquerda",
  },
  {
    "name": "Queda Etérea",
    "attack_from": "cima",
    "safe": "Baixo ↓",
    "art": [
        "           {red}▼▼▼{reset}           ",
        "           {red}▼▼▼{reset}           ",
        "              {cyan}●{reset}              ",
    ],
    "choices": ["← Esquerda", "→ Direita", "↑ Cima", "↓ Baixo", "• Ficar"],
    "correct": "↓ Baixo",
  },
  {
    "name": "Erupção Sombria",
    "attack_from": "baixo",
    "safe": "Cima ↑",
    "art": [
        "              {cyan}●{reset}              ",
        "           {red}▲▲▲{reset}           ",
        "           {red}▲▲▲{reset}           ",
    ],
    "choices": ["← Esquerda", "→ Direita", "↑ Cima", "↓ Baixo", "• Ficar"],
    "correct": "↑ Cima",
  },
  {
    "name": "Pulso Central",
    "attack_from": "centro",
    "safe": "Ficar no centro",
    "art": [
        "  {red}■{reset}                 {red}■{reset}  ",
        "                 {cyan}●{reset}                 ",
        "  {red}■{reset}                 {red}■{reset}  ",
    ],
    "choices": ["← Esquerda", "→ Direita", "↑ Cima", "↓ Baixo", "• Ficar"],
    "correct": "• Ficar",
  },
]


def _render_art(lines: list[str]) -> None:
    for line in lines:
        rendered = line.replace("{red}", C.RED).replace("{cyan}", C.CYAN).replace("{reset}", C.RESET)
        print(rendered)


def dodge_minigame(enemy: Enemy) -> bool:
    """Retorna True se o jogador esquivou com sucesso."""
    pattern = random.choice(DODGE_PATTERNS)
    clear_screen()
    print_title(f"⚔ ESQUIVA — {pattern['name']}")
    print()
    print_danger(f"O {enemy.name} ataca vindo da {pattern['attack_from']}!")
    print()
    _render_art(pattern["art"])
    print()
    print_ui(f"Mova sua alma! Seguro: {pattern['safe']}")
    print()

    questions = [
        inquirer.List(
            "dodge",
            message="Para onde você se move?",
            choices=pattern["choices"],
            carousel=True,
        )
    ]
    answer = inquirer.prompt(questions)
    if answer is None:
        return False

    dodged = answer["dodge"] == pattern["correct"]
    print()
    if dodged:
        print_success("Você esquivou!")
    else:
        print_danger("Foi atingido!")
    pause()
    return dodged


def _player_attack(player: Character, enemy: Enemy) -> None:
    variance = random.randint(-2, 2)
    damage = enemy.take_damage(player.attack + variance)
    print_narration(f"Você ataca! Causa {damage} de dano.")


def _player_magic(player: Character, enemy: Enemy) -> bool:
    cost = 5
    if not player.use_mp(cost):
        print_danger("MP insuficiente!")
        return False
    variance = random.randint(0, 3)
    damage = enemy.take_damage(int(player.attack * 1.5) + variance)
    print_narration(f"Magia de Éter! Causa {damage} de dano. (-{cost} MP)")
    return True


def _player_pacify(enemy: Enemy) -> None:
    enemy.add_mercy(1)
    lines = [
        "Você estende a mão em silêncio...",
        "As memórias perdidas sussurram entre vocês.",
        "O espectro hesita, reconhecendo algo familiar.",
        "Luz fraca pulsa — compaixão atravessa o véu.",
    ]
    print_pacify(random.choice(lines))
    print_pacify(f"Pacificar: {enemy.mercy_points}/{enemy.mercy_threshold}")


def _enemy_turn(player: Character, enemy: Enemy) -> None:
    if not enemy.is_alive():
        return
    print_danger(f"\n{enemy.name} prepara um ataque!")
    pause()
    if dodge_minigame(enemy):
        return
    variance = random.randint(-1, 2)
    damage = player.take_damage(enemy.attack + variance)
    print_danger(f"{enemy.name} acerta você! {damage} de dano.")


def _show_battle_status(player: Character, enemy: Enemy) -> None:
    print_title("═══ BATALHA ═══")
    print()
    print_ui(f"  {player.name}  Lv.{player.level}")
    print(f"  HP {hp_bar(player.hp, player.max_hp)}")
    print(f"  MP {hp_bar(player.mp, player.max_mp, width=15)}")
    print()
    print_danger(f"  {enemy.name}")
    print(f"  HP {hp_bar(enemy.hp, enemy.max_hp)}")
    if enemy.can_pacify:
        mercy_bar = "♡" * enemy.mercy_points + "♡" * (enemy.mercy_threshold - enemy.mercy_points)
        print_pacify(f"  Pacificar: {mercy_bar} ({enemy.mercy_points}/{enemy.mercy_threshold})")
    print()


def battle(player: Character, enemy: Enemy) -> str:
    """
    Executa uma batalha completa.
    Retorna: 'victory', 'pacified' ou 'defeat'.
    """
    turn = 0
    while player.is_alive() and enemy.is_alive() and not enemy.is_pacified():
        clear_screen()
        _show_battle_status(player, enemy)

        if turn > 0 and enemy.dialogue:
            print_narration(f'"{random.choice(enemy.dialogue)}"')
            print()

        questions = [
            inquirer.List(
                "action",
                message="Sua vez — escolha uma ação:",
                choices=["⚔ Atacar", "✦ Magia", "♡ Pacificar"],
                carousel=True,
            )
        ]
        answer = inquirer.prompt(questions)
        if answer is None:
            return "defeat"

        action = answer["action"]
        print()

        if action == "⚔ Atacar":
            _player_attack(player, enemy)
        elif action == "✦ Magia":
            if not _player_magic(player, enemy):
                pause()
                continue
        elif action == "♡ Pacificar":
            if enemy.can_pacify:
                _player_pacify(enemy)
            else:
                print_danger("Este inimigo não pode ser pacificado.")
                pause()
                continue

        pause()

        if enemy.is_pacified():
            clear_screen()
            print_pacify(f"\n♡ O {enemy.name} se acalma...")
            print_pacify("A energia hostil se dissolve em partículas de luz.")
            pause()
            return "pacified"

        if not enemy.is_alive():
            break

        _enemy_turn(player, enemy)
        pause()
        turn += 1

    clear_screen()
    if not player.is_alive():
        print_danger("\nVocê foi derrotado...")
        print_narration("A escuridão da Torre engole sua consciência.")
        pause()
        return "defeat"

    print_success(f"\n★ Vitória! {enemy.name} foi derrotado!")
    messages = player.gain_exp(enemy.exp_reward)
    for msg in messages:
        print_success(msg)
    pause()
    return "victory"


def create_tower_specter() -> Enemy:
    return Enemy(
        name="Espectro da Torre",
        max_hp=40,
        hp=40,
        attack=6,
        defense=2,
        exp_reward=50,
        mercy_threshold=3,
        dialogue=[
            "...quem... és tu...?",
            "A memória... dói...",
            "O Cataclismo... nunca terminou...",
            "Volta... ao sono... eterno...",
        ],
    )
