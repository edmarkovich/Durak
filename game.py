from deck import Deck
from player import Player

class Game:

    def __init__(self, expect_players):

        if expect_players < 2 or expect_players > 6:
            raise Exception("Invalid expected players" + str(expect_players))

        self.console = []
        self.expect_players = expect_players
        self.players = {}
        self.deck = Deck()
        self.trump = self.deck.peek_last().suit

    def add_console(self, log):
        self.console.append(log)
        
    def add_player(self, name):
        if name in self.players:
            raise Exception ("Duplicate player "+ name)

        if len(self.players) == self.expect_players:
            raise Exception ("Game full")

        self.players[name] = Player()
        self.players[name].add_cards(self.deck.draw(6))

        self.add_console("Joined: "+name)


        
