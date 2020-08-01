
class Player:

    def __init__(self):
        self.hand=[]

    def needs_cards(self):
        return max(0, 6-len(self.hand))

    def add_cards(self, cards):
        self.hand = self.hand + cards

    def remove_card(self, card):
        if card not in self.hand:
            raise Exception("Card not in hand " + str(card) + ":" + str(self))
        self.hand.remove(card)

    def __str__(self):        
        out = ""
        for x in self.hand:
            out = out+str(x)
        return out
