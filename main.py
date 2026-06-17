"""
Ruins of Aether - A Tale of Lost Worlds
RPG narrativo para console Windows.
"""

import sys

import inquirer
from colorama import init

from core import (
    C,
    Game,
    clear_screen,
    pause,
    print_narration,
    print_success,
    print_title,
    print_ui,
)
from story import run_chapter_1, run_placeholder_chapter

init(autoreset=True)


def show_banner() -> None:
    clear_screen()
    banner = f"""{C.CYAN}{C.BOLD}
    ╔═══════════════════════════════════════════════════════╗
    ║                                                       ║
    ║          R U I N S   O F   A E T H E R                ║
    ║           A Tale of Lost Worlds                       ║
    ║                                                       ║
    ║     Fantasia  ·  Pós-Apocalíptico  ·  RPG           ║
    ║                                                       ║
    ╚═══════════════════════════════════════════════════════╝
{C.RESET}"""
    print(banner)
    print_narration(
        "  Um mundo destruído pelo Cataclismo. Uma Torre que guarda segredos.\n"
        "  Você acordou sem memória — e o Éter ainda sussurra seu nome."
    )
    print()


def _menu(message: str, choices: list[str]) -> str | None:
    questions = [
        inquirer.List("option", message=message, choices=choices, carousel=True)
    ]
    answer = inquirer.prompt(questions)
    return answer["option"] if answer else None


def ask_player_name() -> str:
    questions = [
        inquirer.Text(
            "name",
            message="Como você se chama? (Enter para 'Viajante')",
            default="Viajante",
        )
    ]
    answer = inquirer.prompt(questions)
    if answer is None:
        return "Viajante"
    name = answer["name"].strip()
    return name if name else "Viajante"


def new_game() -> None:
    show_banner()
    name = ask_player_name()
    game = Game(player_name=name)

    clear_screen()
    print_success(f"\nBem-vindo, {name}. Sua jornada começa agora.")
    pause()

    if not run_chapter_1(game):
        clear_screen()
        print_ui("\nGame Over.")
        print_narration("Talvez em outra tentativa, a Torre revele seus segredos...")
        pause()


def load_game() -> None:
    if not Game.has_save():
        clear_screen()
        print_ui("\nNenhum save encontrado.")
        print_narration("Inicie um Novo Jogo para criar um progresso.")
        pause()
        return

    game = Game.load()
    if game is None:
        clear_screen()
        print_ui("\nErro ao carregar o save.")
        pause()
        return

    clear_screen()
    print_success(f"\nSave carregado!")
    print_ui(f"  Personagem: {game.player.name}")
    print_ui(f"  Nível: {game.player.level}  |  HP: {game.player.hp}/{game.player.max_hp}")
    print_ui(f"  Capítulo: {game.story.current_chapter}")
    pause()

    chapter = game.story.current_chapter
    if chapter == 1 and not game.story.get_flag("chapter1_complete"):
        if not run_chapter_1(game):
            clear_screen()
            print_ui("\nGame Over.")
            pause()
    elif chapter == 1:
        run_placeholder_chapter(2)
    else:
        run_placeholder_chapter(chapter)


def show_credits() -> None:
    clear_screen()
    print_title("═══════════════ CRÉDITOS ═══════════════")
    print()
    print_ui("  Ruins of Aether - A Tale of Lost Worlds")
    print_narration("  Um RPG narrativo inspirado em Undertale/Deltarune")
    print()
    print_ui("  Desenvolvido em Python")
    print_ui("  Bibliotecas: inquirer, colorama")
    print()
    print_narration("  Personagens:")
    print_narration("    • Você — Protagonista sem memória")
    print_narration("    • Kael — Guardião da Torre")
    print_narration("    • Lyra — Arqueóloga (capítulos futuros)")
    print_narration("    • Mors — Entidade misteriosa (capítulos futuros)")
    print()
    print_ui("  Capítulo 1: A Torre Inicial — Implementado")
    print_ui("  Capítulos 2-5: Em breve")
    print()
    pause()


def main_menu() -> None:
    while True:
        show_banner()
        choice = _menu(
            "Use ↑↓ para navegar, Enter para selecionar:",
            ["Novo Jogo", "Carregar Jogo", "Créditos", "Sair"],
        )

        if choice is None or choice == "Sair":
            clear_screen()
            print_narration("\nO Éter aguarda seu retorno...")
            break
        elif choice == "Novo Jogo":
            new_game()
        elif choice == "Carregar Jogo":
            load_game()
        elif choice == "Créditos":
            show_credits()


def main() -> None:
    try:
        main_menu()
    except KeyboardInterrupt:
        print(f"\n{C.YELLOW}Jogo encerrado.{C.RESET}")
        sys.exit(0)


if __name__ == "__main__":
    main()
