import { Card } from './card.js';
import { Hand, OtherHand } from "./hand.js";
import { animate_transform} from "./utils.js"

export class Table {

    constructor(trump_card, my_name, players) {
        this.my_name = my_name
        this.hands = {}

        for (let i=0; i<players.length; ++i) {
            if (players[i] == my_name) {
                this.hands[players[i]] = new Hand(trump_card)
            } else {
                this.hands[players[i]] = new OtherHand()
            }
        }

        this.last_attack_slot = -1
        this.zIndex = 100
    }

    getHand() { 
        return this.hands[this.my_name]
    }
    
    getOtherHand(player_name) {
        for (let name in this.hands) {
            if (name == player_name) {
                return this.hands[name]
            }
        }
    }

    prompt_for_action(player_name, mode){
        this.mode = mode
        if (player_name == this.my_name) {
            this.getHand().glow(true)
            Card.make_verb_card(this.mode)
        } else {
            this.getOtherHand(player_name).glow(true)
        }
    }


    async table_to_hand(player_name, player_hand) {
        let waits = []
        while (document.getElementsByClassName("table").length>0) {
            let node = document.getElementsByClassName("table")[0]
            let card = node.id;
            
            if (player_hand.indexOf(card) != -1) {
                node.classList.remove("table")
                await Card.make_deck_card(node)
                waits.push(this.getOtherHand(player_name).add_card(node))
            } 
        }
        await Promise.all(waits)
        this.last_attack_slot=-1      
    }

    async clear(my_hand, other_hands) {
        let waits = []

        for (let player in other_hands) {
            await this.table_to_hand(player, other_hands[player])
        }

        while (document.getElementsByClassName("table").length>0) {
            let node = document.getElementsByClassName("table")[0]
            let card = node.id;
            node.classList.remove("table")

            if (my_hand.indexOf(card) != -1) {
                this.getHand().add_card(card,node)
                waits.push(this.getHand().arrange());
            } else {
                // Put in the done pile
                Card.flip_card(node, true)
                waits.push(animate_transform(node, Card.getTransform(9,0,2,0), 300))
            }
        }
        await Promise.all(waits)
        this.last_attack_slot=-1
    }

    async prepare_next_round(my_hand, other_hands) {
        await this.clear(my_hand,other_hands) 

        await this.getHand().refill(my_hand)

        for (let player in other_hands) {
            await this.getOtherHand(player).refill(other_hands[player])
        }
    }

    async play(card, player_name) {
        let hand = player_name == this.my_name ? this.getHand() : this.getOtherHand(player_name)
        let node = hand.pop_card(card);
        await this.card_to_table(node, this.mode)
        await hand.arrange()
    }

    async render_turn(old_table_cards, new_table_cards, old_hand, old_other_hands) {

        Card.make_verb_card(null)
        Table.state.theTable.getHand().glow(false)
        //Table.state.theTable.getOtherHand().glow(false)

        let table_to_add = new_table_cards.filter(x => !old_table_cards.includes(x) );
        for (let i=0; i<table_to_add.length; i++) {
            
            if( old_hand.indexOf(table_to_add[i]) != -1) {
                await this.play(table_to_add[i], true)
            } else { 
                //if( old_other_hand.indexOf(table_to_add[i]) != -1) {
                // await this.play(table_to_add[i], false)
                for (let name in old_other_hands) {
                    Table.state.theTable.getOtherHand(name).glow(false)
                    if (old_other_hands[name].indexOf(this.table_to_hand[i]) != -1 ) {
                        await this.play(table_to_add[i], name)
                    }
                }
            }
        }
    }



    async card_to_table(node, mode) {
        node.style.zIndex = this.zIndex++
        node.classList.add("table")

        if (mode == "Defend") {
            await animate_transform(node, Card.getTransform(2 + this.last_attack_slot, 10, 2, 15) + "rotate3d(0,0,1,400deg)", 500).finished
        }
        else {
            this.last_attack_slot++
            await animate_transform(node, Card.getTransform(2 + this.last_attack_slot, 0, 2, 0), 500).finished
        }
    }
}


Table.state = {

}