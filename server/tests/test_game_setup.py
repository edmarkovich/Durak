import unittest
import random
from server.game_setup import GameSetup
from server.ioutil import IOUtil
random.seed(1) #TODO

class GameTestSetupCase(unittest.TestCase):

    def test_game_await_single_join(self):
        game = GameSetup(2)

        IOUtil.defaultSource = lambda: '{"name":"Someone"}'
        with self.assertRaises(Exception) as context:
            game.await_single_join()       
        self.assertTrue((str(context.exception)).startswith("Invalid join"))
        
 
        IOUtil.defaultSource = lambda: '{"action":"join"}'
        with self.assertRaises(Exception) as context:
            game.await_single_join()       
        self.assertTrue((str(context.exception)).startswith("Invalid join"))

        IOUtil.defaultSource = lambda: '{"action":"join_bad", "name":"Someone"}'
        with self.assertRaises(Exception) as context:
            game.await_single_join()       
        self.assertTrue((str(context.exception)).startswith("Invalid join"))

        IOUtil.defaultSource = lambda: '{"action":"join", "name":""}'
        with self.assertRaises(Exception) as context:
            game.await_single_join()       
        self.assertTrue((str(context.exception)).startswith("Invalid join"))


        self.assertEqual(len(game.players.players), 0)
        IOUtil.defaultSource = lambda: '{"action":"join", "name":"Someone"}'
        game.await_single_join()  
        self.assertEqual(len(game.players.players), 1)
        self.assertTrue("Someone" in game.players.players)

        with self.assertRaises(Exception) as context:
            game.await_single_join()  
        self.assertTrue((str(context.exception)).startswith("Duplicate player"))

    def test_game_await_all_join(self):
        game = GameSetup(4)
        #Technically could be a collision
        IOUtil.defaultSource = lambda: '{"action":"join", "name":"P'+str(random.randint(0,999999999999))+'"}'
        game.await_all_join()
        self.assertEqual(len(game.players.players), 4)
