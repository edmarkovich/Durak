import {Deck} from "./deck.js"
import {Player} from "./player.js"

export class Game {
    constructor(player_names) {
        this.players = {}
        this.deck = new Deck()
        let self=this
        player_names.forEach( function (p) { self.players[p] = new Player() ; self.refill_player_cards(p) })
    }

    refill_player_cards(player_name) {
        while (this.players[player_name].numCards() < 6) {
            let card = this.deck.takeCard()
            if (!card) return;
            this.players[player_name].addCard(card)
        }
    }
}