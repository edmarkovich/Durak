

class Card:
    suits = ['♠', '♥', '♦', '♣']
    ranks = ['6','7','8','9','10','J','Q','K','A']

    @staticmethod
    def from_string(card):
        return Card(card[0], card[1:])


    def __init__(self, suit, rank):
        if suit not in Card.suits or rank not in Card.ranks:
            raise Exception ("Invalid card: " + suit + rank)
        self.suit = suit
        self.rank = rank

    def beats(self, other, trump):
        
        if trump not in Card.suits:
            raise Exception ("Invalid trump: " + trump)

        if self == other:
            raise Exception ("Comparing to self")
                
        if self.suit == other.suit:
            return self > other

        return self.suit == trump

    def __eq__(self, other):
        return self.rank == other.rank and self.suit == other.suit

    def __lt__(self, other):
        if self.suit != other.suit:
            raise Exception("Compare across suits")

        return Card.ranks.index(self.rank) < Card.ranks.index(other.rank) 
    
    def __str__(self):
        return self.suit+self.rank

        
        
