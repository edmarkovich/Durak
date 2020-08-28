from .players import Players
from .deck import Deck #Ugly
from .ioutil import IOUtil

class GameSetup:

    def __init__(self, expect_players, computer_players, ioutil):
        self.expect_players = expect_players
        self.computer_players = computer_players
        self.deck = Deck()
        self.players = Players(self.deck, self.expect_players+self.computer_players)
        self.ioutil = ioutil

    def await_single_join(self):
        out = self.ioutil.get_input({"prompt":"User Join"})

        #if "action" not in out or "name" not in out or out["action"] != "join" or len(out["name"])==0:
        #    raise Exception("Invalid join: "+str(out))

        self.players.add_player(out["name"])

    def await_all_join(self):
        while len(self.players.players) < self.expect_players:
            self.await_single_join()

        for i in range(self.computer_players):
            self.players.add_player("🤖 Bot " +str(i+1), True)

