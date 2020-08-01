
class Player:

    def __init__(self):
        self.hand=[]

    def needs_cards(self):
        return max(0, 6-len(self.hand))

    def add_cards(self, cards):
        self.hand = self.hand + cards
