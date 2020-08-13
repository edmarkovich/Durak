/* eslint-disable no-unused-vars */

import { Card } from './card.js';
import { Deck } from './deck.js'

export function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms));}



function put_in_my_hand(node,card) {
    node.classList.add("mine");
    animation_state.hand.push(card)
}

async function put_in_other_hand(node) {
    node.classList.add("his_card")
    node.id = animation_state.other_hand
    return Card.animate_transform(node, Card.getTransform(1+ ++animation_state.other_hand, 0, 0, 0), 500).finished
}


function hand_sort(a,b) {

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

    if (a_suit == animation_state.trump && b_suit != animation_state.trump) { return 1}
    if (b_suit == animation_state.trump && a_suit != animation_state.trump) { return -1}
    if (a_rank == b_rank) { return (a_suit > b_suit)?1:-1; }
    return (a_rank > b_rank)?1:-1;
    
}


async function arrange_my_hand(new_hand) {
    new_hand.sort(hand_sort)
    let waits = []
    for (let i=0; i<new_hand.length;++i) {
        let node = document.getElementById(new_hand[i]);
        if (!node) continue;
        waits.push(Card.animate_transform(node, Card.getTransform(i+2, 0, 4, 0), 300))
    }
    for (let i=0; i<waits.length; ++i) { await waits[i].finished  }
}

export async function refill_my_hand(new_hand) {
    let cards_to_add = new_hand.filter(x => !animation_state.hand.includes(x) );
    let waits = []
    for (let i = 0; i< cards_to_add.length; i++) {
        let node = await Deck.take_card_from_deck(cards_to_add[i])
        Card.make_it_a_card(node, cards_to_add[i]);
        put_in_my_hand(node, cards_to_add[i]);
        waits.push(arrange_my_hand(new_hand))
        await Card.flip_card(node); 
    }
    await Promise.all(waits)
}

export async function refill_other_hand(new_hand) {
    let waits =[]
    while (new_hand.length != animation_state.other_hand) {
        let node = await Deck.take_card_from_deck(null)

        await make_deck_card(node);

        waits.push( put_in_other_hand(node))
        await sleep(150)
    }
    await Promise.all(waits)
}

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
    await arrange_my_hand(animation_state.hand)
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

export async function glow_hand(state) {
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


async function make_deck_card(node) {
    let inner = node.getElementsByClassName("front")[0].getElementsByClassName("card-inner")[0];
    if (inner) {
        node.getElementsByClassName("front")[0].removeChild(inner)
    }
    node.removeAttribute("id")
    node.removeAttribute("onclick")
    node.setAttribute("class", "card-container")
    Card.flip_card(node,true)
}


export async function clear_table(my_hand, other_hand) {
    let waits = []
    while (document.getElementsByClassName("table").length>0) {
        let node = document.getElementsByClassName("table")[0]
        let card = node.id;
        node.classList.remove("table")

        if (my_hand.indexOf(card) != -1) {
            put_in_my_hand(node,card)

            waits.push(arrange_my_hand(my_hand));

        } else if (other_hand.indexOf(card) != -1) {
            await make_deck_card(node)
            waits.push(put_in_other_hand(node))
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


