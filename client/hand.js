import { sleep, animate_transform } from './utils.js';
import { Card } from "./card.js";
import { Deck } from "./deck.js";

function placePlayerName(player_name, row) {
    return
    let name_div = document.createElement("div")
    name_div.innerHTML = "<BR><BR>"+player_name
    name_div.classList.add("player-name")
    name_div.style.backgroundColor = '#' + md5(player_name).slice(0, 6);
    animate_transform(name_div, Card.getTransform(1, 0, row, 0), 0)
    document.body.appendChild(name_div)
}

export class OtherHand {
    constructor (hand_index, player_name) {
        this.cards_count = 0
        this.hand_index = hand_index
        this.player_name = player_name

        placePlayerName(this.player_name, this.hand_index)

    }

    async add_card(node) {
        node.classList.add("his_card"+this.hand_index)
        node.id = ""+this.hand_index+":"+this.cards_count
        node.style.zIndex = this.cards_count
        await animate_transform(node, Card.getTransform(this.hand_index*3, 15*(this.cards_count), 0, +0*(this.cards_count)) 
            + "rotate3d(0,0,1,"+(0*this.cards_count)+"deg)", 200).finished
        this.cards_count++
    }

    count() {return this.cards_count}

    pop_card(card) {
        this.cards_count--
        let node =document.getElementById(""+this.hand_index+":"+this.cards_count)
        node.classList.remove("his_card"+this.hand_index)
        node.classList.remove("highlight");
        Card.make_it_a_card(node, card)
        Card.flip_card(node)
        return node;        
    }

     async refill(new_hand) {
        let waits =[]
        while (new_hand.length > this.cards_count) {
            let node = Deck.take_card_from_deck(false)
            await Card.make_deck_card(node);
            //waits.push( this.add_card(node))
            await this.add_card(node)
            await sleep(150)
        }
        await Promise.all(waits)
    }

    glow(on) {
        let nodes = document.getElementsByClassName("his_card"+this.hand_index)
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

    constructor (trump_card, player_name) {
        this.trump_suit = trump_card[0]
        this.trump_card = trump_card
        this.cards = []
        this.player_name = player_name

        placePlayerName(this.player_name, 4)

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
            waits.push(animate_transform(node, Card.getTransform(i+0, 0, 4, 0), 500).finished)
        }
        for (let i=0; i<waits.length; ++i) { await waits[i]  }
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

            Card.flip_card(node)
            this.add_card(cards_to_add[i],node)
            //waits.push(this.arrange())
             await this.arrange()
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
