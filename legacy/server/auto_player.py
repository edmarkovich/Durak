import time

class AutoPlayer:
    def __init__(self, table, player):
        self.table   = table
        self.player  = player
        #time.sleep(2)

    def attack(self):
        return {"card":self.player.hand[0]}

    def add(self):
        table_ranks = map(lambda x: x.rank, self.table.pile)

        for card in self.player.hand:
            if card.rank in table_ranks:
                return {
                    "action":"add",
                    "card": card
                }
        return {"action":"pass"}

    def defend(self):
        for card in self.player.hand:
            if card.beats(self.table.pile[-1], self.table.trump):
                return {
                    "action":"defend",
                    "card":card
                }   
        return {"action":"take"}