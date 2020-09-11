import {Deck} from "./deck.js"
import {Player} from "./player.js"

export class Game {
    constructor(player_names) {
        this.players = {}
        this.deck = new Deck()
        let self=this
        player_names.forEach( function (p) { self.players[p] = new Player() ; self.refill_player_cards(p) })

        //TODO: add correct logic for first attacker
        this.first_attacker = this.attacker = player_names[0]
        this.defender = player_names[1]
        this.state = "empty table"
    }

    process_input(player_name, verb, card) {
        switch (this.state) {

            case "empty table":
                /* 
                    player == attacker
                    verb == "play"
                    player has the card
                    take card from player to table
                    this.state = "attack in progress"
                    */
                break;
            case "attack in progress":
                /*
                    player == defender
                    verb is "play":
                        player has card?
                        card can beat top of table?
                        take card from player to table?
                        if beat 6 cards or has no cards:
                            this.state = "beat done"
                        else
                            this.state = "beat one"
                    verb is "take":
                        if this is 6th attack:
                            this.state = "took done"
                        else
                            this.state = "taking"
                */
               break
            case "beat one":
                /*
                    player == attacker
                    verb is "play":
                        attacker has card
                        card matches table?
                        take card from player put on table
                        this.state = "attack in progress"
                    verb is "pass":
                        this.passer = player
                        this.attacker = next player
                        this.state = "passed on attack"
                */
               break
            case "taking":
                /*
                    player == attacker
                    verb == play
                        attacker has card
                        card matches table
                        take card from player, put on table
                        this.state = "taking"
                    ver =="pass"
                        this.passer = player
                        this.attacker = next player
                        this.state = "passed on add"
                */
               break
            case "passed on attack":
                /*
                    player == attacker
                    if verb == "play":
                        player has card?
                        card matches table?
                        put card on table
                        this.passer = null
                        this.state = "attack in progress"
                    if verb == "pass"
                        this.attacker = next player
                        if this.attacker == this.passer
                            this.state = "beat done"
                        else
                            this.state = "passed on attack"
                */
               break
            case "passed on add":
                /*
                    player == attacker
                    if verb == pass:
                        this.attacker = next player
                        if this.attacker == this.passer
                            this.state = "beat all"
                    if verb == play:
                        player has card
                        card matches table
                        put card on table
                        passer = null
                        this.state = "taking"
                */
                break;

        }


    }


    refill_player_cards(player_name) {
        while (this.players[player_name].numCards() < 6) {
            let card = this.deck.takeCard()
            if (!card) return;
            this.players[player_name].addCard(card)
        }
    }
}