
import { HandEvaluator } from "./hand_evaluator.js"

export class AutoPlay {

    // Assumes game state is right after the human player has moved
    constructor (game) {
        this.game = game
    }

    play_as(player_name) {

        switch(this.game.state) {
            case "empty table":
                this.play_least_card(player_name)
                break;
            case "attack in progress":
                this.beat_least_card(player_name)
                break;
            case "beat one":
            case "taking":
            case "passed on attack":
            case "passed on add":
                this.add_least_card(player_name)
                break

        }
    }

    play_least_card(player_name) {
        let hand = this.game.players[player_name].getCards()
        let card = new HandEvaluator(hand, this.game.trump_card.suit, this.game.deck).get_least_valuable_card()
        this.game.process_input(player_name, "play", card)

    }


    is_better_hand(hand_if_beat, hand_if_take) {
        let a = new HandEvaluator(hand_if_beat, this.game.trump_card.suit, this.game.deck).score_hand()
        let b = new HandEvaluator(hand_if_take, this.game.trump_card.suit, this.game.deck).score_hand()
        console.log("beat or take",a,b)
        return a >= b
    }

    beat_least_card(player_name) {
        let hand = this.game.players[player_name].getCards().filter(x => this.game.table.canDefend(x, this.game.trump_card.suit ))
        if (hand.length == 0) {        
            this.game.process_input(player_name, "take", "")
            return
        }
        let card = new HandEvaluator(hand, this.game.trump_card.suit, this.game.deck).get_least_valuable_card()
        if (this.is_better_hand(
            this.game.players[player_name].getCards().filter(x => x != card),
            this.game.players[player_name].getCards().concat(this.game.table.gatherAllCards(true))
            )) {
                this.game.process_input(player_name, "play", card)
        } else {
            console.log("Taking instead of using:", card)
            this.game.process_input(player_name, "take", "")
        }
    }

    add_least_card(player_name)  {
        let hand = this.game.players[player_name].getCards().filter(x => this.game.table.isCardOnTable(x))
        if (hand.length == 0) {        
            this.game.process_input(player_name, "pass", "")
            return
        }
        let card = new HandEvaluator(hand, this.game.trump_card.suit, this.game.deck).get_least_valuable_card()
        if (this.is_better_hand(
            this.game.players[player_name].getCards().filter(x => x != card),
            this.game.players[player_name].getCards()
            )) {
                this.game.process_input(player_name, "play", card)
        } else {
            console.log("Passing instead of adding:", card)
            this.game.process_input(player_name, "pass", "")
        }

    }

}