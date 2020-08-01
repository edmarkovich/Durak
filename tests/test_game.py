import unittest
import random
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
        
        with self.assertRaises(Exception) as context:
            game.start()
        self.assertTrue((str(context.exception)).startswith("Not enough players"))

        self.assertFalse(hasattr(game, 'attacker'))

        game.players.add_player("Ed2")
        game.start()
        self.assertTrue(game.attacker)
        self.assertTrue(game.console.lines[-2] == "Game Started")
        self.assertTrue(game.console.lines[-1].startswith("Trump card"))

    def test_await_single_join(self):
        game = Game(2)

        game.get_input = lambda x: {"name":"Someone"}
        with self.assertRaises(Exception) as context:
            game.await_single_join()       
        self.assertTrue((str(context.exception)).startswith("Invalid join"))
 
        game.get_input = lambda x: {"action":"join"}
        with self.assertRaises(Exception) as context:
            game.await_single_join()       
        self.assertTrue((str(context.exception)).startswith("Invalid join"))

        game.get_input = lambda x: {"action":"join_bad", "name":"Someone"}
        with self.assertRaises(Exception) as context:
            game.await_single_join()       
        self.assertTrue((str(context.exception)).startswith("Invalid join"))

        game.get_input = lambda x: {"action":"join", "name":""}
        with self.assertRaises(Exception) as context:
            game.await_single_join()       
        self.assertTrue((str(context.exception)).startswith("Invalid join"))


        self.assertEqual(len(game.players.players), 0)
        game.get_input = lambda x: {"action":"join", "name":"Someone"}
        game.await_single_join()  
        self.assertEqual(len(game.players.players), 1)
        self.assertTrue("Someone" in game.players.players)

        with self.assertRaises(Exception) as context:
            game.await_single_join()  
        self.assertTrue((str(context.exception)).startswith("Duplicate player"))

    def test_await_all_join(self):
        game = Game(4)
        #Technically could be a collision
        game.get_input = lambda x: {"action":"join", "name":"P"+str(random.randint(0,999999999999))}
        game.await_all_join()
        self.assertEqual(len(game.players.players), 4)

    def test_main_loop(self):
        game = Game(4)
        game.get_input = lambda x: {"action":"join", "name":"P"+str(random.randint(0,999999999999))}
        game.main_loop()
        self.assertTrue("Game Started" in game.console.lines)

