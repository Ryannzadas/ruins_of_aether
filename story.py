import time
import os
from colorama import Fore, Back, Style
import inquirer
from core import Character, Game
from combat import Combat
from core import Enemy

class StoryManager:
    """Gerencia histórias, diálogos e eventos"""
    
    def __init__(self, game: Game):
        self.game = game
    
    def clear(self):
        os.system('cls' if os.name == 'nt' else 'clear')
    
    def msg(self, speaker: str, text: str):
        """Mostra uma mensagem e espera ENTER"""
        self.clear()
        print(Fore.CYAN + "\n" + "=" * 70)
        print(speaker)
        print(Fore.CYAN + "=" * 70)
        print(Fore.WHITE + text)
        print(Fore.CYAN + "=" * 70)
        input(Fore.CYAN + "\nPressione ENTER...")
    
    def choice(self, options: list) -> int:
        """Mostra opções e retorna escolha"""
        self.clear()
        questions = [
            inquirer.List('choice',
                message=Fore.YELLOW + "O que você faz?",
                choices=options,
                carousel=True
            )
        ]
        answers = inquirer.prompt(questions)
        return options.index(answers['choice'])
    
    def start_chapter_one(self):
        """Capítulo 1 - Uma cena por vez"""
        self.clear()
        print(Fore.CYAN + "\n" + "=" * 70)
        print(Fore.CYAN + "CAPÍTULO 1: A TORRE INICIAL".center(70))
        print(Fore.CYAN + "=" * 70)
        time.sleep(1)
        
        # CENA 1
        self.msg(
            Fore.MAGENTA + "Narrador" + Style.RESET_ALL,
            """
Escuridão.
Depois... luz.

Você abre os olhos lentamente.
Pedras antigas ao seu redor. Símbolos brilhando em parede.
O ar cheira a metal queimado e algo mais velho.

Você tenta lembrar como chegou aqui.
Nada vem.
Tenta lembrar QUEM é.
Também nada.

Apenas... um propósito vago. Uma sensação de DEVER.
            """
        )
        
        # CENA 2 - ESCOLHA
        opcoes = ["Tentar me lembrar de algo", "Me levantar e explorar"]
        escolha = self.choice(opcoes)
        
        if escolha == 0:
            self.msg(
                Fore.MAGENTA + "Narrador" + Style.RESET_ALL,
                """
Você fecha os olhos e tenta alcançar memórias.

Fragmentos:
- Código correndo por telas
- Símbolos antigos pulsando
- Uma voz distante: "ERRO-7, você está pronto?"
- Um número: 3204
- Um rosto de mulher

Então... nada. Vazio novamente.

Mas aquele número é IMPORTANTE.
ERRO-7... 3204...
                """
            )
        
        # CENA 3
        self.msg(
            Fore.YELLOW + "Você" + Style.RESET_ALL,
            """
Você se levanta com dificuldade. As pernas tremem.
Não está machucado. Mas sente... vazio.

À frente, um corredor escuro.
Símbolos na parede piscam levemente.

Um deles se aproxima:

""" + Fore.CYAN + "> ERRO-7\n> INITIALIZING...\n> AWAITING COMMAND" + Style.RESET_ALL + """

O símbolo pisca. Desaparece.

Passos metálicos se aproximam.
            """
        )
        
        # CENA 4
        self.msg(
            Fore.MAGENTA + "Narrador" + Style.RESET_ALL,
            """
Uma figura sai da escuridão.

Um homem velho. Armadura antiga, enferrujada.
Os olhos dele são azuis. Mas ocasionalmente...

""" + Fore.CYAN + "piscam em código binário." + Style.RESET_ALL + """

Você vê números e símbolos refletidos por um instante.
Então é normal de novo.

Ele te observa com uma expressão cansada.
Como se tivesse esperado por você há muito tempo.
            """
        )
        
        # CENA 5 - ESCOLHA
        opcoes2 = ["Quem é você?", "Onde estou?", "Não me lembro de nada"]
        escolha2 = self.choice(opcoes2)
        
        if escolha2 == 0:
            self.msg(Fore.RED + "Kael" + Style.RESET_ALL,
            """
'Meu nome é Kael. Sou guardião dessa Torre.

E você... você seria?'

Ele te observa com uma curiosidade que parece quase científica.
            """)
        elif escolha2 == 1:
            self.msg(Fore.RED + "Kael" + Style.RESET_ALL,
            """
'Você está na Torre. A Torre Inicial.

Alguns a chamam de banco de dados. Outros a chamam de prisão.
Eu apenas... cuido dela.

E dela de você.'
            """)
        else:
            self.msg(Fore.RED + "Kael" + Style.RESET_ALL,
            """
'Não se lembra? Sim, isso é comum aqui.
Muitos acordam assim na Torre.
A memória é instável neste lugar.

Meu nome é Kael. E você?'
            """)
        
        # CENA 6
        self.msg(
            Fore.RED + "Kael" + Style.RESET_ALL,
            """
Kael fica em silêncio por alguns segundos.
Mais do que o normal.

'Sabe, você faz uma pergunta interessante.
Como você sabe que é você se não se lembra?
O que faz você... você?'

Seus olhos piscam NOVAMENTE em código.
Dessa vez você VIRA ele piscar claramente.
            """
        )
        
        # CENA 7 - ESCOLHA
        opcoes3 = ["Há algo dentro de mim. Um propósito.", "Não sei responder a isso"]
        escolha3 = self.choice(opcoes3)
        
        if escolha3 == 0:
            self.msg(
                Fore.YELLOW + "Você" + Style.RESET_ALL,
                """
'Há algo... dentro de mim. Um propósito. Como um dever.'
                """
            )
        else:
            self.msg(
                Fore.RED + "Kael" + Style.RESET_ALL,
                """
'Tudo bem se não souber.

Talvez você descubra no caminho.
Ou talvez seja melhor não saber.

Vem. Preciso te levar a um lugar seguro.'
                """
            )
        
        # CENA 8
        self.msg(
            Fore.RED + "Kael" + Style.RESET_ALL,
            """
'Dever, hm? Sim, faz sentido.
Muitos têm isso aqui. Uma sensação de... necessidade.
Alguns chamam de propósito.
Outros chamam de prisão.

Você consegue andar? Preciso te levar a um lugar seguro.
A Torre não é sempre amigável com visitantes.'
            """
        )
        
        # CENA 9
        self.msg(
            Fore.MAGENTA + "Narrador" + Style.RESET_ALL,
            """
Kael te leva através de corredores da Torre.
As paredes são de pedra, mas ocasionalmente veem-se fios de luz azul
pulsando sob a superfície.

Você caminha em silêncio. Kael também.

Depois de um tempo, você pergunta:
'Por quanto tempo estou aqui?'

Kael para. Fica em silêncio.
            """
        )
        
        # CENA 10
        self.msg(
            Fore.RED + "Kael" + Style.RESET_ALL,
            """
'Essa é uma pergunta complicada.
Você está aqui desde...
bem, desde sempre. Ou desde recentemente.
Depende de como você mede o tempo.

Eu estou aqui há 312 anos.
Ou alguns segundos.
Tempo é relativo.'
            """
        )
        
        # CENA 11
        self.msg(
            Fore.MAGENTA + "Narrador" + Style.RESET_ALL,
            """
Ele continua caminhando como se não tivesse dito nada extraordinário.

Kael para em frente a uma câmara antiga.
            """
        )
        
        # CENA 12
        self.msg(
            Fore.RED + "Kael" + Style.RESET_ALL,
            """
'Aqui. Isso era uma câmara de descanso.

Antes, havia muitas pessoas aqui.
Agora... é só você.
E eu.
Somos os únicos ainda funcionais neste setor.

Descanse. Amanhã você entenderá por que está aqui.

Ah, uma coisa. Se ver algum arquivo na parede durante a noite...
ignore. São apenas memórias corrompidas.'
            """
        )
        
        # CENA 13 - NOITE
        self.msg(
            Fore.MAGENTA + "Narrador" + Style.RESET_ALL,
            """
Você tenta dormir.
Não consegue.

Em seu "sono", você vê fragmentos:
- Código correndo
- Símbolos antigos
- Uma voz: "ERRO-7, você está pronto?"
- Um ano: 3204
- Um rosto de mulher

Você acorda com um sobressalto.

Na parede, um arquivo pisca.

O nome é: """ + Fore.CYAN + "ERRO-7_CRIAÇÃO_DATA_3204.IA" + Style.RESET_ALL + """

Você toca na parede. O arquivo desaparece.

Seu coração bate mais rápido.

Na parede, código pisca:

""" + Fore.CYAN + "[SISTEMA DE MONITORAMENTO ATIVO]" + Style.RESET_ALL + """
            """
        )
        
        # CENA 14
        self.msg(
            Fore.MAGENTA + "Narrador" + Style.RESET_ALL,
            """
Você sai da câmara.
Kael está esperando.
            """
        )
        
        # CENA 15
        self.msg(
            Fore.YELLOW + "Você" + Style.RESET_ALL,
            """
'Você passou a noite aqui?'
            """
        )
        
        # CENA 16
        self.msg(
            Fore.RED + "Kael" + Style.RESET_ALL,
            """
'Sim. Preciso manter você seguro.

Há algo errado? Sua... frequência aumentou.

Você viu algo na câmara?'

Kael SABE que você viu algo.
            """
        )
        
        # CENA 17 - ESCOLHA FINAL
        opcoes4 = ["Mencionar o arquivo ERRO-7", "Fingir que viu nada"]
        escolha4 = self.choice(opcoes4)
        
        if escolha4 == 0:
            self.msg(
                Fore.YELLOW + "Você" + Style.RESET_ALL,
                """
'Vi um arquivo. ERRO-7. De 3204.
O que é isso?'
                """
            )
            
            self.msg(
                Fore.RED + "Kael" + Style.RESET_ALL,
                """
Kael fica imóvel.

'Ah.

Então já começou.
Soubeste antes do esperado.

Preciso te levar a um nível mais seguro.
Há coisas que você precisa entender.'
                """
            )
        else:
            self.msg(
                Fore.RED + "Kael" + Style.RESET_ALL,
                """
'Hm. Você está mentindo.
Sua frequência subiu quando negou.

Mas tudo bem. Você verá em breve.'
                """
            )
        
        # CENA 18
        self.msg(
            Fore.RED + "Kael" + Style.RESET_ALL,
            """
'Um Espectro. Um humano que a Torre... corrigiu.

Sua mente foi... otimizada. Apagada. Deletada.

Agora é apenas dados corrompidos.
Ainda tem impulsos. Agressividade.
Mas sem consciência. Sem vontade própria.

Você consegue lutar?'
            """
        )
        
        # CENA 19 - COMBATE
        opcoes5 = ["Não sei se consigo", "Vou tentar"]
        escolha5 = self.choice(opcoes5)
        
        self.msg(
            Fore.RED + "Kael" + Style.RESET_ALL,
            """
'Bem. Então vamos descobrir.'
            """
        )
        
        self.fight_first_enemy()
    
    def fight_first_enemy(self):
        """Combate com Espectro"""
        self.clear()
        
        print(Fore.RED + "\n" + "🔴" * 35 + "\n")
        time.sleep(1)
        
        enemy = Enemy(
            name="Espectro Corrompido",
            hp=40,
            max_hp=40,
            attack=6,
            defense=2,
            exp_reward=50,
            item_drops=[]
        )
        
        combat = Combat(self.game.player, enemy)
        victory = combat.run_combat()
        
        if victory:
            print(Fore.GREEN + "\n✓ VITÓRIA")
            
            time.sleep(2)
            
            self.msg(
                Fore.RED + "Kael" + Style.RESET_ALL,
                """
'Você é muito mais forte do que parecia.

Vem. Vamos descer para os níveis mais seguros.

Lá você começará a entender o que realmente é esta Torre.

E talvez... quem realmente é você.'
                """
            )
            
            self.game.story.set_flag("defeated_first_specter", True)
            self.game.story.character_met.add("Kael")
        else:
            print(Fore.RED + "\n✗ DERROTA")
            
            self.msg(
                Fore.RED + "Kael" + Style.RESET_ALL,
                """
'Você caiu.

Talvez na próxima você entenda.
Talvez na próxima você já saiba o que é.'
                """
            )
        
        self.game.save_game()


class GameFlow:
    """Controla o fluxo do jogo"""
    
    def __init__(self):
        self.game = Game()
        self.story_manager = None
    
    def start_new_game(self):
        """Começa um novo jogo"""
        os.system('cls' if os.name == 'nt' else 'clear')
        
        print(Fore.CYAN + "\n" + "=" * 70)
        print(Fore.CYAN + "BEM-VINDO A RUINS OF AETHER".center(70))
        print(Fore.CYAN + "=" * 70)
        
        print(Fore.YELLOW + """
Um lugar escuro.
Você acorda sem memórias.
Apenas um dever vago queimando em sua mente.

E a sensação de que algo está muito errado.
        """)
        
        player_name = input(Fore.YELLOW + "\nQual é o seu nome, viajante? > ").strip()
        
        if not player_name:
            player_name = "Viajante"
        
        self.game.create_new_player(player_name)
        
        print(Fore.GREEN + f"\nBem-vindo, {player_name}...\n")
        time.sleep(2)
        
        self.story_manager = StoryManager(self.game)
        self.story_manager.start_chapter_one()
        
        self.game.save_game()