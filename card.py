

class Card:
    suits = ['♠', '♥', '♦', '♣']
    ranks = ['6','7','8','9','10','J','Q','K','A']


    def __init__(self, suit, rank):
        if suit not in Card.suits or rank not in Card.ranks:
            raise Exception ("Invalid card: " + suit + rank)
            return
        self.suit = suit
        self.rank = rank

