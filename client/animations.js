import { Card } from './card.js';
import { Hand } from './hand.js';
import { Table } from './table.js';

export function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms));}

export async function play_own(card, mode) {
    let node = document.getElementById(card);
    node.classList.remove("mine");
    node.classList.remove("highlight");    
    animation_state.hand.splice(animation_state.hand.indexOf(card),1)
    
    await Table.card_to_table(node,mode,card)
    await Hand.arrange_my_hand(animation_state.hand)
}

export function play_other(card, mode) {
    let node = document.getElementById(""+(animation_state.other_hand-1))
    node.classList.remove("his_card")
    node.classList.remove("highlight"); 
    Card.make_it_a_card(node, card)
    Card.flip_card(node)
    animation_state.other_hand --;
    Table.card_to_table(node,mode,card);
}

export function make_verb_card(verb) {
    let node = null
    let nodes = document.getElementsByClassName("verb")
    if (nodes.length==0) {
        node = document.createElement("div")
        node.setAttribute("class", "card-container verb hidden")

        let inner = document.createElement("div")
        inner.classList.add("card-inner")

        let front = document.createElement("div");
        front.setAttribute("class","front")

        let back = document.createElement("div");
        back.setAttribute("class","back")
        node.appendChild(back);
        node.appendChild(front);

        front.appendChild(inner)
        document.body.appendChild(node)
        Card.flip_card(node)
    } else {
        node = nodes[0]
    }

    if (verb==null){
        node.classList.add("hidden")
    } else {
        node.setAttribute("onclick", "send_verb('"+verb+"')")
        node.getElementsByClassName("front")[0].getElementsByClassName("card-inner")[0].innerHTML =(verb == "pass")?"done":verb
        node.classList.remove("hidden")
        Card.animate_transform(node, 
            Card.getTransform(animation_state.hand.length+2, 0, 4, 0), 0)
    }    
}




export let animation_state = {
    table: {
        last_attack_slot: -1,
        zIndex: 100,
        cards: []
    },
    hand: [],
    other_hand: 0,
    trump: null,
}

