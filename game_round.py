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

    def add_in_one(self, attacker):
        if not self.players.players[attacker].has_cards():
            return "pass"

        while True:
            move = IOUtil.get_input(source=None, player=attacker)
            #TODO: validate message

            if move["action"] == "pass":
                return "pass"

            card = move["card"]
            if not self.table.attack(card, self.players.players[attacker]):
                continue

            return "added"                

    def add_in_loop(self, took):
        #TODO: Test
        attacker = self.attacker
        passer = None

        while True:
            if passer == attacker:
                return "took" if took else "beat_all"

            out = self.add_in_one(attacker)
            if out == "pass":
                if not passer: passer = attacker
                attacker = self.players.next_attacker(attacker, self.defender)
                continue
            if out == "added" and not took:
                passer = None
                d_out = self.defend()
                if d_out == "beat_one": continue
                if d_out == "beat_all": return "beat_all"
                if d_out == "took":
                    took = True
                    continue


    def defend(self):
        while True:
            move = IOUtil.get_input(source=None, player=self.defender)
            #TODO: validate message

            if move["action"] == "take":
                self.table.take_pile(self.players.players[self.defender])
                return "took"

            card = move["card"]
            if not self.table.defend(card, self.players.players[self.defender]):
                continue

            if self.players.players[self.defender].has_cards():
                return "beat_one"
        
            return "beat_all"

    def play(self):

        self.first_attack()
        out = self.defend()

        if out == "beat_all": return "beat_all"
        return self.add_in_loop(out == "took")