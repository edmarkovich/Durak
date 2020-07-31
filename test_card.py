import unittest
from card import Card

class CardInitTestCase(unittest.TestCase):

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

        
class CardBeatTestCase(unittest.TestCase):

    def test_case_beat_self(self):
        with self.assertRaises(Exception) as context:
            c1 = Card('♠', '8')
            c2 = Card('♠', '8')
            c1.beats(c2, '♠')
        self.assertTrue((str(context.exception)).startswith("Comparing to self"))

    def test_case_beat_bad_trump(self):
        with self.assertRaises(Exception) as context:
            c1 = Card('♠', '8')
            c2 = Card('♠', '9')
            c1.beats(c2, 'X')
        self.assertTrue((str(context.exception)).startswith("Invalid trump"))

    def test_case_beat_trump_wins(self):
        c1 = Card('♠', 'A')
        c2 = Card('♦', 'K')
        self.assertFalse(c1.beats(c2, c2.suit))
        self.assertTrue(c1.beats(c2, c1.suit))

    def test_case_beat_suits_must_match(self):
        c1 = Card('♠', 'A')
        c2 = Card('♦', 'K')
        self.assertFalse(c1.beats(c2, '♣'))

    def test_case_beat_big_card_wins(self):
        c1 = Card('♠', 'A')
        c2 = Card('♠', '10')
        self.assertTrue(c1.beats(c2, '♣'))
        self.assertFalse(c2.beats(c1, '♣'))

    def test_case_beat_big_trump_wins(self):
        c1 = Card('♠', 'A')
        c2 = Card('♠', '10')
        self.assertTrue(c1.beats(c2,'♠' ))
        self.assertFalse(c2.beats(c1, '♠'))
        
