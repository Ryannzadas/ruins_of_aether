import inquirer

from combat import battle, create_tower_specter
from core import (
    C,
    Game,
    clear_screen,
    pause,
    print_danger,
    print_narration,
    print_pacify,
    print_success,
    print_title,
    print_ui,
)


def _menu_choice(message: str, choices: list[str]) -> str | None:
    questions = [
        inquirer.List("choice", message=message, choices=choices, carousel=True)
    ]
    answer = inquirer.prompt(questions)
    return answer["choice"] if answer else None


def _slow_print(text: str, color: str = C.YELLOW) -> None:
    print(f"{color}{text}{C.RESET}")


def _dialogue(speaker: str, lines: list[str]) -> None:
    for line in lines:
        print_ui(f"\n[{speaker}]")
        print_narration(f'  "{line}"')
        pause()


# ── Capítulo 1: A Torre Inicial ───────────────────────────────────────────────

def chapter_1_awakening(game: Game) -> None:
    clear_screen()
    print_title("╔══════════════════════════════════════════╗")
    print_title("║     CAPÍTULO 1 — A TORRE INICIAL         ║")
    print_title("╚══════════════════════════════════════════╝")
    pause()

    clear_screen()
    _slow_print("...")
    pause()
    _slow_print("Você abre os olhos.")
    pause()
    _slow_print("Pedra fria sob suas costas. Ar úmido. Um zumbido distante.")
    pause()
    _slow_print("Não lembra de nada — nem de como chegou aqui.")
    pause()

    clear_screen()
    print_narration(
        "\nVocê está no interior de uma torre antiga. Runas desbotadas brilham "
        "fracamente nas paredes de pedra negra. Acima, uma escadaria espiral "
        "desaparece na escuridão. O silêncio é quebrado apenas pelo vento."
    )
    pause()

    game.story.set_flag("awakened", True)


def chapter_1_meet_kael(game: Game) -> None:
    clear_screen()
    print_narration(
        "\nAo subir os primeiros degraus, uma figura encapuzada surge das sombras. "
        "Armadura desgastada, olhar cansado — mas alerta."
    )
    pause()

    _dialogue("Kael", [
        "Pare aí, viajante. Ninguém entra na Torre sem propósito.",
        "Sou Kael, guardião deste lugar há... não sei mais quantos anos.",
        "Você não parece um invasor. Parece... perdido.",
        f"Como se chama? ...{game.player.name}? Mesmo sem memória, "
        "há algo em seus olhos que me diz que você não é comum.",
    ])

    game.story.set_flag("met_kael", True)


def chapter_1_cataclysm_choice(game: Game) -> None:
    clear_screen()
    _dialogue("Kael", [
        "Antes de prosseguir, preciso saber: você conhece o Cataclismo?",
        "Foi o dia em que o Éter — a energia que sustentava nosso mundo — "
        "se corrompeu. Cidades caíram. Mundos se desfizeram.",
        "Esta Torre é um dos últimos fragmentos do mundo antigo. "
        "E você... desapareceu aqui no dia do Cataclismo.",
    ])

    clear_screen()
    print_ui("\nComo você reage à revelação de Kael?")
    choice = _menu_choice(
        "Escolha sua resposta:",
        [
            "Perguntar a verdade sobre o Cataclismo",
            "Duvidar das palavras de Kael",
            "Ficar em silêncio, absorvendo tudo",
        ],
    )

    if choice is None:
        choice = "Ficar em silêncio, absorvindo tudo"

    if "verdade" in choice:
        game.story.set_flag("cataclysm_choice", "truth")
        _dialogue("Kael", [
            "Coragem. Poucos querem saber a verdade.",
            "O Cataclismo não foi um acidente. Alguém — ou algo — "
            "quebrou o selo do Éter Primordial.",
            "As Ruínas de Éter são tudo o que restou. E esta Torre... "
            "guarda segredos que nem eu compreendo totalmente.",
        ])
        _dialogue("Você", [
            "Então preciso descobrir o que aconteceu comigo.",
            "Se desapareci aqui, talvez minhas memórias estejam nesta Torre.",
        ])
    elif "Duvidar" in choice:
        game.story.set_flag("cataclysm_choice", "doubt")
        _dialogue("Kael", [
            "Desconfiança é sabedoria nestes tempos.",
            "Não peço que acredite em mim. Peço apenas que observe.",
            "A Torre não mente — ela mostra o que foi, não o que queremos ver.",
        ])
        print_narration("\nKael cruza os braços, mas não parece ofendido.")
        pause()
    else:
        game.story.set_flag("cataclysm_choice", "silence")
        _dialogue("Kael", [
            "...",
            "O silêncio também é uma resposta.",
            "Muitos que acordaram nesta Torre não conseguiram falar.",
            "Talvez suas memórias voltem quando estiver pronto.",
        ])

    game.story.set_flag("learned_cataclysm", True)


def chapter_1_specter_battle(game: Game) -> str:
    clear_screen()
    print_danger("\nUm grito etéreo ecoa pelas paredes da Torre!")
    pause()

    print_narration(
        "\nDas sombras entre os degraus, uma forma translúcida emerge — "
        "um Espectro da Torre, alma presa desde o Cataclismo."
    )
    pause()

    _dialogue("Kael", [
        "Cuidado! Espectros são restos de quem pereceu no Cataclismo.",
        "Você pode lutar... ou tentar pacificá-lo. A escolha é sua.",
        "Lembre-se: na escuridão, mova-se com sabedoria. "
        "Quando o espectro atacar, escolha a direção certa para esquivar.",
    ])

    specter = create_tower_specter()
    result = battle(game.player, specter)

    if result == "defeat":
        game.story.set_flag("specter_result", "defeat")
        return "defeat"

    game.story.set_flag("specter_result", result)
    if result == "pacified":
        game.story.set_flag("specter_pacified", True)
        game.player.gain_exp(50)
    else:
        game.story.set_flag("specter_defeated", True)

    return result


def chapter_1_conclusion(game: Game) -> None:
    clear_screen()
    result = game.story.get_flag("specter_result")

    if result == "pacified":
        _dialogue("Kael", [
            "Incrível... você pacificou o espectro.",
            "Não vi isso em décadas. Há compaixão em você — "
            "algo que este mundo perdeu há muito tempo.",
            "Talvez você seja a chave que estávamos esperando.",
        ])
        print_pacify("\n♡ Kael olha para você com um respeito renovado.")
    elif result == "victory":
        _dialogue("Kael", [
            "Você lutou bem. O espectro era forte.",
            "Mas destruí-lo... as almas presas merecem descanso, não aniquilação.",
            "Ainda assim, sobreviver aqui exige força. E você a tem.",
        ])
        print_narration("\nKael assente, pensativo.")
    else:
        return

    pause()

    choice = game.story.get_flag("cataclysm_choice", "silence")
    if choice == "truth":
        extra = "Sua sede de verdade combina com sua força."
    elif choice == "doubt":
        extra = "Sua cautela o servirá bem nos andares superiores."
    else:
        extra = "Seu silêncio guarda mais do que mil palavras."

    clear_screen()
    _dialogue("Kael", [
        extra,
        "O primeiro andar está seguro por agora. Mas a Torre tem muitos segredos.",
        "Descanse. Amanhã, subiremos mais alto — se você estiver pronto.",
        "Lyra, a arqueóloga, está nos níveis superiores. Talvez ela saiba mais.",
        "E há rumores sobre... Mors. Uma entidade que ninguém ousa nomear em voz alta.",
    ])

    clear_screen()
    print_success("\n★ Capítulo 1 concluído: A Torre Inicial")
    print_narration(
        "\nVocê olha pela janela em arco. Além das ruínas, o céu é cinza — "
        "o Éter corrompido ainda paira sobre o mundo. Mas pela primeira vez, "
        "há um propósito em seus passos."
    )
    pause()

    game.story.set_flag("chapter1_complete", True)
    game.story.current_chapter = 2
    game.save()
    print_success("\nProgresso salvo automaticamente.")


def run_chapter_1(game: Game) -> bool:
    """Executa o Capítulo 1 completo. Retorna False se o jogador morrer."""
    chapter_1_awakening(game)
    chapter_1_meet_kael(game)
    chapter_1_cataclysm_choice(game)
    result = chapter_1_specter_battle(game)
    if result == "defeat":
        return False
    chapter_1_conclusion(game)
    return True


# ── Placeholders dos capítulos 2-5 ────────────────────────────────────────────

CHAPTER_PLACEHOLDERS = {
    2: ("Os Arquivos de Lyra", "Lyra, a arqueóloga, guarda registros do mundo antigo..."),
    3: ("O Éter Corrompido", "Fragmentos de energia instável permeiam os andares superiores..."),
    4: ("Ecos de Mors", "Uma presença antiga observa cada passo seu..."),
    5: ("O Topo da Torre", "O segredo do Cataclismo aguarda no último andar..."),
}


def run_placeholder_chapter(chapter: int) -> None:
    title, desc = CHAPTER_PLACEHOLDERS.get(
        chapter, (f"Capítulo {chapter}", "Conteúdo em desenvolvimento...")
    )
    clear_screen()
    print_title(f"╔══════════════════════════════════════════╗")
    print_title(f"║  CAPÍTULO {chapter} — {title:<24} ║")
    print_title(f"╚══════════════════════════════════════════╝")
    print_narration(f"\n{desc}")
    print_ui("\n[ Este capítulo será implementado em uma atualização futura. ]")
    pause()
