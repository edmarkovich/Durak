import { animation_state } from './animations.js';
import { Card } from './card.js';
import { Hand } from "./hand.js";


export class Table {
    static async card_to_table(node, mode, card) {
        node.style.zIndex = animation_state.table.zIndex++;
        animation_state.table.cards.push(card);
        node.classList.add("table");

        if (mode == "Defend") {
            await Card.animate_transform(node, Card.getTransform(2 + animation_state.table.last_attack_slot, 10, 2, 15) + "rotate3d(0,0,1,400deg)", 500).finished;
        }
        else {
            animation_state.table.last_attack_slot++;
            await Card.animate_transform(node, Card.getTransform(2 + animation_state.table.last_attack_slot, 0, 2, 0), 500).finished;
        }
    }

    static async clear_table(my_hand, other_hand) {
        let waits = []
        while (document.getElementsByClassName("table").length>0) {
            let node = document.getElementsByClassName("table")[0]
            let card = node.id;
            node.classList.remove("table")
    
            if (my_hand.indexOf(card) != -1) {
                Hand.put_in_my_hand(node,card)
    
                waits.push(Hand.arrange_my_hand(my_hand));
    
            } else if (other_hand.indexOf(card) != -1) {
                await Card.make_deck_card(node)
                waits.push(Hand.put_in_other_hand(node))
            } else {
                // Put in the done pile
                Card.flip_card(node, true)
                waits.push(Card.animate_transform(node, Card.getTransform(9,0,2,0), 300))
            }
            
        }
        await Promise.all(waits)
        animation_state.table.cards = []
        animation_state.table.last_attack_slot=-1
    }

    static async play_own(card, mode) {
        let node = document.getElementById(card);
        node.classList.remove("mine");
        node.classList.remove("highlight");    
        animation_state.hand.splice(animation_state.hand.indexOf(card),1)
        
        await Table.card_to_table(node,mode,card)
        await Hand.arrange_my_hand(animation_state.hand)
    }
    
    static play_other(card, mode) {
        let node = document.getElementById(""+(animation_state.other_hand-1))
        node.classList.remove("his_card")
        node.classList.remove("highlight"); 
        Card.make_it_a_card(node, card)
        Card.flip_card(node)
        animation_state.other_hand --;
        Table.card_to_table(node,mode,card);
    }
}
