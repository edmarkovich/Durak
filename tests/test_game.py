import unittest
from game import Game
from card import Card
from game_setup import GameSetup

class GameTestCase(unittest.TestCase):

    def test_game_init(self):
        game = Game(2)
        self.assertTrue(game.console)
        self.assertTrue(game.expect_players==2)

        game = Game(6)
        self.assertTrue(game.expect_players==6)        

        with self.assertRaises(Exception) as context:
            game = Game(1)       
        self.assertTrue((str(context.exception)).startswith("Invalid expected"))
    
        with self.assertRaises(Exception) as context:
            game = Game(7)
        self.assertTrue((str(context.exception)).startswith("Invalid expected"))
        
        
    def test_game_start(self):        
        game = Game(2)    
        game_setup = GameSetup(2)
        
        game_setup.players.add_player("Ed1")
        
        with self.assertRaises(Exception) as context:
            game.start(game_setup)
        self.assertTrue((str(context.exception)).startswith("Not enough players"))

        self.assertFalse(hasattr(game, 'attacker'))

        game_setup.players.add_player("Ed2")
        game.start(game_setup)
        self.assertTrue(game.attacker)
        self.assertTrue(game.console.lines[-2] == "Game Started")
        self.assertTrue(game.console.lines[-1].startswith("Trump card"))


    def test_game_is_game_over(self):
        game = Game(2)    
        game_setup = GameSetup(2)        
        game_setup.players.add_player("Ed1")
        game_setup.players.add_player("Ed2")
        game.start(game_setup)
        self.assertFalse(game.is_game_over())
        
        game.players.players["Ed1"].hand = []
        self.assertTrue(game.is_game_over())

    def test_game_main_loop(self):        
        game = Game(4)
        game.get_input = lambda x: {"action":"join", "name":"P"+str(random.randint(0,999999999999))}
        #game.main_loop()
        #self.assertTrue("Game Started" in game.console.lines)
        #TODO - more here

