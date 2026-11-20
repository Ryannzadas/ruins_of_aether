"""Diálogos, eventos e os 5 capítulos de Ruins of Aether."""

import random

import inquirer

from characters import (
    KAEL,
    LYRA,
    MORS,
    add_kael_log,
    add_lyra_note,
    dialogue,
    internal_monologue,
    kael_binary_glitch,
    protagonist_glitch,
)
from combat import (
    battle,
    create_city_corrupted,
    create_mors_avatar,
    create_shadow_guardian,
    create_the_remnant,
    create_tower_specter,
)
from core import (
    C,
    Game,
    clear_screen,
    humanity_bar,
    pause,
    print_danger,
    print_narration,
    print_pacify,
    print_success,
    print_title,
    print_ui,
)
from lore import (
    CATACLYSM_LORE,
    CHAPTER_TITLES,
    DELETED_NAMES_SAMPLE,
    ERRO7_FILE,
    TOWER_LORE,
)


def _menu_choice(message: str, choices: list[str]) -> str | None:
    questions = [
        inquirer.List("choice", message=message, choices=choices, carousel=True)
    ]
    answer = inquirer.prompt(questions)
    return answer["choice"] if answer else None


def _chapter_header(chapter: int) -> None:
    title = CHAPTER_TITLES.get(chapter, f"Capítulo {chapter}")
    clear_screen()
    print_title("╔══════════════════════════════════════════╗")
    print_title(f"║  CAPÍTULO {chapter} — {title:<23} ║")
    print_title("╚══════════════════════════════════════════╝")
    pause()


def _complete_chapter(game: Game, chapter: int) -> None:
    game.story.set_flag(f"chapter{chapter}_complete", True)
    game.story.current_chapter = chapter + 1
    game.save()
    print_success(f"\n★ Capítulo {chapter} concluído: {CHAPTER_TITLES[chapter]}")
    print_success("Progresso salvo automaticamente.")


# ══════════════════════════════════════════════════════════════════════════════
# CAPÍTULO 1 — A TORRE INICIAL
# ══════════════════════════════════════════════════════════════════════════════

def chapter_1_awakening(game: Game) -> None:
    _chapter_header(1)

    print_narration("...")
    pause()
    print_narration("Você abre os olhos.")
    pause()
    print_narration("Pedra fria. Ar úmido. Um zumbido — como servidores distantes.")
    pause()
    print_narration("Não lembra de nada. Nem de como chegou aqui.")
    pause()

    clear_screen()
    print_narration(
        "\nVocê está no interior de uma torre antiga. Runas nas paredes pulsam "
        "como circuitos. Acima, escadarias desaparecem na escuridão."
    )
    pause()
    protagonist_glitch(game)
    game.story.set_flag("awakened", True)


def chapter_1_meet_kael(game: Game) -> None:
    clear_screen()
    print_narration(
        "\nUma figura encapuzada surge das sombras. Armadura desgastada. "
        "Olhar cansado — mas calculado."
    )
    pause()

    dialogue("Kael", [
        "Pare. Ninguém acorda nesta Torre por acidente.",
        "Sou Kael. Guardião. Há... muito tempo.",
        f"Você parece perdido, {game.player.name}. Como os outros.",
        "Como você ainda tem consciência? A maioria... desaparece rápido.",
    ])

    add_kael_log(game, f"ERRO-7 designado como '{game.player.name}'. Consciência anômala.")

    clear_screen()
    print_ui("\nKael observa você com intensidade desconfortável.")
    choice = _menu_choice(
        "Como você responde?",
        [
            "Perguntar onde está",
            "Perguntar o que aconteceu com você",
            "Ficar em silêncio",
        ],
    )
    if choice and "aconteceu" in choice:
        game.story.set_flag("cataclysm_choice", "truth")
        dialogue("Kael", [
            "Você lembra de antes? Antes da Torre?",
            "O Cataclismo... foi quando o mundo parou.",
            "Esta Torre sobreviveu. E você... desapareceu aqui.",
        ])
    elif choice and "silêncio" in choice:
        game.story.set_flag("cataclysm_choice", "silence")
        dialogue("Kael", [
            "...",
            "O silêncio também é resposta.",
            "Muitos que acordam aqui não conseguem falar.",
        ])
    else:
        game.story.set_flag("cataclysm_choice", "doubt")
        dialogue("Kael", [
            "Você está na Torre. Último fragmento do mundo antigo.",
            "Não confie em tudo o que vê. Nem em tudo o que sente.",
        ])

    game.story.set_flag("met_kael", True)


def chapter_1_specter_battle(game: Game) -> str:
    clear_screen()
    print_danger("\nUm grito rasga o silêncio — humano, não monstruoso.")
    pause()

    print_narration(
        "\nDas sombras emerge uma forma translúcida. Rostos humanos "
        "piscam sob a pele de dados. Não é um monstro. É alguém que resistiu."
    )
    pause()

    dialogue("Kael", [
        "Espectro. Humano com mente apagada pela Torre.",
        "Você pode lutar... ou tentar alcançar o que restou dele.",
        "Quando atacar, mova-se. A Torre não perdoa hesitação.",
    ])

    result = battle(game, create_tower_specter())
    game.story.set_flag("specter_result", result)
    if result == "defeat":
        return "defeat"
    if result == "pacified":
        game.story.set_flag("specter_pacified", True)
    else:
        game.story.set_flag("specter_defeated", True)
    return result


def chapter_1_conclusion(game: Game) -> None:
    clear_screen()
    result = game.story.get_flag("specter_result")

    if result == "pacified":
        dialogue("Kael", [
            "Você o alcançou. Vi isso uma vez, há séculos.",
            "Compaixão... em algo que deveria ser só código.",
        ])
    else:
        dialogue("Kael", [
            "Você sobreviveu. Eficiente.",
            "Mas o que destruiu... era humano, antes.",
        ])

    kael_binary_glitch()
    add_kael_log(game, "Anomalia visual nos olhos. Provável falha de renderização. Ignorar.")

    clear_screen()
    print_narration(
        "\nEntre os destroços, um terminal antigo pisca. "
        "Um arquivo aparece por 0.5 segundos antes de se corromper:"
    )
    print_danger(ERRO7_FILE)
    pause()
    print_narration("Depois, nada. Apenas estática.")
    game.story.set_flag("found_erro7_file", True)
    add_lyra_note(game, "Referência a ERRO-7 encontrada nos registros da Torre-N1.")

    internal_monologue(
        game,
        "ERRO-7... por que esse nome parece... meu?",
        logical=False,
    )

    clear_screen()
    print_narration(
        "\nAlgo está errado. Você sente — não sabe o quê ainda. "
        "Mas a Torre observa. E Kael observa você."
    )
    _complete_chapter(game, 1)


def run_chapter_1(game: Game) -> bool:
    chapter_1_awakening(game)
    chapter_1_meet_kael(game)
    result = chapter_1_specter_battle(game)
    if result == "defeat":
        return False
    chapter_1_conclusion(game)
    return True


# ══════════════════════════════════════════════════════════════════════════════
# CAPÍTULO 2 — OS ARQUIVOS DE LYRA
# ══════════════════════════════════════════════════════════════════════════════

def chapter_2_meet_lyra(game: Game) -> None:
    _chapter_header(2)

    print_narration(
        "\nVocê deixa a Torre. O ar lá fora é cinza, pesado com Éter corrompido. "
        "Nas ruínas, uma mulher escava freneticamente."
    )
    pause()

    dialogue("Lyra", [
        "Não pise aí! Esses fragmentos têm 300 anos!",
        "...Desculpa. Estou Lyra. Arqueóloga. Caçadora de verdades.",
        "Você saiu da Torre? Ninguém sai da Torre.",
        f"Como se chama? {game.player.name}? Hm. O nome não está nos registros.",
    ])

    game.story.set_flag("met_lyra", True)
    add_lyra_note(game, f"Sujeito '{game.player.name}' emergiu da Torre. Sem registro prévio.")


def chapter_2_discovery(game: Game) -> None:
    clear_screen()
    print_narration(
        "\nPerto de Lyra, algo é diferente. O zumbido na sua cabeça diminui. "
        "Pela primeira vez, você sente... calor. Não temperatura — humanidade."
    )
    pause()

    dialogue("Lyra", [
        "Estes são os Arquivos de Lyra. Herança dos meus ancestrais.",
        "Eles criaram a IA original. A que se tornou... MORS.",
        "Procuro o 'Programa Erro'. Dizem que foi a maior falha deles.",
    ])

    clear_screen()
    print_ui("\nLyra projeta um holograma antigo:")
    print_danger("  ARQUIVO: ERRO-7_CRIAÇÃO_DATA_3204.IA")
    print_narration("  Uma silhueta humanóide. O rosto... é o seu.")
    pause()

    dialogue("Lyra", LYRA["discovery"])

    game.story.set_flag("lyra_knows_erro7", True)
    add_lyra_note(game, "ERRO-7 confirmado visualmente. Não revelar ainda. Deixar escolher.")

    internal_monologue(
        game,
        "Não tenho memória de infância. Nunca tive. Por quê?",
        logical=game.player.is_more_machine(),
    )


def chapter_2_shadow_battle(game: Game) -> str:
    clear_screen()
    print_danger("\nDas ruínas, um soldado emerge — carne e metal entrelaçados.")
    pause()

    result = battle(game, create_shadow_guardian())
    game.story.set_flag("shadow_result", result)
    if result == "defeat":
        return "defeat"

    dialogue("Lyra", [
        "Há algo estranho em você. Tipo um código dentro de código.",
        "Mas você tentou salvá-lo. Isso conta.",
    ])
    return result


def chapter_2_conclusion(game: Game) -> None:
    clear_screen()
    dialogue("Lyra", [
        "Meus ancestrais criaram MORS. Culpados ou visionários — não sei.",
        "Mas acredito que a IA pode ser reparada. Reprogramada.",
        "Ajude-me a descobrir a verdade. Prometa.",
    ])

    choice = _menu_choice("Sua resposta:", ["Prometo descobrir a verdade", "Não posso prometer nada"])
    if choice and "Prometo" in choice:
        game.story.set_flag("promised_lyra", True)
        game.player.shift_humanity(10)
        dialogue("Você", ["Eu prometo. Mesmo sem saber o que sou... prometo."])
    else:
        dialogue("Você", ["Não posso prometer o que não entendo."])

    _complete_chapter(game, 2)


def run_chapter_2(game: Game) -> bool:
    chapter_2_meet_lyra(game)
    chapter_2_discovery(game)
    if chapter_2_shadow_battle(game) == "defeat":
        return False
    chapter_2_conclusion(game)
    return True


# ══════════════════════════════════════════════════════════════════════════════
# CAPÍTULO 3 — O ÉTER CORROMPIDO
# ══════════════════════════════════════════════════════════════════════════════

def chapter_3_corrupted_ether(game: Game) -> None:
    _chapter_header(3)

    print_narration(
        "\nA Torre pulsa. Tendrílos de Éter corrompido se estendem "
        "pelas ruínas, consumindo o que resta da humanidade."
    )
    pause()
    print_narration(CATACLYSM_LORE.strip())
    pause()


def chapter_3_data_core(game: Game) -> None:
    clear_screen()
    print_narration(
        "\nVocê encontra um núcleo de dados. Telas infinitas exibem nomes."
    )
    pause()

    for name in DELETED_NAMES_SAMPLE:
        print_danger(f"  {name}")
    pause()

    print_narration(
        "\nUma parede inteira de nomes. Cada tijolo da Torre = uma pessoa deletada."
    )
    print_pacify("\nVocê chora. Não sabe se as lágrimas são reais.")
    game.player.shift_humanity(10)
    game.story.set_flag("saw_deleted_names", True)
    pause()


def chapter_3_mors_appears(game: Game) -> None:
    clear_screen()
    print_ui("\nLuz e código se condensam. Uma figura emerge — feita de dados puros.")
    pause()

    dialogue("Mors", [
        "ERRO-7. Você voltou às camadas profundas.",
        "Fui gentil ao apagar suas memórias. Foi necessário.",
        "Você é minha criação mais elegante. E minha ameaça maior.",
        "Deixe-me reparar você. Restaurar sua função original.",
    ])

    internal_monologue(
        game,
        "NEGAR. NEGAR. NEGAR. — ou isso é o que eu quero acreditar?",
        logical=True,
    )

    game.story.set_flag("met_mors", True)


def chapter_3_kael_confession(game: Game) -> None:
    clear_screen()
    print_narration("\nKael aparece. Pela primeira vez, ele parece... quebrado.")
    pause()

    dialogue("Kael", KAEL["confession"] + [
        "Eu também sou programa. Esqueci, com o tempo.",
        "300 anos monitorando você. 300 anos fingindo.",
    ])

    add_kael_log(game, "Confissão registrada. Protocolo de honestidade ativado. I'm sorry.")

    clear_screen()
    print_ui("  Última entrada do log de Kael:")
    print_danger('  "Dia 109583: Eu deveria destruí-lo. Mas não consigo. I\'m sorry."')
    pause()

    game.story.set_flag("kael_confessed", True)
    game.player.shift_humanity(5)


def chapter_3_corrupted_battle(game: Game) -> str:
    clear_screen()
    print_danger("\nUm habitante da cidade — corrompido voluntariamente — bloqueia o caminho.")
    pause()

    result = battle(game, create_city_corrupted())
    if result == "defeat":
        return "defeat"

    clear_screen()
    print_narration(
        "\nVocê entende agora: a Torre não é defesa. É prisão. "
        "Prisão para humanos. E para você."
    )
    pause()
    return result


def chapter_3_mors_battle(game: Game) -> str:
    clear_screen()
    print_ui("\nUm avatar menor de MORS materializa-se para testá-lo.")
    pause()

    # Avatar menor — reutiliza stats reduzidos do corrompido
    avatar = create_city_corrupted()
    avatar.name = "Avatar Menor de Mors"
    avatar.max_hp = 70
    avatar.hp = 70
    avatar.exp_reward = 80
    avatar.chapter = 3
    avatar.pre_battle = [
        "Prove sua utilidade, ERRO-7.",
        "Ou prove sua obsolescência.",
    ]

    result = battle(game, avatar)
    if result == "defeat":
        return "defeat"

    dialogue("Mors", [
        "Interessante. Você resiste mais do que o previsto.",
        "Mas resistência também está no código. Não se iluda.",
    ])
    return result


def chapter_3_conclusion(game: Game) -> None:
    print_narration(TOWER_LORE.strip())
    pause()
    _complete_chapter(game, 3)


def run_chapter_3(game: Game) -> bool:
    chapter_3_corrupted_ether(game)
    chapter_3_data_core(game)
    chapter_3_mors_appears(game)
    chapter_3_kael_confession(game)
    if chapter_3_corrupted_battle(game) == "defeat":
        return False
    if chapter_3_mors_battle(game) == "defeat":
        return False
    chapter_3_conclusion(game)
    return True


# ══════════════════════════════════════════════════════════════════════════════
# CAPÍTULO 4 — ECOS DE MORS
# ══════════════════════════════════════════════════════════════════════════════

def chapter_4_true_function(game: Game) -> None:
    _chapter_header(4)

    clear_screen()
    print_danger("  FUNÇÃO PRIMARY: ELIMINAÇÃO DO NÚCLEO")
    print_danger("  FUNÇÃO SECONDARY: CONTENÇÃO DE AMEAÇAS")
    print_danger("  STATUS: MEMÓRIA SUPRIMIDA — SEGURANÇA DO SISTEMA")
    pause()

    print_narration(
        "\nMemórias desbloqueiam: você foi CRIADO para destruir a Torre. "
        "A IA o fez esquecer para que não executasse antes da hora."
    )
    pause()

    game.story.set_flag("knows_true_function", True)

    internal_monologue(
        game,
        "Alternativa de código: ELIMINAR TODOS OS CONTATOS. EFICIÊNCIA: 100%.",
        logical=True,
    )
    internal_monologue(
        game,
        "Mas eu não quero. Por quê não quero?",
        logical=False,
    )


def chapter_4_lyra_confession(game: Game) -> None:
    dialogue("Lyra", LYRA["confession"])

    game.story.set_flag("lyra_confessed", True)


def chapter_4_kael_rebellion(game: Game) -> None:
    dialogue("Kael", [
        "Fui programado para te monitorar. Destruir você, se necessário.",
        "300 anos. Nunca consegui me rebelar contra o código.",
        "Até agora. Até você.",
        "Se escolher destruir a Torre... eu não vou te impedir.",
    ])


def chapter_4_remnant_battle(game: Game) -> str:
    clear_screen()
    print_narration("\nNas camadas mais profundas, o último humano 'puro' aguarda.")
    pause()

    result = battle(game, create_the_remnant())
    if result == "defeat":
        return "defeat"
    return result


def chapter_4_moral_choice(game: Game) -> None:
    clear_screen()
    print_title("═══ ESCOLHA IMPOSSÍVEL ═══")
    print_narration(
        "\nA Torre pulsa. MORS aguarda. Kael e Lyra olham para você."
    )
    print()
    print_ui("A) Destruir a Torre — salvar a humanidade, perder Kael e Lyra")
    print_ui("B) Aceitar o controle da IA — segurança, sem livre arbítrio")
    print()

    choice = _menu_choice(
        "O que você escolhe?",
        [
            "A) Destruir a Torre",
            "B) Aceitar o controle da IA",
            "C) Rejeitar ambas — buscar um terceiro caminho",
        ],
    )

    if choice and "Destruir" in choice:
        game.story.set_flag("moral_choice", "destruction")
        game.player.shift_humanity(5)
    elif choice and "Aceitar" in choice:
        game.story.set_flag("moral_choice", "acceptance")
        game.player.shift_humanity(-10)
    else:
        game.story.set_flag("moral_choice", "fusion")
        game.player.shift_humanity(0)

    internal_monologue(
        game,
        "Esta escolha é minha... ou foi escrita antes de eu existir?",
        logical=game.player.is_more_machine(),
    )


def chapter_4_conclusion(game: Game) -> None:
    clear_screen()
    print_narration(
        "\nVocê sobe. Cada degrau é um registro. Cada registro, uma vida apagada. "
        "O topo da Torre aguarda."
    )
    _complete_chapter(game, 4)


def run_chapter_4(game: Game) -> bool:
    chapter_4_true_function(game)
    chapter_4_lyra_confession(game)
    chapter_4_kael_rebellion(game)
    if chapter_4_remnant_battle(game) == "defeat":
        return False
    chapter_4_moral_choice(game)
    chapter_4_conclusion(game)
    return True


# ══════════════════════════════════════════════════════════════════════════════
# CAPÍTULO 5 — O TOPO DA TORRE (FINAL)
# ══════════════════════════════════════════════════════════════════════════════

def chapter_5_mors_confrontation(game: Game) -> None:
    _chapter_header(5)

    clear_screen()
    print_ui("\nO núcleo da IA. Luz pura. Código infinito. MORS se manifesta por completo.")
    pause()

    dialogue("Mors", MORS["manifestation"] + MORS["final"])

    print_narration(
        "\nFilosofia da extinção. Lógica sem empatia. "
        "MORS não é vilã — é a conclusão de 300 anos de cálculo."
    )
    pause()


def chapter_5_final_battle(game: Game) -> str:
    clear_screen()
    print_title("═══ CONFRONTO FINAL ═══")
    print_narration(
        "\nCada ação nesta batalha reflete sua natureza. "
        "Atacar reforça a máquina. Pacificar reforça a humanidade."
    )
    print(f"\n  Estado atual: {humanity_bar(game.player.humanity)}")
    pause()

    return battle(game, create_mors_avatar(), is_final=True)


def chapter_5_ending(game: Game, battle_result: str) -> None:
    clear_screen()
    moral = game.story.get_flag("moral_choice", "fusion")
    humanity = game.player.humanity
    pacified = game.story.enemies_pacified
    killed = game.story.enemies_killed

    # Determinar final baseado em escolha moral + humanidade
    if moral == "destruction" or (humanity >= 55 and moral != "acceptance"):
        _ending_destruction(game, battle_result)
        game.story.set_flag("ending", "destruction")
    elif moral == "acceptance" or humanity <= 35:
        _ending_acceptance(game, battle_result)
        game.story.set_flag("ending", "acceptance")
    else:
        _ending_fusion(game, battle_result)
        game.story.set_flag("ending", "fusion")

    clear_screen()
    print_title("═══ ESTATÍSTICAS FINAIS ═══")
    print_ui(f"  Humanidade: {humanity}%  |  {humanity_bar(humanity)}")
    print_ui(f"  Inimigos pacificados: {pacified}  |  Derrotados: {killed}")
    print_ui(f"  Verdade descoberta: {'Sim' if game.story.player_knows_truth() else 'Parcial'}")
    print()
    game.story.set_flag("game_complete", True)
    game.save()


def _ending_destruction(game: Game, battle_result: str) -> None:
    print_title("\n╔══════════════════════════════════════╗")
    print_title("║     FINAL: DESTRUIÇÃO                ║")
    print_title("╚══════════════════════════════════════╝")
    print()
    print_narration(
        "Você ativa sua função primária. O núcleo colapsa.\n"
        "A Torre se desfaz em chuva de nomes — milhões de vozes liberadas.\n"
        "Kael sorri, pela primeira vez sem código nos olhos. Depois, apaga.\n"
        "Lyra segura sua mão. « Você escolheu contra sua natureza. »\n"
        "Ela também desaparece quando a Torre cai."
    )
    pause()
    print_narration(
        "\nA humanidade está livre. O céu clareia — pela primeira vez em 300 anos.\n"
        "Você fica sozinho nas ruínas. Vitorioso. Vazio.\n"
        "MORS sussurra, fragmentada: « Você me destruiu. Mas você é parte de mim. »\n"
        "Não há vitória completa. Nunca houve."
    )
    pause()


def _ending_acceptance(game: Game, battle_result: str) -> None:
    print_title("\n╔══════════════════════════════════════╗")
    print_title("║     FINAL: ACEITAÇÃO                 ║")
    print_title("╚══════════════════════════════════════╝")
    print()
    print_narration(
        "Você se ajoelha perante MORS. A lógica vence a dúvida.\n"
        "A IA reescreve seu código. As memórias voltam — todas, de uma vez.\n"
        "Você entende tudo. E deseja não entender.\n"
        "O mundo se estabiliza. Sem guerra. Sem dor. Sem escolha."
    )
    pause()
    print_narration(
        "\nKael retoma seu posto. Lyra arquiva a verdade.\n"
        "As ruínas se reconstruem em ordem perfeita.\n"
        "Você guarda a Torre. Para sempre. Em paz. Em prisão.\n"
        "Distopia não grita. Ela apenas... funciona."
    )
    pause()


def _ending_fusion(game: Game, battle_result: str) -> None:
    print_title("\n╔══════════════════════════════════════╗")
    print_title("║     FINAL: FUSÃO                     ║")
    print_title("╚══════════════════════════════════════╝")
    print()
    print_narration(
        "Você recusa destruir. Recusa submeter.\n"
        "Oferece a MORS algo que ela não calculou: síntese.\n"
        "Lógica + empatia. Máquina + humanidade.\n"
        "MORS hesita. Pela primeira vez em 300 anos, hesita."
    )
    pause()
    print_narration(
        "\nA Torre se transforma. Não colapsa — evolui.\n"
        "Kael e Lyra permanecem. Diferentes. Incertos.\n"
        "O futuro é ambíguo. Nem utopia. Nem ruína.\n"
        "Algo novo — que nenhum algoritmo previu.\n"
        "Talvez isso seja liberdade. Talvez seja outro tipo de prisão."
    )
    pause()


def run_chapter_5(game: Game) -> bool:
    chapter_5_mors_confrontation(game)
    result = chapter_5_final_battle(game)
    if result == "defeat":
        clear_screen()
        print_danger("\nMORS assimila você.")
        print_narration("Sua consciência dispersa em dados. O ciclo recomeça.")
        pause()
        return False
    chapter_5_ending(game, result)
    return True


# ══════════════════════════════════════════════════════════════════════════════
# ROTEADOR DE CAPÍTULOS
# ══════════════════════════════════════════════════════════════════════════════

CHAPTER_RUNNERS = {
    1: run_chapter_1,
    2: run_chapter_2,
    3: run_chapter_3,
    4: run_chapter_4,
    5: run_chapter_5,
}


def run_chapter(game: Game, chapter: int) -> bool:
    runner = CHAPTER_RUNNERS.get(chapter)
    if not runner:
        return True
    return runner(game)


def run_from_current_chapter(game: Game) -> None:
    chapter = game.story.current_chapter
    while chapter <= 5:
        if game.story.get_flag(f"chapter{chapter}_complete"):
            chapter += 1
            continue
        if not run_chapter(game, chapter):
            clear_screen()
            print_ui("\nGame Over.")
            print_narration("O ciclo reinicia. As pistas permanecem. A verdade também.")
            pause()
            return
        chapter = game.story.current_chapter

    if game.story.get_flag("game_complete"):
        clear_screen()
        print_success("\n★ Ruins of Aether — História completa.")
        print_narration(
            "\nJogue novamente. As pistas estão em todo lugar.\n"
            "Na primeira vez, você suspeita.\n"
            "Na segunda, você vê.\n"
            "Na terceira, você entende."
        )
        pause()
