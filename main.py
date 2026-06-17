import os
import sys
from colorama import Fore, Back, Style, init
import inquirer
from story import GameFlow
from core import Game

# Inicializa colorama para Windows
init(autoreset=True)

def clear_screen():
    """Limpa a tela do console"""
    os.system('cls' if os.name == 'nt' else 'clear')

def show_title():
    """Exibe o título do jogo"""
    print(Fore.CYAN + "=" * 70)
    print(Fore.CYAN + " " * 15 + "RUINS OF AETHER")
    print(Fore.CYAN + " " * 10 + "A Tale of Lost Worlds")
    print(Fore.CYAN + "=" * 70)
    print()

def main_menu():
    """Menu principal com navegação por setas"""
    clear_screen()
    show_title()
    
    questions = [
        inquirer.List('action',
            message=Fore.YELLOW + 'O que deseja fazer?',
            choices=[
                'Novo Jogo',
                'Carregar Jogo',
                'Créditos',
                'Sair'
            ],
            carousel=True
        )
    ]
    
    answers = inquirer.prompt(questions)
    return answers['action']

def credits():
    """Tela de créditos"""
    clear_screen()
    show_title()
    
    print(Fore.YELLOW + """
    ╔════════════════════════════════════╗
    ║           CRÉDITOS                 ║
    ╠════════════════════════════════════╣
    ║ Desenvolvido por: Ryan             ║
    ║ Gênero: Fantasia + Pós-Apocalíptico║
    ║ Inspiração: Undertale, Deltarune   ║
    ║                                    ║
    ║ Obrigado por jogar! ✨              ║
    ╚════════════════════════════════════╝
    """)
    
    input(Fore.CYAN + "Pressione ENTER para voltar...")

def new_game():
    """Inicia um novo jogo"""
    game_flow = GameFlow()
    game_flow.start_new_game()

def load_game():
    """Carrega um jogo existente"""
    clear_screen()
    show_title()
    
    game = Game()
    if game.load_game():
        print(Fore.GREEN + f"\n✓ Jogo carregado! Bem-vindo de volta, {game.player.name}!\n")
        print(Fore.YELLOW + f"Capítulo: {game.story.chapters[game.story.current_chapter]}")
        print(Fore.YELLOW + f"Level: {game.player.level} | HP: {game.player.hp}/{game.player.max_hp}")
        input(Fore.CYAN + "\nPressione ENTER para continuar...")
        # TODO: Continuar o jogo de onde parou
    else:
        print(Fore.RED + "\n✗ Nenhum jogo salvo encontrado!\n")
        input(Fore.CYAN + "Pressione ENTER para voltar...")

def main():
    """Loop principal do jogo"""
    running = True
    
    while running:
        choice = main_menu()
        
        if choice == 'Novo Jogo':
            new_game()
        elif choice == 'Carregar Jogo':
            load_game()
        elif choice == 'Créditos':
            credits()
        elif choice == 'Sair':
            clear_screen()
            print(Fore.YELLOW + "Até logo, viajante...\n")
            running = False
            break

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(Fore.RED + "\n\nJogo interrompido pelo usuário.")
        sys.exit(0)