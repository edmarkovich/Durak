import unittest
from player import Player
from card import Card

class PlayerTestCase(unittest.TestCase):

    def test_player_add_cards(self):
        player = Player()
        player.add_cards([Card('♠', '10'), Card('♠', 'J')])
        self.assertTrue(len(player.hand) == 2)                         
        
    def test_player_needs_cards(self):
        player = Player()

        self.assertTrue(player.needs_cards() == 6)

        # Bring me up to 6 cards
        player.add_cards([Card('♠', '10'), Card('♠', 'J')])
        self.assertTrue(player.needs_cards() == 4)

        # Have exactly 6, don't need
        player.add_cards([Card('♠', '6'), Card('♠', '7'),
                          Card('♠', '8'), Card('♠', '9')])
        self.assertTrue(player.needs_cards() == 0)                         

        # Have more than 6, don't need
        player.add_cards([Card('♠', 'Q')])
        self.assertTrue(player.needs_cards() == 0)                         

    def test_player_remove_card(self):
        player = Player()
        player.add_cards([Card('♠', '10'), Card('♠', 'J')])
        
        player.remove_card(Card('♠', 'J'))
        self.assertTrue(len(player.hand) == 1)                         

        with self.assertRaises(Exception) as context:
            player.remove_card(Card('♠', 'J'))
        self.assertTrue((str(context.exception)).startswith("Card not in hand"))

    def test_player_str(self):
        player = Player()
        player.add_cards([Card('♠', '10'), Card('♠', 'J')])
        self.assertTrue(len(str(player)) == 5)
    
