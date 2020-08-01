from deck import Deck
from player import Player

class Game:

    def __init__(self, expect_players):

        if expect_players < 2 or expect_players > 6:
            raise Exception("Invalid expected players" + str(expect_players))

        self.console = []
        self.expect_players = expect_players
        self.players = {}
        self.deck = Deck()
        self.trump_card = self.deck.peek_last()

    def add_console(self, log):
        #print(log)
        self.console.append(log)
        
    def add_player(self, name):
        if name in self.players:
            raise Exception ("Duplicate player "+ name)

        if len(self.players) == self.expect_players:
            raise Exception ("Game full")

        self.players[name] = Player()
        self.players[name].add_cards(self.deck.draw(6))

        self.add_console("Joined: "+name)

        if len(self.players) == self.expect_players:
            self.start()

    def who_goes_first(self):
        #TODO: for now, everyone will auto-show weakest trump/weakest card
        
        self.add_console("Player with smallest trump card goes first")
        least_seen = None
        least_player = list(self.players.keys())[0]
        
        for player in self.players:
            trumps = self.players[player].hand_by_suit_sorted(self.trump_card.suit)
            least = trumps[0] if trumps else None
            self.add_console(player + " shows " + str(least))

            if least:
                if not least_seen or least_seen > least:
                    least_seen = least
                    least_player = player

        return least_player    


    def player_on_left(self, player):

        if player not in self.players:
            raise Exception ("Invalid player: "+player)

        idx = 1 + list(self.players.keys()).index(player)
        
        if idx==len(self.players): idx=0
        return list(self.players.keys())[idx]

    def start(self):
        player_gap = self.expect_players - len(self.players)
        if player_gap>0:
            self.add_console("Awaiting " + str(player_gap) +" player(s)")
            return False

        self.attacker = self.who_goes_first()
        self.add_console("Game Started")
        self.add_console("Trump card: "+ str(self.trump_card))

        return True

    
    def turn(self):
        return
    
        target = self.player_on_left(self.attacker)
        passes = 0
        pile = []
        took = False
        beat = False
        
        while not took and not beat and self.players[target].has_cards():
            
            while not took and not beat:

                if not self.players[attacker].has_cards():
                    passes = passes + 1
                    break
                
                move = {} #TODO - prompt attacker
                if move.action == "pass": #not on first go
                    passes = passes + 1
                    break
                
                if move.action == "add":
                    # TODO check first versus follow-up
                    passes = 0
                    card = move.card

                    self.players[attacker].remove_card(card)
                    pile.append(card)

                    move = {} #TODO - prompt target
                    if move.action == "take":
                        #TODO - prompt attacker and other players for more cards
                        self.players[target].add_cards(pile)
                        took = True
                        break

                    if move.action == "defend":
                        card = move.card
                        if card.beats(pile[-1]):
                            self.players[defender].remove_card(card)
                            pile.append(card)
                            if not self.players[defender].has_cards():
                                beat = True
                                break
                            continue
                        else:
                            #TODO: deal with the bad move
                            pass
                
