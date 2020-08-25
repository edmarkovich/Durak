from .table import Table
from .ioutil import IOUtil
from .auto_player import AutoPlayer

class GameRound:

    def __init__(self, players, attacker, defender, trump):
        self.players = players
        self.attacker = attacker
        self.defender = defender
        self.table = Table(trump)

    def first_attack(self):

        prompt = {'prompt':"Attack", "player": self.attacker}
        if self.players.players[self.attacker].is_computer:
            IOUtil.send_updated_game_state(prompt)
            move = AutoPlayer(self.table, self.players.players[self.attacker]).attack()
        else:
            move = IOUtil.get_input(prompt)

        #TODO: validate message
        card = move["card"]

        self.table.attack(card, self.players.players[self.attacker])

    def add_in_one(self, attacker):

        if not self.players.players[attacker].has_cards():
            return "pass"

        while True:
            prompt = {"prompt":"Add", "player":attacker}
            if self.players.players[attacker].is_computer:
                IOUtil.send_updated_game_state(prompt)
                move = AutoPlayer(self.table, self.players.players[attacker]).add()
            else:
                move = IOUtil.get_input(prompt)
            #TODO: validate message

            if move["action"] == "pass":
                IOUtil.notify("" + attacker + " passed")
                return "pass"

            card = move["card"]
            if not self.table.attack(card, self.players.players[attacker]):
                continue
            return "added"

    def add_in_loop(self, took):

        #TODO: Test
        attacker = self.attacker
        passer = []

        while True:
            #Attcker = None = Game over? Test it
            if attacker in passer or self.table.attack_cards==6 or attacker == None:
                return "took" if took else "beat_all"

            out = self.add_in_one(attacker)
            if out == "pass":
                passer.append(attacker) 
                attacker = self.players.next_attacker(attacker, self.defender)
                if attacker in passer:
                    attacker = None
                continue
            if out == "added" and not took:
                passer = []

                d_out = self.defend()
                if d_out == "beat_one": 
                    continue
                if d_out == "beat_all": 
                    return "beat_all"
                if d_out == "took":
                    took = True
                    continue


    def defend(self):
        while True:
            prompt = {'prompt':"Defend", 'player':self.defender}
            if self.players.players[self.defender].is_computer:
                IOUtil.send_updated_game_state(prompt)
                move = AutoPlayer(self.table, self.players.players[self.defender]).defend()
            else:
                move = IOUtil.get_input(prompt)
            #TODO: validate message

            if move["action"] == "take":
                IOUtil.notify(""+" " + self.defender + " took")
                return "took"

            card = move["card"]
            if not self.table.defend(card, self.players.players[self.defender]):
                continue

            #if defender beats 6 cards, or uses all his cards, he won this round
            if self.table.attack_cards == 6 or not self.players.players[self.defender].has_cards():
                IOUtil.notify(""+str(card)+" " + self.defender + " beat all")
                return "beat_all"

            IOUtil.notify(""+str(card)+" " + self.defender + " beat")   
            return "beat_one"

    def play(self):

        self.first_attack()
        out = self.defend()

        if out == "beat_all":
            return "beat_all"

        out = self.add_in_loop(out == "took")
        if out == "took":
            self.table.take_pile(self.players.players[self.defender])

        return out
