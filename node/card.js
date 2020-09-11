export class Card {
    constructor(suit, rank) {
        this.suit = suit
        this.rank = rank
    }

    toString() {
        return ""+this.suit+this.rank
    }
}