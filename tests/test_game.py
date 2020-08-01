import unittest
from game import Game
from card import Card

class GameTestCase(unittest.TestCase):

    def test_game_init(self):
        game = Game(2)
        self.assertTrue(len(game.deck.cards) == 36)
        self.assertTrue(game.trump in Card.suits)

        game = Game(6)
        self.assertTrue(len(game.deck.cards) == 36)
        
        with self.assertRaises(Exception) as context:
            game = Game(1)       
        self.assertTrue((str(context.exception)).startswith("Invalid expected"))
    
        with self.assertRaises(Exception) as context:
            game = Game(7)
        self.assertTrue((str(context.exception)).startswith("Invalid expected"))
        

    def test_game_add_console(self):
        game = Game(4)
        game.add_console("Test 1")
        game.add_console("Test 2")
        self.assertTrue(len(game.console) == 2)
        self.assertTrue(game.console[-1] == "Test 2")

    def test_game_add_player(self):
        game = Game(4)
        game.add_player("Ed")
        self.assertTrue(len(game.players["Ed"].hand) == 6)
        self.assertTrue(len(game.deck.cards) == 30)

        game.add_player("Mike")
        self.assertTrue(len(game.players["Mike"].hand) == 6)
        self.assertTrue(len(game.deck.cards) == 24)

        with self.assertRaises(Exception) as context:
            game.add_player("Mike")
        self.assertTrue((str(context.exception)).startswith("Duplicate player"))

        game.add_player("Jon")
        game.add_player("Conway")
        self.assertTrue(len(game.deck.cards) == 12)
        self.assertTrue(game.console[-1] == "Joined: Conway")

        with self.assertRaises(Exception) as context:
            game.add_player("Fred")
        self.assertTrue((str(context.exception)).startswith("Game full"))
