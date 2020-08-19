import { sleep, animate_transform } from './utils.js';
import { Card } from "./card.js";
import { Deck } from "./deck.js";

export class OtherHand {
    constructor () {
        this.cards_count = 0
    }

    async add_card(node) {
        node.classList.add("his_card")
        node.id = this.cards_count
        await animate_transform(node, Card.getTransform(1+ ++this.cards_count, 0, 0, 0), 500).finished
    }

    count() {return this.cards_count}

    pop_card(card) {
        this.cards_count--
        let node =document.getElementById(""+(this.cards_count))
        node.classList.remove("his_card")
        node.classList.remove("highlight");
        Card.make_it_a_card(node, card)
        Card.flip_card(node)
        return node;        
    }

     async refill(new_hand) {
        let waits =[]
        while (new_hand.length != this.cards_count) {
            let node = Deck.take_card_from_deck(false)
            await Card.make_deck_card(node);
            waits.push( this.add_card(node))
            await sleep(150)
        }
        await Promise.all(waits)
    }

    glow(on) {
        let nodes = document.getElementsByClassName("his_card")
        for (let i =0; i<nodes.length; ++i) {
            if (on) {
                nodes[i].classList.add("highlight")
            } else {
                nodes[i].classList.remove("highlight")
            }
        } 
    }

    async arrange() {}
}

export class Hand {

    constructor (trump_card) {
        this.trump_suit = trump_card[0]
        this.trump_card = trump_card
        this.cards = []
    }

    add_card(card, node) {
        node.classList.add("mine");
        this.cards.push(card)
    }

    has_card(card) {
        return this.cards.indexOf(card) != -1;
    }

    count() {
        return this.cards.length
    }

    pop_card(card) {
        let node = document.getElementById(card);   

        node.classList.remove("mine");
        node.classList.remove("highlight"); 

        let idx = this.cards.indexOf(card);
        this.cards.splice(idx,1)

        return node
    }

    get_cards() {
        return this.cards
    }   

    async arrange() {   
        
        function hand_sort(a,b) {
            function rank2int(card){ switch (card.substring(1)) {
                    case 'J': return 11; 
                    case 'Q': return 12; 
                    case 'K': return 13; 
                    case 'A': return 14; 
                    default:  return parseInt(card.substring(1));
                }}
            
            let a_suit = a[0], b_suit = b[0]
            if (a_suit == this.trump_suit && b_suit != this.trump_suit) { return  1 }
            if (b_suit == this.trump_suit && a_suit != this.trump_suit) { return -1 }
            if (rank2int(a) == rank2int(b))                                 { return (a_suit > b_suit) ? 1:-1 }
                                                                              return (rank2int(a) > rank2int(b)) ? 1:-1
        } 

        this.cards.sort(hand_sort.bind(this))
        let waits = []
        for (let i=0; i<this.cards.length;++i) {
            let node = document.getElementById(this.cards[i]);
            if (!node) continue;
            waits.push(animate_transform(node, Card.getTransform(i+2, 0, 4, 0), 500))
        }
        for (let i=0; i<waits.length; ++i) { await waits[i].finished  }
    }

    async refill(new_hand) {
        let cards_to_add = new_hand.filter(x => !this.has_card(x) );
        let waits = []
        for (let i = 0; i< cards_to_add.length; i++) {

            let node = null
            if (cards_to_add[i] == this.trump_card) {
                node = Deck.take_card_from_deck(true)
            } else {
                node = Deck.take_card_from_deck(false)
                Card.make_it_a_card(node, cards_to_add[i]);
            }

            this.add_card(cards_to_add[i],node)
            waits.push(this.arrange())
            await Card.flip_card(node); 
        }
        await Promise.all(waits)
    }

    glow(on) {
        if (on) {
            document.documentElement.style.setProperty('--mine_highlight', "0 0 15px 5px lightblue");
            document.documentElement.style.setProperty('--mine_click', "all");
        } else {
            document.documentElement.style.setProperty('--mine_highlight', "none");
            document.documentElement.style.setProperty('--mine_click', "none");
        }
    }
}
