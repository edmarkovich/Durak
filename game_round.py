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

    def defend(self):
        move = IOUtil.get_input(source=None, player=self.defender)
        #TODO: validate message

        if move["action"] == "take":
            self.table.take_pile(self.players.players[self.defender])
            return "took"

        card = move["card"]
        if not self.table.defend(card, self.players.players[self.defender]):
            return "fail"

        if self.players.players[self.defender].has_cards():
            return "beat_one"
        
        return "beat_all"





