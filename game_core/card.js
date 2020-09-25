export class Card {

    static ranks = ['6','7','8','9','10','J','Q','K','A']
    static suits = ['♠',	'♥',	'♦',	'♣'];


    constructor(suit, rank) {
        if (rank==undefined) { // assume first argument is a string like ♥10
            this.suit = suit[0]
            this.rank = suit.substring(1)

        } else {
            this.suit = suit
            this.rank = rank
        }
    }

    canBeat(other, trump_suit) {
        if (this.suit == trump_suit && other.suit != trump_suit) {
            return true
        }
        if (this.suit != other.suit) {
            return false
        }
        
        return (Card.ranks.indexOf(this.rank) > Card.ranks.indexOf(other.rank))
    }

    toString() {
        return ""+this.suit+this.rank
    }

    equals(other) {
        return this.suit == other.suit && this.rank == other.rank
    }
}