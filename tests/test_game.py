import unittest
from game import Game
from card import Card

class GameTestCase(unittest.TestCase):

    def test_game_init(self):
        game = Game(2)
        self.assertTrue(len(game.deck.cards) == 36)
        self.assertTrue(game.trump_card.suit in Card.suits)
        self.assertTrue(game.players)

        game = Game(6)
        self.assertTrue(len(game.deck.cards) == 36)
        
        with self.assertRaises(Exception) as context:
            game = Game(1)       
        self.assertTrue((str(context.exception)).startswith("Invalid expected"))
    
        with self.assertRaises(Exception) as context:
            game = Game(7)
        self.assertTrue((str(context.exception)).startswith("Invalid expected"))
        
        
    def test_game_start(self):
        game = Game(2)
        
        game.players.add_player("Ed1")
        self.assertFalse(game.start())
        self.assertFalse(hasattr(game, 'attacker'))
        self.assertTrue(game.console.lines[-1] == "Awaiting 1 player(s)")

        game.players.add_player("Ed2")
        self.assertTrue(game.start())
        self.assertTrue(game.attacker)
        self.assertTrue(game.console.lines[-2] == "Game Started")
        self.assertTrue(game.console.lines[-1].startswith("Trump card"))


