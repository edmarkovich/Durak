from deck import Deck
from player import Player
from players import Players
from table import Table
from console import Console

class Game:

    def __init__(self, expect_players):

        if expect_players < 2 or expect_players > 6:
            raise Exception("Invalid expected players" + str(expect_players))

        self.console = Console.getInstance()
        self.expect_players = expect_players 
        self.deck = Deck()
        self.players = Players(self.deck, self.expect_players)

        self.trump_card = self.deck.peek_last()
            
    def start(self):
        if self.expect_players > len(self.players.players):
            raise Exception("Not enough players")

        self.attacker = self.players.who_goes_first(self.trump_card.suit)
        self.console.add("Game Started")
        self.console.add("Trump card: "+ str(self.trump_card))
    
    def turn(self):
        #TODO: test
        table = Table(self.trump_card.suit)

        attacker = self.attacker
        defender = self.player_on_left(attacker)
        passer   = None
        
        a_player = self.players[self.attacker]
        d_player = self.players[defender]

        outcome = None
        
        while not outcome:

            a_move = get_input(attacker)
            if a_move == "pass":
                if not passer: passer = attacker
                attacker = self.next_attacker(attacker, defender, passer)
                if not attacker:
                    outcome = "beat"
                    break
                a_player = self.players[self.attacker]
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


    def await_single_join(self):
        out = self.get_input("Any")

        if "action" not in out or "name" not in out or out["action"] != "join" or len(out["name"])==0:            
            raise Exception("Invalid join: "+str(out))

        self.players.add_player(out["name"])

    def await_all_join(self):
        while len(self.players.players) < self.expect_players:
            self.await_single_join()

    def main_loop(self):
        self.await_all_join()
        self.start()



