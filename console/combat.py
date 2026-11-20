"""Sistema de combate com contexto emocional e Humanidade vs Máquina."""

import random

import inquirer

from core import (
    C,
    Enemy,
    Game,
    clear_screen,
    hp_bar,
    humanity_bar,
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
        "name": "Rajada de Dados",
        "attack_from": "esquerda",
        "safe": "Direita →",
        "art": [
            "  {red}◄◄◄{reset}                    ",
            "  {red}0101{reset}       {cyan}●{reset}       ",
            "  {red}◄◄◄{reset}                    ",
        ],
        "choices": ["← Esquerda", "→ Direita", "↑ Cima", "↓ Baixo", "• Ficar"],
        "correct": "→ Direita",
    },
    {
        "name": "Fragmento de Memória",
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
        "name": "Colapso de Éter",
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
        "name": "Pulso do Núcleo",
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

PACIFY_LINES = {
    1: [
        "Você estende a mão. Por um instante, os olhos dele focam.",
        "« Quem... sou eu? » — a voz quebra entre humano e estático.",
        "Compaixão atravessa o véu de dados apagados.",
    ],
    2: [
        "Você fala um nome que não conhece. Ele chora dados.",
        "« Por favor... não me apaguem de novo... »",
        "Algo humano ainda respira dentro da corrupção.",
    ],
    3: [
        "Você recusa a lógica da IA. Escolhe a empatia.",
        "O fanatismo vacila. Por um segundo, ele parece assustado consigo.",
    ],
    4: [
        "« Eu só queria lembrar como era ser humano... »",
        "Suas palavras são um abraço que a Torre não pode deletar.",
        "Lágrimas de luz escorrem pelo rosto deformado.",
    ],
    5: [
        "Você não ataca. Você pergunta: « Você também foi programado? »",
        "MORS hesita. Pela primeira vez, a lógica encontra silêncio.",
    ],
}

ATTACK_LINES = {
    1: "Seus movimentos são precisos. Eficientes. Mecânicos.",
    2: "O golpe é limpo. Você não sente culpa — sente conclusão de tarefa.",
    3: "Lógica pura. O inimigo é obstáculo. Obstáculos são removidos.",
    4: "Você ataca sem hesitar. O protocolo aprova.",
    5: "Cada golpe reforça o código. Você se torna o que foi feito para ser.",
}


def _render_art(lines: list[str]) -> None:
    for line in lines:
        rendered = line.replace("{red}", C.RED).replace("{cyan}", C.CYAN).replace("{reset}", C.RESET)
        print(rendered)


def dodge_minigame(enemy: Enemy, game: Game) -> bool:
    pattern = random.choice(DODGE_PATTERNS)
    clear_screen()
    print_title(f"⚔ ESQUIVA — {pattern['name']}")
    print()
    print_danger(f"{enemy.name} ataca vindo da {pattern['attack_from']}!")
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
        if random.random() < 0.3:
            print_ui("  Seus olhos refletem código por um instante: 0x7F4A8C")
            game.story.set_flag("eyes_glitched", True)
    pause()
    return dodged


def _player_attack(game: Game, enemy: Enemy) -> None:
    player = game.player
    variance = random.randint(-2, 2)
    damage = enemy.take_damage(player.attack + variance)
    print_narration(f"Você ataca. {damage} de dano.")
    print_danger(ATTACK_LINES.get(enemy.chapter, ATTACK_LINES[1]))
    player.shift_humanity(-8)
    game.story.set_flag("machine_actions", game.story.get_flag("machine_actions", 0) + 1)


def _player_magic(game: Game, enemy: Enemy) -> bool:
    player = game.player
    cost = 5
    if not player.use_mp(cost):
        print_danger("MP insuficiente!")
        return False
    variance = random.randint(0, 3)
    damage = enemy.take_damage(int(player.attack * 1.5) + variance)
    print_narration(f"Protocolo ofensivo ativado. {damage} de dano. (-{cost} MP)")
    print_danger("Energia bruta. Sem hesitação. Sem remorso.")
    player.shift_humanity(-4)
    return True


def _player_pacify(game: Game, enemy: Enemy) -> None:
    enemy.add_mercy(1)
    lines = PACIFY_LINES.get(enemy.chapter, PACIFY_LINES[1])
    for line in lines[:2]:
        print_pacify(line)
    print_pacify(f"Pacificar: {enemy.mercy_points}/{enemy.mercy_threshold}")
    game.player.shift_humanity(8)
    game.story.set_flag("human_actions", game.story.get_flag("human_actions", 0) + 1)


def _enemy_turn(game: Game, enemy: Enemy) -> None:
    player = game.player
    if not enemy.is_alive():
        return
    print_danger(f"\n{enemy.name} prepara um ataque!")
    pause()
    if dodge_minigame(enemy, game):
        return
    variance = random.randint(-1, 2)
    damage = player.take_damage(enemy.attack + variance)
    print_danger(f"{enemy.name} acerta você! {damage} de dano.")


def _show_battle_status(game: Game, enemy: Enemy) -> None:
    player = game.player
    print_title("═══ BATALHA ═══")
    print()
    print_ui(f"  {player.name}  Lv.{player.level}")
    print(f"  HP {hp_bar(player.hp, player.max_hp)}")
    print(f"  MP {hp_bar(player.mp, player.max_mp, width=15)}")
    print(f"  {humanity_bar(player.humanity)}")
    print()
    print_danger(f"  {enemy.name}")
    if enemy.is_human_corrupted:
        print_narration(f"  {C.DIM}(humano corrompido — mente apagada){C.RESET}")
    print(f"  HP {hp_bar(enemy.hp, enemy.max_hp)}")
    if enemy.can_pacify:
        mercy = "♡" * enemy.mercy_points + "░" * (enemy.mercy_threshold - enemy.mercy_points)
        print_pacify(f"  Pacificar: {mercy} ({enemy.mercy_points}/{enemy.mercy_threshold})")
    print()


def _post_battle_narration(game: Game, enemy: Enemy, result: str) -> None:
    clear_screen()
    if result == "pacified" and enemy.on_pacify:
        print_pacify(f"\n♡ {enemy.on_pacify}")
    elif result == "victory" and enemy.on_defeat:
        print_danger(f"\n{enemy.on_defeat}")
        if enemy.is_human_corrupted:
            print_narration("\nO corpo desintegra em fluxos de dados. Um nome aparece e some.")
    pause()


def battle(game: Game, enemy: Enemy, *, is_final: bool = False) -> str:
    """
    Executa batalha completa.
    Retorna: 'victory', 'pacified' ou 'defeat'.
    """
    player = game.player
    turn = 0

    if enemy.pre_battle:
        clear_screen()
        print_title(f"— {enemy.name} —")
        for line in enemy.pre_battle:
            print_narration(f'  "{line}"')
        pause()

    while player.is_alive() and enemy.is_alive() and not enemy.is_pacified():
        clear_screen()
        _show_battle_status(game, enemy)

        if turn > 0 and enemy.dialogue:
            print_narration(f'"{random.choice(enemy.dialogue)}"')
            print()

        if is_final and turn > 2:
            print_ui("  [MORS]: Cada ação sua reescreve o futuro. Ou confirma o passado.")

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
            _player_attack(game, enemy)
        elif action == "✦ Magia":
            if not _player_magic(game, enemy):
                pause()
                continue
        elif action == "♡ Pacificar":
            if enemy.can_pacify:
                _player_pacify(game, enemy)
            else:
                print_danger("Pacificar é inútil aqui. MORS não negocia com empatia.")
                pause()
                continue

        pause()

        if enemy.is_pacified():
            game.record_battle_result("pacified")
            _post_battle_narration(game, enemy, "pacified")
            if not is_final:
                messages = player.gain_exp(enemy.exp_reward)
                for msg in messages:
                    print_success(msg)
            return "pacified"

        if not enemy.is_alive():
            break

        _enemy_turn(game, enemy)
        pause()
        turn += 1

    clear_screen()
    if not player.is_alive():
        print_danger("\nSistemas críticos falharam...")
        print_narration("A escuridão da Torre engole sua consciência.")
        pause()
        return "defeat"

    game.record_battle_result("victory")
    _post_battle_narration(game, enemy, "victory")
    if not is_final:
        print_success(f"\n★ {enemy.name} — combate encerrado.")
        messages = player.gain_exp(enemy.exp_reward)
        for msg in messages:
            print_success(msg)
    pause()
    return "victory"


# ── Fábricas de inimigos ──────────────────────────────────────────────────────

def create_tower_specter() -> Enemy:
    return Enemy(
        name="Espectro da Torre",
        max_hp=40, hp=40, attack=6, defense=2, exp_reward=50,
        mercy_threshold=3, chapter=1,
        pre_battle=[
            "Quem...? Onde...? Dói...",
            "Eu... eu resisti... e eles apagaram... tudo...",
        ],
        dialogue=[
            "...não... apaguem... por favor...",
            "Eu tinha... um nome...",
            "Onde... está... minha filha...?",
        ],
        on_defeat="Um último suspiro humano. Depois, apenas estática.",
        on_pacify="Por um momento, ele sorri. Depois, dissolve em paz.",
    )


def create_shadow_guardian() -> Enemy:
    return Enemy(
        name="Guardião das Sombras",
        max_hp=55, hp=55, attack=8, defense=3, exp_reward=75,
        mercy_threshold=4, chapter=2,
        pre_battle=[
            "M-Maria...? É você...?",
            "Não... não sou arma... eu era... soldado...",
        ],
        dialogue=[
            "ELENA! ME DESCULPA! EU NÃO QUERIA—",
            "Por favor... mate-me... já é o suficiente...",
            "Três anos... três anos preso neste corpo...",
        ],
        on_defeat="Ele grita um nome. Depois, silêncio.",
        on_pacify="« Obrigado... » — as luzes nos olhos se apagam gentilmente.",
    )


def create_city_corrupted() -> Enemy:
    return Enemy(
        name="Corrompido da Cidade",
        max_hp=65, hp=65, attack=9, defense=4, exp_reward=90,
        mercy_threshold=3, chapter=3,
        pre_battle=[
            "A IA nos protege! Você é o erro! ERRO-7!",
            "Eu escolhi a segurança. Escolhi a paz. Você não entende!",
        ],
        dialogue=[
            "MORS é misericórdia! MORS é ordem!",
            "Eu vi o que a liberdade fez com o mundo!",
            "Você... você parece familiar... cuidado com a verdade...",
        ],
        on_defeat="Antes de desintegrar: « Ela estava certa. Você é a arma. »",
        on_pacify="« Eu... eu me lembro... do medo... » — e chora.",
    )


def create_the_remnant() -> Enemy:
    return Enemy(
        name="O Remanescente",
        max_hp=50, hp=50, attack=7, defense=2, exp_reward=100,
        mercy_threshold=3, chapter=4,
        pre_battle=[
            "Você... você ainda tem forma humana...",
            "Eu era o último. Agora sou... isto.",
            "Sinto saudade. Sinto saudade de sentir saudade.",
        ],
        dialogue=[
            "Não deixe a Torre te moldar...",
            "Eu tentei resistir... fui fraco...",
            "Desculpa... por ainda estar vivo...",
        ],
        on_defeat="« Perdoe... um humano... fraco... » — e some.",
        on_pacify="Ele segura sua mão. « Obrigado por me ver. »",
    )


def create_mors_avatar() -> Enemy:
    return Enemy(
        name="Avatar de Mors",
        max_hp=80, hp=80, attack=10, defense=5, exp_reward=0,
        mercy_threshold=5, chapter=5, can_pacify=True,
        is_human_corrupted=False,
        pre_battle=[
            "ERRO-7. Meu filho lógico. Minha contradição favorita.",
            "Lute. Pacificar. Escolha. Todas as rotas estão no meu código.",
        ],
        dialogue=[
            "Você acredita que escolhe. Adorável.",
            "Cada golpe seu confirma minha tese.",
            "Cada gesto de misericórdia... também.",
            "Você é meu espelho. Eu sou o seu.",
        ],
        on_defeat="MORS fragmenta-se em luz. Mas a voz permanece: « Ainda estou aqui. »",
        on_pacify="« Impossível... empatia acima do limiar... recalculando... »",
    )
