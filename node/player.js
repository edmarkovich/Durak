export class Player {
    constructor() {
        this.cards = []
    }

    addCard(card) {
        this.cards.push(card)
    }

    numCards() {
        return this.cards.length
    }
}