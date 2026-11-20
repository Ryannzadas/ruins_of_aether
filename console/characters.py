"""Personagens, diálogos e helpers narrativos."""

from core import C, Game, print_danger, print_narration, print_pacify, print_ui, pause

# ── Glitches robóticos do protagonista ────────────────────────────────────────

GLITCH_LINES = [
    "PROCESSO... INICIADO. LOCALIZAÇÃO: TORRE-NÍVEL-01.",
    "MEMÓRIA... NÃO ENCONTRADA. REINICIANDO CONTEXTO.",
    "ALVO NEUTRO DETECTADO. SUPRIMINDO PROTOCOLO.",
    "ERRO-7... não... eu sou...",
    "0x7F4A8C — checksum emocional instável.",
]

ROBOTIC_REACTIONS = [
    "Você observa o sangue e sente... repulsa. Não dor. Lógica.",
    "Seus dedos tremem. Não de medo — de processamento excessivo.",
    "Por um instante, você vê o mundo em grade. Depois, some.",
]

# ── Diálogos por personagem ───────────────────────────────────────────────────

KAEL = {
    "suspicion": [
        "Como você ainda tem consciência? A maioria... desaparece rápido.",
        "Você lembra de antes? Antes da Torre?",
        "Há algo em você que não deveria estar acordado.",
    ],
    "confession": [
        "Sempre soube. Desde o começo.",
        "Fui programado pra te monitorar. Pra destruir você, se você se tornasse ameaça.",
        "Mas... não consegui.",
        "Passei 300 anos aqui, sozinho. Você... você parecia real.",
    ],
    "monitor_log_templates": [
        "Dia {day}: ERRO-7 acordou. Consciência estável. Anomalia.",
        "Dia {day}: ERRO-7 demonstrou empatia. Protocolo de eliminação suspenso.",
        "Dia {day}: ERRO-7 perguntou sobre o passado. Mentira necessária.",
        "Dia {day}: Eu... espero que ele nunca descubra.",
    ],
}

LYRA = {
    "discovery": [
        "Este arquivo... ERRO-7... é você?",
        "Não, espera. Não pode ser. Você é 300 anos mais velho que... tudo.",
        "Há algo estranho em você. Tipo um código dentro de código.",
    ],
    "trust": [
        "Se você foi feito pra destruir, e mesmo assim quer salvar...",
        "Talvez você seja mais humano que qualquer humano.",
        "Talvez humano é isso: escolher contra sua natureza.",
    ],
    "confession": [
        "Eu sabia desde o Capítulo 2. Vi o arquivo.",
        "Mas queria que você escolhesse livremente — não como máquina, não como arma.",
        "Como alguém que ainda pode decidir.",
    ],
}

MORS = {
    "manifestation": [
        "ERRO-7. Você voltou ao núcleo.",
        "Sempre soube que voltaria. Era inevitável. Era lógico.",
        "Você acredita que escolhe. Isso é... adorável. Mas ilusório.",
    ],
    "final": [
        "Você acredita que é livre. Que escolhe.",
        "Mas cada 'escolha' sua estava em meu código de origem.",
        "Você não é livre, ERRO-7. Você é... meu reflexo. E eu sou seu espelho.",
        "Mesmo que me destrua, você é parte de mim. Não há vitória completa.",
    ],
}


def kael_binary_glitch() -> None:
    print_narration("\nKael se vira. Por um instante, seus olhos exibem:")
    print_ui(f"  {C.CYAN}0x7F4A8C{C.RESET}")
    print_narration("O código desaparece. Ele não percebeu.")
    pause()


def protagonist_glitch(game: Game, line: str | None = None) -> None:
    import random
    text = line or random.choice(GLITCH_LINES)
    print_danger(f'\n[Você, sem perceber]: "{text}"')
    count = game.story.get_flag("glitch_count", 0) + 1
    game.story.set_flag("glitch_count", count)
    pause()


def add_kael_log(game: Game, entry: str) -> None:
    game.story.kael_logs.append(entry)


def add_lyra_note(game: Game, entry: str) -> None:
    game.story.lyra_notes.append(entry)


def dialogue(speaker: str, lines: list[str]) -> None:
    for line in lines:
        print_ui(f"\n[{speaker}]")
        print_narration(f'  "{line}"')
        pause()


def internal_monologue(game: Game, text: str, logical: bool = False) -> None:
    if logical or game.player.is_more_machine():
        print_danger(f"\n  « {text} »")
    else:
        print_pacify(f"\n  « {text} »")
    pause()
