import unittest
from players import Players
from player import Player
from card import Card
from deck import Deck

class PlayersTestCase(unittest.TestCase):

    def test_players_init(self):
        deck = Deck()
        players = Players(deck,3)
        self.assertTrue(not players.players)
        self.assertEqual(deck, players.deck)
        self.assertEqual(3, players.expect_players)
        self.assertTrue(players.console)
        


    def test_players_add_player(self):
        deck = Deck()
        players = Players(deck,4)
        players.add_player("Ed")
        self.assertTrue(len(players.players["Ed"].hand) == 6)
        self.assertTrue(len(players.deck.cards) == 30)

        players.add_player("Mike")
        self.assertTrue(len(players.players["Mike"].hand) == 6)
        self.assertTrue(len(players.deck.cards) == 24)

        with self.assertRaises(Exception) as context:
            players.add_player("Mike")
        self.assertTrue((str(context.exception)).startswith("Duplicate player"))

        players.add_player("Jon")
        players.add_player("Conway")
        self.assertTrue(len(players.deck.cards) == 12)
        self.assertTrue("Joined: Conway" in players.console.lines)
        #self.assertTrue("Players Started" in players.console.lines)

        with self.assertRaises(Exception) as context:
            players.add_player("Fred")
        self.assertTrue((str(context.exception)).startswith("Players full"))

    def test_players_who_goes_first(self):
        deck = Deck()
        players = Players(deck,3)
        trump = '♠'
        players.add_player("Ed1")
        players.add_player("Ed2")
        players.add_player("Ed3")
        players.players["Ed1"].hand = [Card(trump, '10'), Card(trump, '9')]
        players.players["Ed2"].hand = [Card(trump, 'A'), Card(trump, '6')]
        players.players["Ed3"].hand = []
        
        self.assertTrue(players.who_goes_first(trump) == "Ed2")
        self.assertTrue(players.console.lines[-1] == "Ed3 shows None")
        self.assertTrue(players.console.lines[-3].startswith("Ed1 shows "+trump+"9"))

    def test_players_who_goes_first_default(self):
        deck = Deck()
        players = Players(deck,2)
        players.add_player("Ed1")
        players.add_player("Ed2")
        players.players["Ed1"].hand = []
        players.players["Ed2"].hand = []
        self.assertTrue(players.who_goes_first('♠') == "Ed1")

    def test_players_player_on_left(self):
        deck = Deck()
        players = Players(deck,3)
        players.add_player("Ed1")
        players.add_player("Ed2")
        players.add_player("Ed3")

        self.assertTrue(players.player_on_left("Ed2") == "Ed3")
        self.assertTrue(players.player_on_left("Ed3") == "Ed1")
        with self.assertRaises(Exception) as context:
            players.player_on_left("Rando")
        self.assertTrue((str(context.exception)).startswith("Invalid player: Rando"))

    def test_players_next_attacker(self):
        deck = Deck()
        players = Players(deck,3)
        players.add_player("Ed1")
        players.add_player("Ed2")
        players.add_player("Ed3")

        self.assertEqual(players.next_attacker("Ed2", "Ed1", None), "Ed3")
        self.assertEqual(players.next_attacker("Ed2", "Ed3", None), "Ed1")

        self.assertEqual(players.next_attacker("Ed2", "Ed1", "Ed2"), "Ed3")
        self.assertEqual(players.next_attacker("Ed2", "Ed3", "Ed2"), "Ed1")

        
        players.players["Ed1"].hand = []
        self.assertEqual(players.next_attacker("Ed2", "Ed3", None), "Ed2")
        self.assertEqual(players.next_attacker("Ed2", "Ed3", "Ed2"), None)

        players.players["Ed2"].hand = []
        self.assertEqual(players.next_attacker("Ed2", "Ed3", None), None)
        self.assertEqual(players.next_attacker("Ed2", "Ed3", "Ed2"), None)        
