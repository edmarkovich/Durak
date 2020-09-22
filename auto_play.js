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
        this.game.process_input(player_name, "play", hand[0])

    }

    beat_least_card(player_name) {
        let hand = this.game.players[player_name].getCards()
        for (let i =0; i<hand.length; ++i) {
            if (this.game.table.canDefend(hand[i], this.game.trump_card.suit)) {
                this.game.process_input(player_name, "play", hand[i])
                return
            }
        }
        this.game.process_input(player_name, "take", "")
    }

    add_least_card(player_name)  {
        let hand = this.game.players[player_name].getCards()
        for (let i =0; i<hand.length; ++i) {
            if (this.game.table.isCardOnTable(hand[i])) {
                this.game.process_input(player_name, "play", hand[i])
                return
            }
        }
        this.game.process_input(player_name, "pass", "")

    }

}