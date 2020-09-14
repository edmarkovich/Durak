export class Table {
    constructor (trump_suit) {
        this.pairs= []
        this.trump_suit = trump_suit
        this.done_pile = []
    }

    attack(card) {
        this.pairs.push([card, null])
    }

    defend(card) {
        this.pairs[this.pairs.length-1][1] = card
    }

    canDefend(card, trump_suit) {
        return card.canBeat(this.pairs[this.pairs.length-1][0], trump_suit)
    }

    isCardOnTable(card) {
        let out = false
        this.pairs.forEach( function(pair) { 
            if (pair[0].rank == card.rank) { out = true}
            if (pair[1] && pair[1].rank == card.rank) { out = true}
        } )    
        return out
    }

    numPairs() {
        return this.pairs.length
    }

    gatherAllCards() {
        let out = []
        this.pairs.forEach( function(pair) { 
            out.push(pair[0])
            if (pair[1]) { out.push(pair[1])}
        } )    
        this.pairs = []
        return out   
    }

    putInDonePile() {
        this.done_pile = this.done_pile.concat(this.gatherAllCards())
    }


}