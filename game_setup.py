from players import Players
from deck import Deck #Ugly
from ioutil import IOUtil
import random #Ugly

class GameSetup:

    def __init__(self, expect_players):
        self.expect_players = expect_players 
        self.deck = Deck()
        self.players = Players(self.deck, self.expect_players)

    def await_single_join(self):
        out = IOUtil.get_input(self.input_source)

        if "action" not in out or "name" not in out or out["action"] != "join" or len(out["name"])==0:            
            raise Exception("Invalid join: "+str(out))

        self.players.add_player(out["name"])

    def await_all_join(self):
        while len(self.players.players) < self.expect_players:
            self.await_single_join()