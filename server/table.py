class Table:

    def __init__(self, trump):
        self.trump = trump
        self.pile  = []
        self.attack_cards = 0

    def json(self):
        #TODO: test
        return list(map(lambda x: str(x), self.pile))

    def attack(self, card, player):
        if self.pile:

            #TODO: implement this some other way
            #if len(self.pile) % 2 == 1:
            #    raise Exception ("Attack in progress")

            if card.rank not in list(map(lambda x: x.rank, self.pile)):
                return False

        player.remove_card(card)
        self.pile.append(card)

        self.attack_cards += 1
        return True


    def defend(self, card, player):

        #TODO: implement this some other way
        #if len(self.pile) % 2 == 1:
        #    raise Exception ("Attack in progress")
        if len(self.pile) % 2 == 0:
            raise Exception ("No attack in progress")

        if not card.beats(self.pile[-1], self.trump):
            return False

        player.remove_card(card)
        self.pile.append(card)
        return True

    def take_pile(self, player):
        if not self.pile:
            raise Exception ("Nothing on the table")

        player.hand = player.hand + self.pile
