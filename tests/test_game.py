import unittest
from game import Game
from card import Card

class GameTestCase(unittest.TestCase):

    def test_game_init(self):
        game = Game(2)
        self.assertTrue(len(game.deck.cards) == 36)
        self.assertTrue(game.trump_card.suit in Card.suits)

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
        self.assertTrue("Joined: Conway" in game.console)
        self.assertTrue("Game Started" in game.console)

        with self.assertRaises(Exception) as context:
            game.add_player("Fred")
        self.assertTrue((str(context.exception)).startswith("Game full"))

    def test_game_who_goes_first(self):
        game = Game(3)
        trump = game.trump_card.suit
        game.add_player("Ed1")
        game.add_player("Ed2")
        game.add_player("Ed3")
        game.players["Ed1"].hand = [Card(trump, '10'), Card(trump, '9')]
        game.players["Ed2"].hand = [Card(trump, 'A'), Card(trump, '6')]
        game.players["Ed3"].hand = []
        
        self.assertTrue(game.who_goes_first() == "Ed2")
        self.assertTrue(game.console[-1] == "Ed3 shows None")
        self.assertTrue(game.console[-3].startswith("Ed1 shows "+trump+"9"))

    def test_game_who_goes_first_default(self):
        game = Game(2)
        game.add_player("Ed1")
        game.add_player("Ed2")
        game.players["Ed1"].hand = []
        game.players["Ed2"].hand = []
        self.assertTrue(game.who_goes_first() == "Ed1")
        
    def test_game_start(self):
        game = Game(2)
        
        game.add_player("Ed1")
        self.assertFalse(game.start())
        self.assertFalse(hasattr(game, 'attacker'))
        self.assertTrue(game.console[-1] == "Awaiting 1 player(s)")

        game.add_player("Ed2")
        self.assertTrue(game.start())
        self.assertTrue(game.attacker)
        self.assertTrue(game.console[-2] == "Game Started")
        self.assertTrue(game.console[-1].startswith("Trump card"))

    def test_game_player_on_left(self):
        game = Game(3)
        game.add_player("Ed1")
        game.add_player("Ed2")
        game.add_player("Ed3")

        self.assertTrue(game.player_on_left("Ed2") == "Ed3")
        self.assertTrue(game.player_on_left("Ed3") == "Ed1")
        with self.assertRaises(Exception) as context:
            game.player_on_left("Rando")
        self.assertTrue((str(context.exception)).startswith("Invalid player: Rando"))

    def test_game_next_attacker(self):
        game = Game(3)
        game.add_player("Ed1")
        game.add_player("Ed2")
        game.add_player("Ed3")

        self.assertEqual(game.next_attacker("Ed2", "Ed1"), "Ed3")
        self.assertEqual(game.next_attacker("Ed2", "Ed3"), "Ed1")

        game.players["Ed1"].hand = []
        self.assertEqual(game.next_attacker("Ed2", "Ed3"), "Ed2")

        game.players["Ed2"].hand = []
        self.assertEqual(game.next_attacker("Ed2", "Ed3"), None)
