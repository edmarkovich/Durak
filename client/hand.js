import { sleep, animate_transform } from './utils.js';
import { Card } from "./card.js";
import { Deck } from "./deck.js";
import { Table } from "./table.js"

export class Hand {

    constructor () {
        this.cards = []
    }

    add_card(card) {
        this.cards.push(card)
    }

    has_card(card) {
        return this.cards.indexOf(card) != -1;
    }

    count() {
        return this.cards.length
    }

    remove_card(card) {
        let idx =this.cards.indexOf(card);
        this.cards.splice(idx,1)
    }

    get_cards() {
        return this.cards
    }






    // -------------------------------------------------------------------------------------------------------------------------------------------------------

    static put_in_my_hand(node, card) {
        node.classList.add("mine");
        Table.state.hand.add_card(card);
    }

    static async put_in_other_hand(node) {
        node.classList.add("his_card")
        node.id = Table.state.legacy_other_hand
        return animate_transform(node, Card.getTransform(1+ ++Table.state.legacy_other_hand, 0, 0, 0), 500).finished
    }

    static hand_sort(a,b) {

        function rank2int(card){
            let a_rank =0;
            switch (card.substring(1)) {
                case 'J': a_rank = 11; break;
                case 'Q': a_rank = 12; break;
                case 'K': a_rank = 13; break;
                case 'A': a_rank = 14; break;
                default: a_rank = parseInt(card.substring(1));
            }
            return a_rank
        }

        let a_suit = a[0];
        let a_rank = rank2int(a)
        let b_suit = b[0];
        let b_rank = rank2int(b)

        if (a_suit == Table.state.trump && b_suit != Table.state.trump) { return 1}
        if (b_suit == Table.state.trump && a_suit != Table.state.trump) { return -1}
        if (a_rank == b_rank) { return (a_suit > b_suit)?1:-1; }
        return (a_rank > b_rank)?1:-1;
        
    }


    static async arrange_my_hand(new_hand) {
        new_hand.sort(Hand.hand_sort)
        let waits = []
        for (let i=0; i<new_hand.length;++i) {
            let node = document.getElementById(new_hand[i]);
            if (!node) continue;
            waits.push(animate_transform(node, Card.getTransform(i+2, 0, 4, 0), 300))
        }
        for (let i=0; i<waits.length; ++i) { await waits[i].finished  }
    }

    static async refill_my_hand(new_hand) {
        let cards_to_add = new_hand.filter(x => !Table.state.hand.has_card(x) );
        let waits = []
        for (let i = 0; i< cards_to_add.length; i++) {
            let node = await Deck.take_card_from_deck(cards_to_add[i])
            Card.make_it_a_card(node, cards_to_add[i]);
            Hand.put_in_my_hand(node, cards_to_add[i]);
            waits.push(Hand.arrange_my_hand(new_hand))
            await Card.flip_card(node); 
        }
        await Promise.all(waits)
    }

    static async refill_other_hand(new_hand) {
        let waits =[]
        while (new_hand.length != Table.state.legacy_other_hand) {
            let node = await Deck.take_card_from_deck(null)

            await Card.make_deck_card(node);

            waits.push( Hand.put_in_other_hand(node))
            await sleep(150)
        }
        await Promise.all(waits)
    }

    static async glow_hand(state) {
        let nodes =  document.getElementsByClassName("his_card")
        for (let i =0; i<nodes.length; ++i) {
            nodes[i].classList.remove("highlight")
        } 

        if (state=="me") { 
            document.documentElement.style.setProperty('--mine_highlight', "0 0 15px 5px lightblue");
            document.documentElement.style.setProperty('--mine_click', "all");
        } else if (state == "other") {
            document.documentElement.style.setProperty('--mine_highlight', "none");
            document.documentElement.style.setProperty('--mine_click', "none");

            let nodes =  document.getElementsByClassName("his_card")


            for (let i =0; i<nodes.length; ++i) {
                nodes[i].classList.add("highlight")
            }
        }
    }

}