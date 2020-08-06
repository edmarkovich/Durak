from .player import Player
from .players import Players
from .table import Table
from .console import Console
from .game_setup import GameSetup
from .ioutil import IOUtil
from .game_round import GameRound

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
        self.defender = self.players.player_on_left(self.attacker) #TODO: add to test

        self.console.add("Game Started")
        self.console.add("Trump card: "+ str(self.trump_card))

    def json(self):
        #TODO -test

        if not hasattr(self, 'table'):
            return None;

        return {
            'players': self.players.json(self.trump_card.suit),
            'trump': str(self.trump_card),
            'deck': str(len(self.deck.cards)),
            'table': self.table.json()
        }

    def __str__(self):
        out = "{"

        if hasattr(self, 'players'):
            out += '"players":'+ str(self.players) +' ,'

        #if hasattr(self, 'attacker'):
        #    out += "Attacker: " + self.attacker + "\t"
        #    out += "Defender: " + self.defender + "\t"

        if hasattr(self, 'trump_card'):
            out += '"trump": "' + str(self.trump_card) + '" ,'

        if hasattr(self, 'deck'):
            out += '"deck": ' + str(len(self.deck.cards))

        return out + "}"


    def set_next_attacker_defender(self, outcome):
        #TODO: add this to test
        if outcome == "beat_all":
            self.attacker = self.defender
        elif outcome == "took":
            self.attacker = self.players.player_on_left(self.defender, False)
        else:
            raise Exception("Invalid Outcome: ", outcome)

        if not self.players.players[self.attacker].has_cards():
            self.attacker = self.players.player_on_left(self.attacker)
        self.defender = self.players.player_on_left(self.attacker)



    def main_loop(self):
        #TODO test
        game_setup = GameSetup(self.expect_players)
        game_setup.await_all_join()
        self.start(game_setup)

        while True:
            game_round = GameRound(self.players, self.attacker, self.defender, self.trump_card.suit)
            self.table = game_round.table
            outcome = game_round.play()

            print("Round is finished. Refilling")
            self.players.refill_all(self.attacker, self.defender)

            if self.players.is_game_over():
                print("Game Over")
                break

            self.set_next_attacker_defender(outcome)
