import { Card } from "./card.js";

export class Deck {
    constructor() {
        this.cards = []
        let suits = ['♠',	'♥',	'♦',	'♣'];
        let ranks = ['6','7','8','9','10','J','Q','K','A']
        suits.forEach(s=> ranks.forEach(r => this.cards.push(new Card(s,r,))))
        this.shuffle()
        console.log(this.cards)
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    takeCard() {
        return this.cards.pop()
    }
}