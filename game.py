from player import Player
from players import Players
from table import Table
from console import Console
from game_setup import GameSetup
from ioutil import IOUtil
from game_round import GameRound

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


    def main_loop(self):
        #TODO test
        game_setup = GameSetup(self.expect_players)
        game_setup.await_all_join()
        self.start(game_setup)


        game_round = GameRound(self.players, self.attacker, self.players.player_on_left(self.attacker), self.trump_card.suit)
        game_round.play()




