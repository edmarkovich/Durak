from .player import Player
from .console import Console

class Players:

    def __init__(self, deck, expect_players):
        self.players = {}
        self.deck = deck
        self.expect_players = expect_players
        self.console = Console.getInstance()

    def __str__(self):
        out = ""
        for player in self.players:
            p = player +" " + str(len(self.players[player].hand))
            out += "   " + p.ljust(10," ") +": " + str(self.players[player]) + "\n"        
        return out


    def add_player(self, name):
        if name in self.players:
            raise Exception ("Duplicate player "+ name)

        if len(self.players) == self.expect_players:
            raise Exception ("Players full")

        self.players[name] = Player()
        self.players[name].add_cards(self.deck.draw(6)) 

        self.console.add("Joined: "+name)

    def who_goes_first(self, trump):
        #TODO: for now, everyone will auto-show weakest trump/weakest card
        
        self.console.add("Player with smallest trump card goes first")
        least_seen = None
        least_player = list(self.players.keys())[0]
        
        for player in self.players:
            trumps = self.players[player].hand_by_suit_sorted(trump)
            least = trumps[0] if trumps else None
            self.console.add(player + " shows " + str(least))

            if least:
                if not least_seen or least_seen > least:
                    least_seen = least
                    least_player = player

        return least_player            

    def player_on_left(self, player, skip_no_cards = True):

        if player not in self.players:
            raise Exception ("Invalid player: "+player)
        candidate = player
        
        while True:
            idx = 1 + list(self.players.keys()).index(candidate)        
            if idx==len(self.players): idx=0
            candidate = list(self.players.keys())[idx]

            if self.players[candidate].has_cards() or not skip_no_cards: #TODO: add this case to test
                return candidate
            
            if candidate == player:
                return None 
            
    def is_game_over(self):
        with_cards = 0
        for p in self.players:
            if self.players[p].has_cards(): with_cards += 1        
        return with_cards < 2        

    def next_attacker(self, current, defender):
        if self.is_game_over(): return None
        candidate = current
        while True:
            candidate = self.player_on_left(candidate)
            if candidate == defender: continue            
            if self.players[candidate].has_cards(): return candidate            
            if candidate == current:
                return None   


    def refill_one(self, player):
        need = self.players[player].needs_cards()
        cards = self.deck.draw(need)
        self.players[player].add_cards(cards)
    
    def refill_all(self, attacker, defender):        
        self.refill_one(attacker)
        player = attacker
        while True:            
            player = self.player_on_left(player, False) #TODO: test the 'false' case
            if player == defender: continue
            if player == attacker: break  
            self.refill_one(player)          
        self.refill_one(defender) 
