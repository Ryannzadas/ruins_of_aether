import random
import time
from typing import List, Tuple
from colorama import Fore, Back, Style
from core import Enemy, Character, ActionType
import inquirer

class CombatPattern:
    """Define um padrão de ataque do inimigo"""
    def __init__(self, name: str, description: str, damage: int, dodge_difficulty: int):
        self.name = name
        self.description = description
        self.damage = damage
        self.dodge_difficulty = dodge_difficulty  # 1-10, quanto maior, mais difícil
    
    def generate_visual(self) -> str:
        """Gera visualização ASCII do padrão"""
        patterns = {
            1: """
    ↓ ↓ ↓
    ↓ ↓ ↓
    ↓ ↓ ↓
            """,
            2: """
   ← → ← →
   ← → ← →
            """,
            3: """
    ◆ ◆ ◆
      ◆
    ◆ ◆ ◆
            """,
            4: """
    ⊕ . . ⊕
    . . . .
    ⊕ . . ⊕
            """
        }
        return patterns.get(random.randint(1, 4), "    ⊛ ⊛ ⊛")

class Combat:
    """Sistema de combate"""
    def __init__(self, player: Character, enemy: Enemy):
        self.player = player
        self.enemy = enemy
        self.turn = 0
        self.combat_log = []
    
    def add_log(self, message: str):
        """Adiciona mensagem ao log de combate"""
        self.combat_log.append(message)
    
    def show_status(self):
        """Exibe status de combate"""
        print(Fore.CYAN + "\n" + "=" * 60)
        print(Fore.YELLOW + f"{self.player.name}".ljust(20) + 
              Fore.RED + f"{self.enemy.name}".rjust(40))
        
        # HP do jogador
        player_hp_bar = self._create_hp_bar(self.player.hp, self.player.max_hp)
        print(Fore.GREEN + f"HP: {player_hp_bar} {self.player.hp}/{self.player.max_hp}")
        
        # HP do inimigo
        enemy_hp_bar = self._create_hp_bar(self.enemy.hp, self.enemy.max_hp)
        print(Fore.RED + f"HP: {enemy_hp_bar} {self.enemy.hp}/{self.enemy.max_hp}")
        
        print(Fore.CYAN + "=" * 60 + "\n")
    
    def _create_hp_bar(self, current: int, maximum: int) -> str:
        """Cria uma barra de HP visual"""
        bar_length = 20
        filled = int((current / maximum) * bar_length)
        bar = "█" * filled + "░" * (bar_length - filled)
        return f"[{bar}]"
    
    def player_turn(self) -> str:
        """Turno do jogador"""
        self.show_status()
        
        questions = [
            inquirer.List('action',
                message=f"{self.player.name}, escolha sua ação:",
                choices=[
                    ('Atacar - Causa dano direto', ActionType.ATTACK),
                    ('Magia - Poderosa mas custa MP', ActionType.MAGIC),
                    ('Pacificar - Reduz raiva do inimigo', ActionType.PACIFY),
                ],
                carousel=True
            )
        ]
        
        answers = inquirer.prompt(questions)
        action = answers['action']
        
        if action == ActionType.ATTACK:
            return self._perform_attack()
        elif action == ActionType.MAGIC:
            return self._perform_magic()
        elif action == ActionType.PACIFY:
            return self._perform_pacify()
    
    def _perform_attack(self) -> str:
        """Ataque normal"""
        damage = random.randint(
            int(self.player.attack * 0.8),
            int(self.player.attack * 1.2)
        )
        actual_damage = self.enemy.take_damage(damage)
        
        message = Fore.GREEN + f"\n⚔️  {self.player.name} atacou!\n"
        message += Fore.YELLOW + f"Causou {actual_damage} de dano!"
        
        self.add_log(f"{self.player.name} atacou")
        return message
    
    def _perform_magic(self) -> str:
        """Magia - requer mana"""
        if self.player.mp < 20:
            return Fore.RED + "\n❌ MP insuficiente! (custa 20 MP)\n"
        
        self.player.use_mp(20)
        damage = random.randint(25, 40)
        actual_damage = self.enemy.take_damage(damage)
        
        message = Fore.CYAN + f"\n✨ {self.player.name} lançou uma magia!\n"
        message += Fore.YELLOW + f"Causou {actual_damage} de dano!"
        
        self.add_log(f"{self.player.name} usou magia")
        return message
    
    def _perform_pacify(self) -> str:
        """Tenta pacificar o inimigo"""
        success_chance = random.randint(30, 60)  # 30-60% de sucesso
        
        if random.randint(1, 100) <= success_chance:
            self.enemy.hp = max(0, int(self.enemy.hp * 0.7))  # Reduz HP do inimigo
            message = Fore.MAGENTA + f"\n💚 {self.player.name} tentou pacificar {self.enemy.name}...\n"
            message += Fore.GREEN + f"Sucesso! {self.enemy.name} ficou menos agressivo!"
            self.add_log(f"{self.player.name} pacificou")
            return message
        else:
            message = Fore.MAGENTA + f"\n💔 {self.player.name} tentou pacificar {self.enemy.name}...\n"
            message += Fore.RED + f"Falhou! {self.enemy.name} ficou furioso!"
            self.add_log(f"{self.player.name} tentou pacificar mas falhou")
            return message
    
    def enemy_attack(self) -> str:
        """Ataque do inimigo - com padrão de esquiva"""
        print(Fore.RED + f"\n{self.enemy.name} vai atacar!\n")
        time.sleep(1)
        
        # Criar padrão de ataque
        pattern = CombatPattern(
            name=f"Ataque {random.choice(['Rápido', 'Poderoso', 'Caótico'])}",
            description="Esquive do ataque!",
            damage=random.randint(8, 15),
            dodge_difficulty=random.randint(1, 5)
        )
        
        # Mostrar padrão
        print(Fore.RED + pattern.description)
        print(pattern.generate_visual())
        print(Fore.YELLOW + "\nEscolha como esquivar:\n")
        
        dodge_options = [
            ('⬅️  Esquerda', 'left'),
            ('➡️  Direita', 'right'),
            ('⬆️  Cima', 'up'),
            ('⬇️  Baixo', 'down'),
        ]
        
        questions = [
            inquirer.List('dodge',
                message="Onde você se move?",
                choices=dodge_options,
                carousel=True
            )
        ]
        
        answers = inquirer.prompt(questions)
        player_dodge = answers['dodge']
        
        # Calcular se conseguiu esquivar
        correct_dodge = random.choice(['left', 'right', 'up', 'down'])
        
        if player_dodge == correct_dodge:
            message = Fore.GREEN + f"\n✨ {self.player.name} esquivou do ataque!\n"
            message += Fore.GREEN + "Nenhum dano recebido!"
            self.add_log(f"{self.player.name} esquivou do ataque")
            return message
        else:
            damage = self.player.take_damage(pattern.damage)
            message = Fore.RED + f"\n💥 {self.player.name} não conseguiu esquivar!\n"
            message += Fore.YELLOW + f"Recebeu {damage} de dano!"
            self.add_log(f"{self.player.name} recebeu {damage} de dano")
            return message
    
    def run_combat(self):
        """Executa um turno completo de combate"""
        print("\n" + Fore.YELLOW + "⚔️  COMBATE INICIADO! ⚔️\n")
        time.sleep(1)
        
        while self.player.is_alive() and self.enemy.is_alive():
            self.turn += 1
            print(Fore.CYAN + f"\n--- TURNO {self.turn} ---\n")
            
            # Turno do jogador
            print(self.player_turn())
            input(Fore.CYAN + "\nPressione ENTER para continuar...")
            
            if not self.enemy.is_alive():
                break
            
            # Turno do inimigo
            print(self.enemy_attack())
            input(Fore.CYAN + "\nPressione ENTER para continuar...")
        
        # Resultado do combate
        return self.show_result()
    
    def show_result(self):
        """Exibe resultado do combate"""
        print("\n" + Fore.CYAN + "=" * 60)
        
        if self.player.is_alive():
            print(Fore.GREEN + "🎉 VITÓRIA! 🎉\n")
            print(Fore.YELLOW + f"Recebeu {self.enemy.exp_reward} de experiência!")
            self.player.exp += self.enemy.exp_reward
            return True
        else:
            print(Fore.RED + "💀 DERROTA 💀\n")
            print(Fore.YELLOW + "Você caiu em combate...")
            return False
        
        print(Fore.CYAN + "=" * 60)