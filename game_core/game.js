import {Deck} from "./deck.js"
import {Player} from "./player.js"
import { Table } from "./table.js"
import { Card } from "./card.js"

export class Game {
    constructor(player_names, game_id) {
        this.players = {}
        this.deck = new Deck()
        this.trump_card = this.deck.cards[0]
        let self=this
        player_names.forEach( function (p) { self.players[p] = new Player() ; self.refill_player_cards(p) })

        //TODO: add correct logic for first attacker
        this.first_attacker = this.attacker = player_names[0]
        this.defender = player_names[1]
        this.table = new Table()
        this.state = "empty table"
        this.error = null
        this.passers = []
        this.game_id = game_id
    }

    check_player(player_name, state) {
        if (state == "attack in progress") {
            var expected = this.defender
        } else {
            expected = this.attacker
        }


        if (player_name !== expected) { 
            this.error = "Unexpected player: "+player_name+". Expecting: " + expected
            return false
        }
        return true
    } 

    check_verb(verb) {

        switch(this.state) {
            case "empty table":
                var expected_array = ['play']
                break
            case "attack in progress":
                expected_array = ['play', 'take']
                break  
            default:
                expected_array = ['play', 'pass']
                break                
        }

        if (expected_array.indexOf(verb) == -1) {
            this.error = "Unexpected verb: " + verb +". Expecting: " + expected_array
            return false
        }
        return true
    }

    check_card(player_name, verb, card) {

        if (verb != 'play') return true

        if (!this.players[player_name].hasCard(card)) {
            this.error = "Player " + player_name + " does not have card " + card;
            return false
        }

        switch (this.state) {
            case 'empty table':
                return true
            case 'attack in progress':
                if (!this.table.canDefend(card, this.deck.trump_suit)) {
                    this.error = "Card " + card + " does not beat the table card"
                    return false
                }
                return true
            default:
                if (!this.table.isCardOnTable(card)) {
                    this.error = "Card " + card + " does not match table cards"
                    return false
                }
        }
        return true
    }

    play_card(player_name, card) {
        this.players[player_name].removeCard(card)
        if (this.state == "attack in progress") {
            this.table.defend(card)
        } else {
            this.table.attack(card)
        }
    }

    can_play_more() {
        return this.players[this.defender].hasCards() 
            && this.table.numPairs()<6
            && this.table.numUnbeatPairs() < this.players[this.defender].numCards()
    }

    attacker_is_out_of_cards() {
        return !(this.players[this.attacker].hasCards())
    }

    set_next_attacker() {
        let ps = Object.entries(this.players).map(x => x[0])
        let idx = ps.indexOf(this.attacker)
        while (true) {
            idx++
            if (idx == ps.length) { idx = 0 }
            if (ps[idx] == this.defender) { continue }
            if (ps[idx] == this.attacker) { return false }
            if (!this.players[ps[idx]].hasCards()) { continue }
            this.attacker = ps[idx]
            return true
        }


    }

    prepare_next_round() {
        if (this.state == "beat done") {
            this.table.putInDonePile()
        } else if (this.state == "took done") {
            this.players[this.defender].addCards(this.table.gatherAllCards())
        } else {
            // Came can end on someone beating or taking
            if (this.is_game_over()) {
                this.state = "game over"     
                return true           
            }
            return false
        }

        this.refill_all_players()

        if (this.is_game_over()) {
            this.state = "game over"
        } else {
            this.set_players_for_next_round()
            this.state = "empty table"
            this.passers = []
        }
        return true
    }

    is_game_over() {
        if (this.deck.cards.length>0) return false

        let still_in = 0
        Object.entries(this.players).forEach(x => {if(x[1].hasCards()) still_in++} )
        return still_in<2
    }


    set_players_for_next_round() {
        let ps = Object.entries(this.players).map(x=>x[0])
        let start = ps.indexOf(this.defender)
        if (this.state == "took done") start++
        let idx = start
        this.attacker = null

        while (true) {
            if (this.players[ps[idx % ps.length]].hasCards()) {
                if (!this.attacker) {
                    this.first_attacker = this.attacker = ps[idx % ps.length]
                } else {
                    this.defender = ps[idx % ps.length]
                    break
                }                
            } 
            idx++
        }
        
    }

    process_input(player_name, verb, card) {
        console.log(this.game_id, player_name,verb,card)
        this.error = null;
        
        if (!this.check_player(player_name, this.state)) return
        if (!this.check_verb(verb))                      return

        if (verb=="play") {
            if (typeof(card) == "string") 
                card = new Card(card)
            if (!this.check_card(player_name, verb, card))   return
        }

        switch (this.state) {
            case "empty table":
                this.play_card(player_name, card)
                this.state = "attack in progress"
                if (this.attacker_is_out_of_cards()) this.set_next_attacker()
                break;
            case "attack in progress":
                if (verb == 'play') {
                    this.play_card(player_name, card)
                    this.state = this.can_play_more()?"beat one":"beat done"
                }
                if (verb == 'take') {
                    this.state = this.can_play_more()?"taking":"took done"
                }
               break
            case "beat one":
                if (verb == 'play') {
                    this.play_card(player_name, card)
                    this.state = "attack in progress"
                    if (this.attacker_is_out_of_cards()) this.set_next_attacker()
                }
                if (verb == 'pass') {
                    if(this.set_next_attacker()) {
                        this.passers.push(player_name)
                        this.state = "passed on attack"
                    } else {
                        this.state = "beat done"
                    }
                }
               break
            case "taking":
                if (verb == 'play') {
                    this.play_card(player_name, card)
                    this.state = this.can_play_more()?"taking":"took done"
                    if (this.attacker_is_out_of_cards()) this.set_next_attacker()
                } 
                if (verb == 'pass') {
                    if(this.set_next_attacker()) {
                        this.passers.push(player_name)
                        this.state = "passed on add"
                    } else {
                        this.state = "took done"
                    }
                }
               break
            case "passed on attack":
                if (verb=='play') {
                    this.play_card(player_name, card)
                    this.passers = []
                    this.state = "attack in progress"
                    if (this.attacker_is_out_of_cards()) this.set_next_attacker()
                } 
                if (verb =='pass') {
                    if (!this.set_next_attacker()) { this.state = "beat done" }

                    if (this.passers.indexOf(this.attacker) != -1) { //TODO: optimize
                        this.state = "beat done"
                    } else {
                        this.passers.push(player_name)
                        this.state = "passed on attack"
                    }
                }
               break
            case "passed on add":
                if (verb=='play') {
                    this.play_card(player_name, card)
                    this.passers = []
                    this.state = this.can_play_more()?"taking":"took done"
                    if (this.attacker_is_out_of_cards()) this.set_next_attacker()
                }
                if (verb=='pass') {
                    if (!this.set_next_attacker()) { this.state = "took done" }
                    if (this.passers.indexOf(this.attacker) != -1) { //TODO: optimize
                        this.state = "took done"
                    } else {
                        this.passers.push(player_name)
                        this.state = "passed on add"
                    }
                }
                break;
        }
    }


    refill_all_players() {
        let ps = Object.entries(this.players).map(x => x[0])
        let idx = ps.indexOf(this.first_attacker)

        while (true) {
            this.refill_player_cards(ps[idx])
            idx++
            if (idx == ps.length) idx=0
            if (ps[idx] == this.defender) continue
            if (ps[idx] == this.first_attacker) break
        }

        this.refill_player_cards(this.defender)
    }

    refill_player_cards(player_name) {
        while (this.players[player_name].numCards() < 6) {
            let card = this.deck.takeCard()
            if (!card) return;
            this.players[player_name].addCard(card)
        }
    }

    whose_turn() {
        return this.state == "attack in progress"?this.defender:this.attacker
    }
}