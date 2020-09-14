export class Player {
    constructor() {
        this.cards = []
    }

    addCard(card) {
        this.cards.push(card)
    }

    addCards(cards) {
        this.cards = this.cards.concat(cards)
    }

    numCards() {
        return this.cards.length
    }

    hasCard(card) {
        return this.cards.findIndex(x => x.equals(card)) != -1
    }

    hasCards() {
        return this.cards.length>0
    }

    removeCard(card) {
        let idx = this.cards.findIndex(x => x.equals(card))
        this.cards.splice(idx, 1)
        return 1
    }
}