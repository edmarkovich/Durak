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


    def set_up_game_round(self):
        c1 = Card('♠', 'A')
        c2 = Card('♠', 'J')  

        players = Players(Deck(),2)      
        players.add_player("Ed")
        players.add_player("Fred")
        players.players["Ed"].hand = [c1, c2]
        players.players["Fred"].hand = [c1, c2]
        return GameRound(players, "Ed", "Fred", '♠')

    def test_game_round_first_attack(self):
        game_round = self.set_up_game_round()

        #Invalid Attack
        IOUtil.defaultSource = lambda: '{"action": "add", "card": "♠Q"}'
        with self.assertRaises(Exception) as context:
            game_round.first_attack()
        self.assertTrue((str(context.exception)).startswith("Card not in hand"))
        self.assertEqual(len(game_round.table.pile),0)
        self.assertEqual(len(game_round.players.players["Ed"].hand),2)

        #Valid Attack
        IOUtil.defaultSource = lambda: '{"action": "add", "card": "♠A"}'
        game_round.first_attack()
        self.assertEqual(len(game_round.table.pile),1)
        self.assertEqual(len(game_round.players.players["Ed"].hand),1)
        
    def test_game_round_defend_take(self):
        game_round = self.set_up_game_round()
        IOUtil.defaultSource = lambda: '{"action": "add", "card": "♠A"}'
        game_round.first_attack()

        IOUtil.defaultSource = lambda: '{"action": "take"}'
        self.assertEqual(game_round.defend(), "took")
        
        #TODO: taking doesn't happen now until end of the play loop
        #self.assertEqual(len(game_round.players.players["Fred"].hand),3)

    def test_game_round_defend_beat_one(self):
        game_round = self.set_up_game_round()
        IOUtil.defaultSource = lambda: '{"action": "add", "card": "♠J"}'
        game_round.first_attack()

        IOUtil.defaultSource = lambda: '{"action": "beat", "card": "♠A"}'
        self.assertEqual(game_round.defend(), "beat_one")
        self.assertEqual(len(game_round.players.players["Fred"].hand),1)

    def test_game_round_defend_beat_all(self):
        game_round = self.set_up_game_round()        
        IOUtil.defaultSource = lambda: '{"action": "add", "card": "♠J"}'
        game_round.first_attack()

        IOUtil.defaultSource = lambda: '{"action": "beat", "card": "♠A"}'
        game_round.players.players["Fred"].hand = [Card('♠', 'A')]

        self.assertEqual(game_round.defend(), "beat_all")
        self.assertEqual(len(game_round.players.players["Fred"].hand),0)

    def test_game_round_defend_beat_fail(self):
        return
        #TODO - right now not testing this because fail is a loop
        game_round = self.set_up_game_round()        
        IOUtil.defaultSource = lambda: '{"action": "add", "card": "♠A"}'
        game_round.first_attack()

        IOUtil.defaultSource = lambda: '{"action": "beat", "card": "♠J"}'

        self.assertEqual(game_round.defend(), "fail")
        self.assertEqual(len(game_round.players.players["Fred"].hand),2)        


    def test_game_round_defend_beat_bogus(self):
        game_round = self.set_up_game_round()        
        IOUtil.defaultSource = lambda: '{"action": "add", "card": "♠J"}'
        game_round.first_attack()

        IOUtil.defaultSource = lambda: '{"action": "beat", "card": "♠Q"}'

        with self.assertRaises(Exception) as context:
            game_round.defend()
        self.assertTrue((str(context.exception)).startswith("Card not in hand"))
        self.assertEqual(len(game_round.players.players["Fred"].hand),2)        

    def test_game_round_add_in_one(self):
        game_round = self.set_up_game_round()
        IOUtil.defaultSource = lambda: '{"action": "add", "card": "♠J"}'
        game_round.first_attack()

        IOUtil.defaultSource = lambda: '{"action": "beat", "card": "♠A"}'
        game_round.defend()

        # Attacker out of cards
        game_round.players.players["Ed"].hand = []
        self.assertEqual(game_round.add_in_one("Ed"), "pass")   
        game_round.players.players["Ed"].add_cards([Card.from_string('♠A')])

        # Attacker Passes
        IOUtil.defaultSource = lambda: '{"action": "pass"}'
        self.assertEqual(game_round.add_in_one("Ed"), "pass")

        # Attacker mismatches
        #IOUtil.defaultSource = lambda: '{"action": "add", "card": "♠10"}'
        #self.assertEqual(game_round.add_in_one("Ed"), "bad_card")

        # Attacker Adds
        IOUtil.defaultSource = lambda: '{"action": "add", "card": "♠A"}'
        self.assertEqual(game_round.add_in_one("Ed"), "added")    

    def test_game_round_play(self):

        class FakeInput:
            def __init__(self):
                self.inputs = [
                    '{"action": "add", "card": "♠A"}',
                    '{"action": "take"}',
                    '{"action": "pass"}'
                ]
                self.next = -1

            def get_input(self):
                self.next = self.next + 1
                return self.inputs[self.next]

        fi = FakeInput()
        IOUtil.defaultSource = fi.get_input

        game_round = self.set_up_game_round()
        game_round.play()
