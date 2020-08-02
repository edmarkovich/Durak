from card import Card
import random
random.seed(1) #TODO

class Deck:

    def __init__(self):
        self.cards = self.shuffle(self.generate_cards())

    def generate_cards(self):
        cards = []
        for x in Card.suits:
            for y in Card.ranks:                
                cards.append(Card(x,y))
        return cards

    def shuffle(self, cards):
        #TODO - random seeds
        return random.sample(cards, len(cards))

    def peek_last(self):
        if not self.cards:
            raise Exception("Empty deck")

        return self.cards[0]

    # Draw up to this many cards out of the deck
    def draw(self, num_cards):
        out = self.cards[num_cards* -1 : ]
        self.cards = self.cards[0 : (len(self.cards) - len(out))]
        return out                                
    
    def __str__(self):        
        out = ""
        for x in self.cards:
            out = out+str(x)
        return out
        
                
