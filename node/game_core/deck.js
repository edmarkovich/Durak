import { Card } from "./card.js";
import seedrandom   from 'seedrandom';
var rng = seedrandom('hello.');

export class Deck {
    constructor() {
        
        this.cards = []
        let suits = ['♠',	'♥',	'♦',	'♣'];
        suits.forEach(s=> Card.ranks.forEach(r => this.cards.push(new Card(s,r,))))
        this.shuffle()
        this.trump_suit = this.cards[0].suit
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    takeCard() {
        return this.cards.pop()
    }
}