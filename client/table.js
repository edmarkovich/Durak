import { Card } from './card.js';
import { Hand } from "./hand.js";
import { animate_transform} from "./utils.js"

export class Table {

    static async card_to_table(node, mode, card) {
        node.style.zIndex = Table.state.table.zIndex++;
        Table.state.table.cards.push(card);
        node.classList.add("table");

        if (mode == "Defend") {
            await animate_transform(node, Card.getTransform(2 + Table.state.table.last_attack_slot, 10, 2, 15) + "rotate3d(0,0,1,400deg)", 500).finished;
        }
        else {
            Table.state.table.last_attack_slot++;
            await animate_transform(node, Card.getTransform(2 + Table.state.table.last_attack_slot, 0, 2, 0), 500).finished;
        }
    }

    static async clear(my_hand, other_hand) {
        let waits = []
        while (document.getElementsByClassName("table").length>0) {
            let node = document.getElementsByClassName("table")[0]
            let card = node.id;
            node.classList.remove("table")
    
            if (my_hand.indexOf(card) != -1) {
                Table.state.hand.add_card(card,node)
    
                waits.push(Hand.arrange_my_hand(my_hand));
    
            } else if (other_hand.indexOf(card) != -1) {
                await Card.make_deck_card(node)
                waits.push(Hand.put_in_other_hand(node))
            } else {
                // Put in the done pile
                Card.flip_card(node, true)
                waits.push(animate_transform(node, Card.getTransform(9,0,2,0), 300))
            }
            
        }
        await Promise.all(waits)
        Table.state.table.cards = []
        Table.state.table.last_attack_slot=-1
    }

    static async play_own(card, mode) {
        let node = Table.state.hand.pop_card(card);
        await Table.card_to_table(node,mode,card)
        await Hand.arrange_my_hand(Table.state.hand.get_cards())
    }
    
    static play_other(card, mode) {
        let node = document.getElementById(""+(Table.state.legacy_other_hand-1))
        node.classList.remove("his_card")
        node.classList.remove("highlight"); 
        Card.make_it_a_card(node, card)
        Card.flip_card(node)
        Table.state.legacy_other_hand --;
        Table.card_to_table(node,mode,card);
    }
}


Table.state = {
    table: {
        last_attack_slot: -1,
        zIndex: 100,
        cards: []
    },
    legacy_other_hand: 0,
    trump: null,

    hand: new Hand(),

}