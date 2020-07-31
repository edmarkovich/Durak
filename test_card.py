import unittest
from card import Card

class CardTestCase(unittest.TestCase):

    def test_create_valid_card(self):
        c = Card('♠', '8')
        self.assertEqual(c.suit,'♠')
        self.assertEqual(c.rank,'8')

    def test_create_invalid_card_suit(self):
        with self.assertRaises(Exception) as context:
            c = Card('Z', '8')
        self.assertTrue((str(context.exception)).startswith("Invalid card:"))

    def test_create_invalid_card_rank(self):
        with self.assertRaises(Exception) as context:
            c = Card('♠', 'Z')
        self.assertTrue((str(context.exception)).startswith("Invalid card:"))
        
