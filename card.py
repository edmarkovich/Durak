

class Card:
    suits = ['♠', '♥', '♦', '♣']
    ranks = ['6','7','8','9','10','J','Q','K','A']


    def __init__(self, suit, rank):
        if suit not in Card.suits or rank not in Card.ranks:
            raise Exception ("Invalid card: " + suit + rank)
        self.suit = suit
        self.rank = rank

    def beats(self, other, trump):
        
        if trump not in Card.suits:
            raise Exception ("Invalid trump: " + trump)

        if self.rank == other.rank and self.suit == other.suit:
            raise Exception ("Comparing to self")
                
        if self.suit == other.suit:
            return Card.ranks.index(self.rank) > Card.ranks.index(other.rank) 

        return self.suit == trump
        
