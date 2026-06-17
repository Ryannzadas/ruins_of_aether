"""Classes centrais do jogo Ruins of Aether."""

import json
import os
from dataclasses import dataclass, field
from typing import Any

SAVE_DIR = "saves"
SAVE_FILE = os.path.join(SAVE_DIR, "save.json")


# ── Cores (Colorama) ──────────────────────────────────────────────────────────

class C:
    CYAN = "\033[36m"
    YELLOW = "\033[33m"
    GREEN = "\033[32m"
    RED = "\033[31m"
    MAGENTA = "\033[35m"
    WHITE = "\033[37m"
    DIM = "\033[2m"
    BOLD = "\033[1m"
    RESET = "\033[0m"


def clear_screen() -> None:
    os.system("cls" if os.name == "nt" else "clear")


def pause(msg: str = "Pressione Enter para continuar...") -> None:
    input(f"{C.DIM}{msg}{C.RESET}")


def print_title(text: str) -> None:
    print(f"\n{C.CYAN}{C.BOLD}{text}{C.RESET}")


def print_narration(text: str) -> None:
    print(f"{C.YELLOW}{text}{C.RESET}")


def print_success(text: str) -> None:
    print(f"{C.GREEN}{text}{C.RESET}")


def print_danger(text: str) -> None:
    print(f"{C.RED}{text}{C.RESET}")


def print_pacify(text: str) -> None:
    print(f"{C.MAGENTA}{text}{C.RESET}")


def print_ui(text: str) -> None:
    print(f"{C.CYAN}{text}{C.RESET}")


def hp_bar(current: int, maximum: int, width: int = 20) -> str:
    maximum = max(maximum, 1)
    filled = int(width * current / maximum)
    bar = "█" * filled + "░" * (width - filled)
    color = C.GREEN if current > maximum * 0.5 else (
        C.YELLOW if current > maximum * 0.25 else C.RED
    )
    return f"{color}[{bar}] {current}/{maximum}{C.RESET}"


def humanity_bar(humanity: int, width: int = 20) -> str:
    """Barra dual: verde = humanidade, vermelho = máquina."""
    humanity = max(0, min(100, humanity))
    machine = 100 - humanity
    h_fill = int(width * humanity / 100)
    m_fill = width - h_fill
    green = f"{C.GREEN}{'█' * h_fill}{C.RESET}"
    red = f"{C.RED}{'█' * m_fill}{C.RESET}"
    return f"[{green}{red}] H:{humanity}% | M:{machine}%"


# ── Personagem ────────────────────────────────────────────────────────────────

@dataclass
class Character:
    name: str
    true_name: str = "ERRO-7"
    max_hp: int = 30
    hp: int = 30
    max_mp: int = 15
    mp: int = 15
    level: int = 1
    exp: int = 0
    attack: int = 8
    defense: int = 3
    humanity: int = 50
    inventory: list[str] = field(default_factory=lambda: ["Poção Menor"])

    EXP_TABLE = {1: 0, 2: 50, 3: 120, 4: 250, 5: 500, 6: 800}

    def is_alive(self) -> bool:
        return self.hp > 0

    def is_more_human(self) -> bool:
        return self.humanity >= 50

    def is_more_machine(self) -> bool:
        return self.humanity < 50

    def shift_humanity(self, delta: int) -> None:
        self.humanity = max(0, min(100, self.humanity + delta))
        if self.humanity > 70:
            self.attack = max(6, self.attack - 1) if delta > 0 else self.attack
            self.defense = min(8, self.defense + 1) if delta > 0 else self.defense
        if self.humanity < 30:
            self.attack = min(20, self.attack + 1) if delta < 0 else self.attack

    def take_damage(self, amount: int) -> int:
        actual = max(1, amount - self.defense)
        self.hp = max(0, self.hp - actual)
        return actual

    def heal(self, amount: int) -> None:
        self.hp = min(self.max_hp, self.hp + amount)

    def use_mp(self, amount: int) -> bool:
        if self.mp >= amount:
            self.mp -= amount
            return True
        return False

    def gain_exp(self, amount: int) -> list[str]:
        messages: list[str] = []
        self.exp += amount
        messages.append(f"+{amount} XP")
        while self.level < 6 and self.exp >= self.EXP_TABLE.get(self.level + 1, 9999):
            self.level += 1
            self.max_hp += 5
            self.hp = self.max_hp
            self.max_mp += 3
            self.mp = self.max_mp
            self.attack += 2
            self.defense += 1
            messages.append(f"EVOLUÇÃO DE SISTEMA — Nível {self.level}")
        return messages

    def to_dict(self) -> dict[str, Any]:
        return {
            "name": self.name,
            "true_name": self.true_name,
            "max_hp": self.max_hp,
            "hp": self.hp,
            "max_mp": self.max_mp,
            "mp": self.mp,
            "level": self.level,
            "exp": self.exp,
            "attack": self.attack,
            "defense": self.defense,
            "humanity": self.humanity,
            "inventory": self.inventory,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "Character":
        return cls(
            name=data["name"],
            true_name=data.get("true_name", "ERRO-7"),
            max_hp=data["max_hp"],
            hp=data["hp"],
            max_mp=data["max_mp"],
            mp=data["mp"],
            level=data["level"],
            exp=data["exp"],
            attack=data["attack"],
            defense=data["defense"],
            humanity=data.get("humanity", 50),
            inventory=data.get("inventory", []),
        )


# ── Inimigo ───────────────────────────────────────────────────────────────────

@dataclass
class Enemy:
    name: str
    max_hp: int
    hp: int
    attack: int
    defense: int
    exp_reward: int
    mercy_threshold: int = 3
    mercy_points: int = 0
    can_pacify: bool = True
    is_human_corrupted: bool = True
    pre_battle: list[str] = field(default_factory=list)
    dialogue: list[str] = field(default_factory=list)
    on_defeat: str = ""
    on_pacify: str = ""
    chapter: int = 1

    def is_alive(self) -> bool:
        return self.hp > 0

    def is_pacified(self) -> bool:
        return self.mercy_points >= self.mercy_threshold

    def take_damage(self, amount: int) -> int:
        actual = max(1, amount - self.defense)
        self.hp = max(0, self.hp - actual)
        return actual

    def add_mercy(self, points: int = 1) -> None:
        self.mercy_points += points


# ── História ──────────────────────────────────────────────────────────────────

class Story:
    def __init__(self) -> None:
        self.flags: dict[str, Any] = {}
        self.current_chapter: int = 1
        self.kael_logs: list[str] = []
        self.lyra_notes: list[str] = []
        self.enemies_killed: int = 0
        self.enemies_pacified: int = 0

    def set_flag(self, key: str, value: Any = True) -> None:
        self.flags[key] = value

    def get_flag(self, key: str, default: Any = False) -> Any:
        return self.flags.get(key, default)

    def knows_erro7(self) -> bool:
        return self.get_flag("found_erro7_file") or self.get_flag("lyra_knows_erro7")

    def player_knows_truth(self) -> bool:
        return self.get_flag("knows_true_function") or self.get_flag("found_erro7_file")

    def to_dict(self) -> dict[str, Any]:
        return {
            "flags": self.flags,
            "current_chapter": self.current_chapter,
            "kael_logs": self.kael_logs,
            "lyra_notes": self.lyra_notes,
            "enemies_killed": self.enemies_killed,
            "enemies_pacified": self.enemies_pacified,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "Story":
        story = cls()
        story.flags = data.get("flags", {})
        story.current_chapter = data.get("current_chapter", 1)
        story.kael_logs = data.get("kael_logs", [])
        story.lyra_notes = data.get("lyra_notes", [])
        story.enemies_killed = data.get("enemies_killed", 0)
        story.enemies_pacified = data.get("enemies_pacified", 0)
        return story


# ── Jogo ──────────────────────────────────────────────────────────────────────

class Game:
    def __init__(self, player_name: str = "Viajante") -> None:
        self.player = Character(name=player_name)
        self.story = Story()
        self.story.kael_logs.append(
            f"Monitoramento iniciado. Designação desconhecida: {player_name}. "
            "Aguardando anomalias."
        )

    def save(self) -> bool:
        os.makedirs(SAVE_DIR, exist_ok=True)
        data = {
            "player": self.player.to_dict(),
            "story": self.story.to_dict(),
            "meta": {
                "true_identity": self.player.true_name,
                "humanity": self.player.humanity,
                "kael_monitoring": self.story.kael_logs[-3:],
                "lyra_research": self.story.lyra_notes[-3:],
            },
        }
        with open(SAVE_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True

    @classmethod
    def load(cls) -> "Game | None":
        if not os.path.exists(SAVE_FILE):
            return None
        with open(SAVE_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        game = cls.__new__(cls)
        game.player = Character.from_dict(data["player"])
        game.story = Story.from_dict(data["story"])
        return game

    @staticmethod
    def has_save() -> bool:
        return os.path.exists(SAVE_FILE)

    def record_battle_result(self, result: str) -> None:
        if result == "victory":
            self.story.enemies_killed += 1
        elif result == "pacified":
            self.story.enemies_pacified += 1
