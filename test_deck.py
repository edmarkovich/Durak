import unittest
from deck import Deck

class DeskTestCase(unittest.TestCase):

    def test_deck_generate(self):
        deck = Deck()
        cards = deck.generate_cards()
        self.assertTrue(len(cards) == 36)
        
    def test_deck_shuffle(self):
        deck = Deck()
        cards = deck.generate_cards()
        shuf  = deck.shuffle(cards)
        self.assertTrue(len(shuf) == 36)
        # Technically it's possible it'll shuffle into same sequence...
        self.assertFalse( cards == shuf )

    def test_deck_init(self):
        deck = Deck()
        self.assertTrue(len(deck.cards) == 36)

    def test_deck_string(self):
        deck = Deck()
        #each card is 2 chars (suit+rank) except the 4 10s
        self.assertTrue(len(str(deck)) == 36*2 +4)

    def test_deck_peek(self):
        deck = Deck()
        deck.cards = deck.generate_cards()
        card = deck.peek_last()
        self.assertTrue(card.rank == '6')

        with self.assertRaises(Exception) as context:
            deck.cards = []
            card = deck.peek_last()
        self.assertTrue((str(context.exception)).startswith("Empty deck"))
