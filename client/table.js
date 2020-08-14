import { Card } from './card.js';
import { Hand, OtherHand } from "./hand.js";
import { animate_transform} from "./utils.js"

export class Table {

    constructor(trump) {
        this.hand= new Hand(trump)
        this.otherHand = new OtherHand()
        this.last_attack_slot = -1
        this.zIndex = 100
    }

    getHand() { return this.hand}
    getOtherHand() {return this.otherHand}

    prepare_turn(my_turn, mode){
        this.mode = mode
        if (my_turn) {
            this.getHand().glow(true)
            Card.make_verb_card(this.mode)
        } else {
            this.getOtherHand().glow(true)
        }
    }

    async play(card, my_player) {
        let hand = my_player ? this.hand : this.otherHand
        let node = hand.pop_card(card);
        await this.card_to_table(node, this.mode)
        await hand.arrange()
    }

    async clear(my_hand, other_hand) {
        let waits = []
        while (document.getElementsByClassName("table").length>0) {
            let node = document.getElementsByClassName("table")[0]
            let card = node.id;
            node.classList.remove("table")
    
            if (my_hand.indexOf(card) != -1) {
                this.getHand().add_card(card,node)
                waits.push(this.getHand().arrange());
            } else if (other_hand.indexOf(card) != -1) {
                await Card.make_deck_card(node)
                waits.push(this.getOtherHand().add_card(node))
            } else {
                // Put in the done pile
                Card.flip_card(node, true)
                waits.push(animate_transform(node, Card.getTransform(9,0,2,0), 300))
            }
        }
        await Promise.all(waits)
        this.last_attack_slot=-1
    }

    async prepare_next_round(my_hand, other_hand) {
        await this.clear(my_hand,other_hand) 
        await this.getHand().refill(my_hand);
        await this.getOtherHand().refill(other_hand);
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