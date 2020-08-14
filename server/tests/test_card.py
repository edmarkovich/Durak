import unittest
from server.card import Card

class CardTestCase(unittest.TestCase):

    def test_card_from_string(self):
        c = Card.from_string("♠8")
        self.assertEqual(c.suit, "♠")
        self.assertEqual(c.rank, "8")

    def test_card_create_valid(self):
        c = Card('♠', '8')
        self.assertEqual(c.suit,'♠')
        self.assertEqual(c.rank,'8')

    def test_card_create_invalid_suit(self):
        with self.assertRaises(Exception) as context:
            c = Card('Z', '8')
        self.assertTrue((str(context.exception)).startswith("Invalid card:"))

    def test_card_create_invalid_rank(self):
        with self.assertRaises(Exception) as context:
            c = Card('♠', 'Z')
        self.assertTrue((str(context.exception)).startswith("Invalid card:"))


    def test_card_beat_self(self):        
        with self.assertRaises(Exception) as context:
            c1 = Card('♠', '8')
            c2 = Card('♠', '8')
            c1.beats(c2, '♠')
        self.assertTrue((str(context.exception)).startswith("Comparing to self"))

    def test_card_beat_bad_trump(self):
        with self.assertRaises(Exception) as context:
            c1 = Card('♠', '8')
            c2 = Card('♠', '9')
            c1.beats(c2, 'X')
        self.assertTrue((str(context.exception)).startswith("Invalid trump"))

    def test_card_beat_trump_wins(self):
        c1 = Card('♠', 'A')
        c2 = Card('♦', 'K')
        self.assertFalse(c1.beats(c2, c2.suit))
        self.assertTrue(c1.beats(c2, c1.suit))

    def test_card_beat_suits_must_match(self):
        c1 = Card('♠', 'A')
        c2 = Card('♦', 'K')
        self.assertFalse(c1.beats(c2, '♣'))

    def test_card_beat_big_card_wins(self):
        c1 = Card('♠', 'A')
        c2 = Card('♠', '10')
        self.assertTrue(c1.beats(c2, '♣'))
        self.assertFalse(c2.beats(c1, '♣'))

    def test_card_beat_big_trump_wins(self):
        c1 = Card('♠', 'A')
        c2 = Card('♠', '10')
        self.assertTrue(c1.beats(c2,'♠' ))
        self.assertFalse(c2.beats(c1, '♠'))
        

    def test_card_string(self):
        c1 = Card('♠', 'A')
        self.assertTrue(str(c1) == '♠A')

    def test_card_equals(self):
        c1 = Card('♠', 'A')
        c2 = Card('♠', 'A')
        c3 = Card('♠', 'K')
        c4 = Card('♦', 'K')

        self.assertTrue(c1 == c2)
        self.assertTrue(c1 != c3)
        self.assertTrue(c4 != c3)        

    def test_card_lt(self):
        c1 = Card('♠', 'A')
        c2 = Card('♠', 'K')

        self.assertTrue(c1 > c2)
        self.assertTrue(c2 < c1)

