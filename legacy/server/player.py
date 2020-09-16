from .card import Card
import functools
class Player:

    def __init__(self, cards=[], is_computer=False):
        self.hand=cards
        self.is_computer = is_computer

    def needs_cards(self):
        return max(0, 6-len(self.hand))

    def add_cards(self, cards):
        self.hand = self.hand + cards

    def remove_card(self, card):
        if card not in self.hand:
            raise Exception("Card not in hand " + str(card) + ":" + str(self))
        self.hand.remove(card)

    def hand_by_suit_sorted(self, suit):
        return sorted(list(filter(lambda x: x.suit == suit, self.hand)))

    def has_cards(self):
        return len(self.hand) > 0

    def json(self, trump):
        #TODO -test
        def comp(a,b):
            if a.suit == b.suit: return 1 if a>b else -1
            if a.suit == trump: return 1
            if b.suit == trump: return -1
            return 1 if a>b else -1

        s = sorted(self.hand,
            key=functools.cmp_to_key(comp))

        return list(map(lambda x: str(x), s))

    def __str__(self):
        out = "["
        for card in self.hand:
            out += '"' + str(card) + '", '
        return out+' "xx"]'
