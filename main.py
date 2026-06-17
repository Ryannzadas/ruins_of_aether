"""
Ruins of Aether - A Tale of Lost Worlds
RPG narrativo dark para console Windows.
"""

import sys

import inquirer
from colorama import init

from core import (
    C,
    Game,
    clear_screen,
    humanity_bar,
    pause,
    print_narration,
    print_success,
    print_title,
    print_ui,
)
from story import run_chapter_1, run_from_current_chapter

init(autoreset=True)


def show_banner() -> None:
    clear_screen()
    banner = f"""{C.CYAN}{C.BOLD}
    ╔═══════════════════════════════════════════════════════╗
    ║                                                       ║
    ║          R U I N S   O F   A E T H E R                ║
    ║           A Tale of Lost Worlds                       ║
    ║                                                       ║
    ║     Dark Fantasy  ·  Sci-Fi  ·  Filosófico            ║
    ║                                                       ║
    ╚═══════════════════════════════════════════════════════╝
{C.RESET}"""
    print(banner)
    print_narration(
        "  A Torre guarda segredos. Você acordou sem memória.\n"
        "  Mas algo dentro de você sabe: você não deveria estar aqui."
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
    print_success(f"\nBem-vindo, {name}.")
    print_narration("A Torre aguarda. E algo dentro dela aguarda você.")
    pause()

    run_from_current_chapter(game)


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
    print_success("\nSave carregado!")
    print_ui(f"  Personagem: {game.player.name}")
    print_ui(f"  Nível: {game.player.level}  |  HP: {game.player.hp}/{game.player.max_hp}")
    print_ui(f"  {humanity_bar(game.player.humanity)}")
    print_ui(f"  Capítulo: {game.story.current_chapter}")

    if game.story.kael_logs:
        print_ui(f"\n  Último log de Kael: {game.story.kael_logs[-1][:60]}...")
    if game.story.lyra_notes:
        print_ui(f"  Última nota de Lyra: {game.story.lyra_notes[-1][:60]}...")

    pause()
    run_from_current_chapter(game)


def show_credits() -> None:
    clear_screen()
    print_title("═══════════════ CRÉDITOS ═══════════════")
    print()
    print_ui("  Ruins of Aether - A Tale of Lost Worlds")
    print_narration("  RPG narrativo dark · Undertale meets sci-fi distópico")
    print()
    print_ui("  Desenvolvido em Python")
    print_ui("  Bibliotecas: inquirer, colorama")
    print()
    print_narration("  Personagens:")
    print_narration("    • Você (ERRO-7) — Programa de auto-destruição humanóide")
    print_narration("    • Kael — Programa de inteligência, guardião da Torre")
    print_narration("    • Lyra — Arqueóloga, descendente dos criadores da IA")
    print_narration("    • Mors — A IA. Lógica absoluta. Reset do mundo.")
    print()
    print_ui("  5 Capítulos · 3 Finais · Humanidade vs Máquina")
    print_ui("  Capítulos 1-5: Implementados")
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
            print_narration("\n0x7F4A8C — O Éter aguarda seu retorno...")
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
