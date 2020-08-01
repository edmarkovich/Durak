from table import Table
from ioutil import IOUtil

class GameRound:

    def __init__(self, players, attacker, defender, trump):
        self.players = players
        self.attacker = attacker
        self.defender = defender
        self.table = Table(trump)


    def first_attack(self):
        move = IOUtil.get_input(source=None, player=self.attacker)
        #TODO: validate message
        card = move["card"]
        
        self.table.attack(card, self.players.players[self.attacker])





