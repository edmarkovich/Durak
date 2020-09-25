import {Card} from "../game_core/card.js"

export class HandEvaluator {
    constructor(hand, trump_suit,deck) {
        this.hand = hand
        this.trump_suit = trump_suit
        this.deck=deck
    }


    score_suit(suit) {
        let suit_ranks = this.hand.filter(x => x.suit == suit).map(x => 
            6+Card.ranks.indexOf(x.rank))
        if (suit_ranks.length == 0) return 0
        return (suit_ranks.reduce(function(total, number) {return total + number}) / suit_ranks.length) 
            + (suit == this.trump_suit?9*3*suit_ranks.length:0)
    }

    score_hand() {
        let score = 0

        let max_desired_cards = this.deck.cards.length > 0 ? 6 : 0
        let penalty           = this.deck.cards.length > 0 ? .1 : .5

        Card.suits.forEach(x => score += this.score_suit(x))
        if (this.hand.length>max_desired_cards) {
            score *= 1 - ((this.hand.length-max_desired_cards) * penalty)
        }
        return score
    }

    get_least_valuable_card() {
        let maxScore = 0
        let maxIndex = 0
        for (let i =0; i<this.hand.length; ++i) {
            let tmp =  Array.from(this.hand)
            tmp.splice(i,1)
            let he = new HandEvaluator(tmp, this.trump_suit, this.deck)
            let score = he.score_hand()
            if (score > maxScore) {
                maxScore=score
                maxIndex=i
            }
        }
        return this.hand[maxIndex]
    }

}