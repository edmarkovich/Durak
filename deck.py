from card import Card
import random
class Deck:

    def __init__(self):
        self.cards = self.shuffle(self.generateCards())

    def generateCards(self):
        cards = []
        for x in Card.suits:
            for y in Card.ranks:                
                cards.append(Card(x,y))
        return cards

    def shuffle(self, cards):
        #TODO - random seeds
        return random.sample(cards, len(cards))
                    
    def __str__(self):        
        out = ""
        for x in self.cards:
            out = out+str(x)
        return out
        
                
