/* eslint-disable no-unused-vars */

import { Card } from './card.js';
import { Hand } from './hand.js';

export function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms));}








async function card_to_table(node,mode,card) {
    node.style.zIndex=animation_state.table.zIndex++
    animation_state.table.cards.push(card);
    node.classList.add("table")

    if (mode=="Defend") {
        await Card.animate_transform(node, Card.getTransform(2+animation_state.table.last_attack_slot,10,2,15) + "rotate3d(0,0,1,400deg)", 500).finished
    } else {
        animation_state.table.last_attack_slot ++
       await Card.animate_transform(node, Card.getTransform(2 + animation_state.table.last_attack_slot,0,2,0), 500).finished
    }
}

export async function play_own(card, mode) {
    let node = document.getElementById(card);
    node.classList.remove("mine");
    node.classList.remove("highlight");    
    animation_state.hand.splice(animation_state.hand.indexOf(card),1)
    
    await card_to_table(node,mode,card)
    await Hand.arrange_my_hand(animation_state.hand)
}

export function play_other(card, mode) {
    let node = document.getElementById(""+(animation_state.other_hand-1))
    node.classList.remove("his_card")
    node.classList.remove("highlight"); 
    Card.make_it_a_card(node, card)
    Card.flip_card(node)
    animation_state.other_hand --;
    card_to_table(node,mode,card);
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





export async function clear_table(my_hand, other_hand) {
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


