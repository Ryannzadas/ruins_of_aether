from dataclasses import dataclass, field
from typing import List, Dict
from enum import Enum
import json
import os

class ActionType(Enum):
    """Tipos de ações no combate"""
    ATTACK = "Atacar"
    MAGIC = "Magia"
    PACIFY = "Pacificar"
    DODGE = "Esquivar"

@dataclass
class Item:
    """Representa um item no inventário"""
    name: str
    description: str
    item_type: str  # weapon, armor, consumable, key
    value: int = 0

@dataclass
class Character:
    """Representa um personagem (jogador ou NPC)"""
    name: str
    hp: int
    max_hp: int
    mp: int
    max_mp: int
    attack: int = 10
    defense: int = 5
    level: int = 1
    exp: int = 0
    exp_to_level: int = 100
    inventory: List[Item] = field(default_factory=list)
    equipment: Dict[str, Item] = field(default_factory=dict)  # head, body, hands, legs
    
    def take_damage(self, damage: int) -> int:
        """Recebe dano e retorna dano real"""
        actual_damage = max(1, damage - self.defense)
        self.hp = max(0, self.hp - actual_damage)
        return actual_damage
    
    def heal(self, amount: int):
        """Recupera HP"""
        self.hp = min(self.max_hp, self.hp + amount)
    
    def use_mp(self, amount: int) -> bool:
        """Usa mana, retorna True se conseguiu"""
        if self.mp >= amount:
            self.mp -= amount
            return True
        return False
    
    def restore_mp(self, amount: int):
        """Recupera mana"""
        self.mp = min(self.max_mp, self.mp + amount)
    
    def is_alive(self) -> bool:
        """Verifica se está vivo"""
        return self.hp > 0
    
    def to_dict(self) -> dict:
        """Converte para dicionário (para save)"""
        return {
            'name': self.name,
            'hp': self.hp,
            'max_hp': self.max_hp,
            'mp': self.mp,
            'max_mp': self.max_mp,
            'attack': self.attack,
            'defense': self.defense,
            'level': self.level,
            'exp': self.exp,
            'exp_to_level': self.exp_to_level,
        }

@dataclass
class Enemy:
    """Representa um inimigo"""
    name: str
    hp: int
    max_hp: int
    attack: int
    defense: int
    exp_reward: int
    item_drops: List[Item] = field(default_factory=list)
    
    def take_damage(self, damage: int) -> int:
        """Recebe dano"""
        actual_damage = max(1, damage - self.defense)
        self.hp = max(0, self.hp - actual_damage)
        return actual_damage
    
    def is_alive(self) -> bool:
        return self.hp > 0

@dataclass
class DialogChoice:
    """Representa uma escolha de diálogo"""
    text: str
    next_dialog: str
    affects_story: bool = False

@dataclass
class Dialog:
    """Representa um diálogo com NPCs"""
    id: str
    speaker: str
    text: str
    choices: List[DialogChoice] = field(default_factory=list)
    is_end: bool = False

class Story:
    """Gerencia a história e progresso"""
    def __init__(self):
        self.current_chapter = 1
        self.current_area = "tower_start"
        self.story_flags = {}  # Flags para rastrear progresso narrativo
        self.character_met = set()  # Personagens conhecidos
        self.decisions = {}  # Registro de decisões importantes
        
        # Definir capítulos
        self.chapters = {
            1: "A Torre Inicial",
            2: "As Ruínas da Cidade",
            3: "O Santuário Antigo",
            4: "O Coração do Cataclismo",
            5: "Confronto Final"
        }
    
    def advance_chapter(self):
        """Avança para o próximo capítulo"""
        if self.current_chapter < 5:
            self.current_chapter += 1
    
    def set_flag(self, flag: str, value: bool = True):
        """Define uma flag de história"""
        self.story_flags[flag] = value
    
    def get_flag(self, flag: str) -> bool:
        """Obtém valor de uma flag"""
        return self.story_flags.get(flag, False)
    
    def to_dict(self) -> dict:
        """Converte para dicionário (para save)"""
        return {
            'current_chapter': self.current_chapter,
            'current_area': self.current_area,
            'story_flags': self.story_flags,
            'character_met': list(self.character_met),
            'decisions': self.decisions
        }

class Game:
    """Classe principal do jogo"""
    def __init__(self):
        self.player: Character = None
        self.story: Story = None
        self.allies: Dict[str, Character] = {}
        self.save_file = "save_game.json"
    
    def create_new_player(self, name: str) -> Character:
        """Cria um novo jogador"""
        player = Character(
            name=name,
            hp=100,
            max_hp=100,
            mp=50,
            max_mp=50,
            attack=10,
            defense=5,
            level=1,
            exp=0,
            exp_to_level=100
        )
        self.player = player
        self.story = Story()
        return player
    
    def save_game(self):
        """Salva o jogo"""
        if not self.player:
            return False
        
        save_data = {
            'player': self.player.to_dict(),
            'story': self.story.to_dict(),
        }
        
        try:
            with open(self.save_file, 'w') as f:
                json.dump(save_data, f, indent=2)
            return True
        except:
            return False
    
    def load_game(self) -> bool:
        """Carrega um jogo existente"""
        if not os.path.exists(self.save_file):
            return False
        
        try:
            with open(self.save_file, 'r') as f:
                save_data = json.load(f)
            
            # Reconstruir player
            player_data = save_data['player']
            self.player = Character(
                name=player_data['name'],
                hp=player_data['hp'],
                max_hp=player_data['max_hp'],
                mp=player_data['mp'],
                max_mp=player_data['max_mp'],
                attack=player_data['attack'],
                defense=player_data['defense'],
                level=player_data['level'],
                exp=player_data['exp'],
                exp_to_level=player_data['exp_to_level']
            )
            
            # Reconstruir story
            self.story = Story()
            story_data = save_data['story']
            self.story.current_chapter = story_data['current_chapter']
            self.story.current_area = story_data['current_area']
            self.story.story_flags = story_data['story_flags']
            self.story.character_met = set(story_data['character_met'])
            self.story.decisions = story_data['decisions']
            
            return True
        except:
            return False