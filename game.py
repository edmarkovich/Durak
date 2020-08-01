from player import Player
from players import Players
from table import Table
from console import Console
from game_setup import GameSetup
from ioutil import IOUtil

class Game:

    def __init__(self, expect_players):

        if expect_players < 2 or expect_players > 6:
            raise Exception("Invalid expected players" + str(expect_players))

        self.console = Console.getInstance()
        self.expect_players = expect_players                 
            
    def start(self, game_setup):
        self.players = game_setup.players #TEST

        if self.expect_players > len(self.players.players):
            raise Exception("Not enough players")

        
        self.deck = game_setup.deck
        self.trump_card = self.deck.peek_last()

        self.attacker = self.players.who_goes_first(self.trump_card.suit)
        self.console.add("Game Started")
        self.console.add("Trump card: "+ str(self.trump_card))
    
    def turn(self):
        #TODO: test
        table = Table(self.trump_card.suit)

        attacker = self.attacker
        defender = self.players.player_on_left(attacker)
        passer   = None
        
        a_player = self.players.players[self.attacker]
        d_player = self.players.players[defender]

        outcome = None
        
        while not outcome:

            #TODO: fix    
            def src():
                return '{"action":"pass"}'

            a_move = IOUtil.get_input(src, attacker) 
            if a_move["action"] == "pass":
                if not passer: passer = attacker
                attacker = self.players.next_attacker(attacker, defender, passer)
                if not attacker:
                    outcome = "beat"
                    break
                a_player = self.players.players[self.attacker]
                continue

            if not table.attack(a_move, a_player):
                #TODO - invalid attack. Notify
                continue

            while True:
                d_move = get_input(defender)
                if d_move == "take":
                    table.take_pile(d_player)
                    outcome = "took"
                    break

                if not table.defend(d_move, d_player):
                    #TODO - invalid defend. Notify
                    continue

            if not d_player.has_cards():
                outcome = "beat"
                break;

            if not a_player.has_cards():
                attacker = self.next_attacker(attacker, defender, None)
                if not attacker: break

        if outcome == "beat":
            self.attacker = defender
        elif outcome == "took":
            self.attacker = self.player_on_left(defender)

        #TODO - refill their hands




    def main_loop(self):
        #TODO test
        game_setup = GameSetup(self.expect_players)
        game_setup.await_all_join()
        self.start(game_setup)

        #while True: #game not finished
        #self.turn()



