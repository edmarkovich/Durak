import unittest
from deck import Deck

class DeskInitTestCase(unittest.TestCase):

    def test_deck_generate(self):
        deck = Deck()
        cards = deck.generateCards()
        self.assertTrue(len(cards) == 36)
        
    def test_deck_shuffle(self):
        deck = Deck()
        cards = deck.generateCards()
        shuf  = deck.shuffle(cards)
        self.assertTrue(len(shuf) == 36)
        # Technically it's possible it'll shuffle into same sequence...
        self.assertFalse( cards == shuf )

    def test_deck_init(self):
        deck = Deck()
        self.assertTrue(len(deck.cards) == 36)
