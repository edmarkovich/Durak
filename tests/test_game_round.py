import unittest
from game_round import GameRound
from players import Players
from player import Player
from card import Card
from ioutil import IOUtil
from deck import Deck

class GameRoundTestCase(unittest.TestCase):

    def test_game_round_init(self):
        players = Players(None, 0)
        game_round = GameRound(players, "A", "B", '♠')
        self.assertEqual(game_round.players, players)
        self.assertEqual(game_round.attacker, "A")
        self.assertEqual(game_round.defender, "B")
        self.assertTrue(game_round.table)

    def test_game_round_first_attack(self):
        c1 = Card('♠', 'A')
        c2 = Card('♦', 'K')  

        players = Players(Deck(),2)      
        players.add_player("Ed")
        players.add_player("Fred")
        players.players["Ed"].hand = [c1, c2]
        players.players["Fred"].hand = [c1, c2]
        game_round = GameRound(players, "Ed", "Fred", '♠')

        #Invalid Attack
        IOUtil.defaultSource = lambda: '{"action": "add", "card": "♠Q"}'
        with self.assertRaises(Exception) as context:
            game_round.first_attack()
        self.assertTrue((str(context.exception)).startswith("Card not in hand"))
        self.assertEqual(len(game_round.table.pile),0)
        self.assertEqual(len(players.players["Ed"].hand),2)

        #Valid Attack
        IOUtil.defaultSource = lambda: '{"action": "add", "card": "♠A"}'
        game_round.first_attack()
        self.assertEqual(len(game_round.table.pile),1)
        self.assertEqual(len(players.players["Ed"].hand),1)
        

