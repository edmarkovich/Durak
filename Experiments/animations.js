/* eslint-disable no-unused-vars */
"use strict";

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms));}

async function animate_transform(element, transform,speed) {
    element.animate([ { transform: transform}], {
        duration: speed,
        iterations: 1,
        fill: "forwards",
    })     
}

function getTransform(column, column_offset, row, row_offset) {
    return "translate3d("
        +"calc((1.2 * " + column + " * var(--card_width)) + " + column_offset + "px), "
        +"calc((var(--card_height) * "+row+ ") + " + row_offset + "px), 0px)" 
}

function card_to_unicode(card) {
    var base;
    var offset;
    switch (card[0]) {
        case '♠': base = 127137; break;
        case '♥': base = 127153; break;
        case '♦': base = 127169; break;
        case '♣': base = 127185; break;
    }
    switch (card.substring(1)) {
        case 'A': offset = 0; break;
        case 'J': offset = 10; break;
        case 'Q': offset = 12; break;
        case 'K': offset = 13; break;
        default: offset = parseInt(card.substring(1)) -1;
    }
    return "&#"+(base+offset)+";";
}

async function new_deck() {
    for (let i=0; i<36; i++) {
        let back = document.createElement("div")
        back.classList.add("back")

        let front = document.createElement("div")
        front.classList.add("front")
        
        let container = document.createElement("div")
        container.setAttribute("class", "card-container deck")
        
        container.appendChild(back)
        container.appendChild(front)

        document.body.appendChild(container)
    }
}

function make_verb_card(verb) {
    let node = null
    let nodes = document.getElementsByClassName("verb")
    if (nodes.length==0) {
        node = document.createElement("div")
        node.setAttribute("class", "card-container verb hidden")
    
        let inner = document.createElement("div")
        inner.classList.add("card-inner")
        node.appendChild(inner);
        document.body.appendChild(node)
    } else {
        node = nodes[0]
    }

    if (verb==null){
        node.classList.add("hidden")
    } else {
        node.setAttribute("onclick", "send_verb('"+verb+"')")
        node.getElementsByClassName("card-inner")[0].innerHTML =(verb == "pass")?"done":verb
        node.classList.remove("hidden")
        animate_transform(node, 
            getTransform(animation_state.hand.length+2, 0, 4, 0), 0)
    }    
}

function flip_card(container, reverse) {
    let front = container.getElementsByClassName("front")[0];
    let back = container.getElementsByClassName("back")[0];

    if (reverse) {
        animate_transform(front, "rotate3d(0,1,0,-180deg)", 300);
        animate_transform(back, "rotate3d(0,1,0,0deg)", 300);
    } else {
        animate_transform(front, "rotate3d(0,1,0,0deg)", 300);
        animate_transform(back, "rotate3d(0,1,0,-180deg)", 300);
    }
}

async function put_trump(trump_card) {
    animation_state.trump =trump_card[0]
    animation_state.trump_card = trump_card

    let nodes = document.getElementsByClassName("deck")
    let node = nodes[0]
    make_it_a_card(node, animation_state.trump_card);

    //Flip, turn and move turmp
    flip_card(node)
    await sleep(120)
    //animate_transform(node, getTransform(0, 50, 2, 10)+"rotate3d(0,0,1,90deg)", 500)
    animate_transform(node, getTransform(0, 0, 2, 10), 500)
    await sleep(600);

    //Put the deck over trump
    for (let i=1; i<nodes.length; i++) {
        node = nodes[i]
        animate_transform(node, getTransform(0, 80, 2, 0), 200)
        await sleep(50)
    } 
    await sleep(200)
}


function take_card_from_deck(card) {

    let nodes = document.getElementsByClassName("deck")
    console.log("Deck remaining:", nodes.length-1)
    let node = nodes[nodes.length-1]
    if (card == animation_state.trump_card) {
        node = nodes[0];
        flip_card(node,false)
    }

    node.classList.remove("deck")
    return node;
}

function make_it_a_card(node, card) {
    node.id = card;
    let front = node.getElementsByClassName("front")[0]
    let inner = document.createElement("div")
    inner.classList.add("card-inner")
    inner.innerHTML = card_to_unicode(card)
    front.appendChild(inner)
    if (card[0] == '♥' || card[0] == '♦') { node.classList.add("red"); } 
    node.setAttribute('onclick', 'send_card(\''+card+'\')')

}

async function glow_hand(state) {
    if (state) { 
        document.documentElement.style.setProperty('--mine_highlight', "0 0 15px 5px lightblue");
        document.documentElement.style.setProperty('--mine_click', "all");
    } else {
        document.documentElement.style.setProperty('--mine_highlight', "none");
        document.documentElement.style.setProperty('--mine_click', "none");
    }
}


async function arrange_my_hand(new_hand) {

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
    new_hand.sort(function(a,b){
        let a_suit = a[0];
        let a_rank = rank2int(a)
        let b_suit = b[0];
        let b_rank = rank2int(b)

        if (a_suit == animation_state.trump && b_suit != animation_state.trump) { return 1}
        if (b_suit == animation_state.trump && a_suit != animation_state.trump) { return -1}
        if (a_rank == b_rank) { return 0; }
        return (a_rank > b_rank)?1:-1;
    })

    for (let i=0; i<new_hand.length;++i) {
        let node = document.getElementById(new_hand[i]);
        if (!node) continue;
        animate_transform(node, getTransform(i+2, 0, 4, 0), 500)
    }
    await sleep(600)
}

async function refill_my_hand(new_hand) {
    let cards_to_add = new_hand.filter(x => !animation_state.hand.includes(x) );
    for (let i = 0; i< cards_to_add.length; i++) {
        let node = take_card_from_deck(cards_to_add[i])
        make_it_a_card(node, cards_to_add[i]);
        flip_card(node); 
        await put_in_my_hand(node, cards_to_add[i]);
        await sleep(100)
    }
    await sleep(1000)
    await arrange_my_hand(new_hand);
}

 function refill_other_hand(new_hand) {
    while (new_hand.length != animation_state.other_hand) {
        let node = take_card_from_deck(null)
        put_in_other_hand(node);

        //await sleep(100)
    }
    sleep(1000)
}

let animation_state = {
    table: {
        last_attack_slot: -1,
        zIndex: 100,
        cards: []
    },
    hand: [],
    other_hand: 0,
    trump: null,
}

async function play_own(card, mode) {
    let node = document.getElementById(card);
    node.classList.remove("mine");    
    animation_state.hand.splice(animation_state.hand.indexOf(card),1)
    
    await card_to_table(node,mode,card)
    await arrange_my_hand(animation_state.hand)
}

function play_other(card, mode) {
    let node = document.getElementById(""+(animation_state.other_hand-1))
    node.classList.remove("his_card")
    make_it_a_card(node, card)
    flip_card(node)
    animation_state.other_hand --;

    card_to_table(node,mode,card);
    
}

async function card_to_table(node,mode,card) {
    node.style.zIndex=animation_state.table.zIndex++
    animation_state.table.cards.push(card);
    node.classList.add("table")
    if (mode=="Defend") {
        animate_transform(node, getTransform(2+animation_state.table.last_attack_slot,10,2,15) + "rotate3d(0,0,1,400deg)", 500) 
    } else {
        animation_state.table.last_attack_slot ++
        animate_transform(node, getTransform(2 + animation_state.table.last_attack_slot,0,2,0), 500)
    }
    await sleep(300)
}

function put_in_my_hand(node,card) {
    node.classList.add("mine");
    animation_state.hand.push(card)
    animate_transform(node, getTransform(animation_state.hand.length+1, 0, 4, 0), 700)
}

function put_in_other_hand(node) {
    node.classList.add("his_card")
    node.id = animation_state.other_hand
    animate_transform(node, getTransform(1+ ++animation_state.other_hand, 0, 0, 0), 700)
}

async function clear_table(my_hand, other_hand) {
    //for (let i in animation_state.table.cards) {
    while (document.getElementsByClassName("table").length>0) {
        let node = document.getElementsByClassName("table")[0]
        let card = node.id;
        node.classList.remove("table")

        if (my_hand.indexOf(card) != -1) {
            put_in_my_hand(node,card)
        } else if (other_hand.indexOf(card) != -1) {
            let inner = node.getElementsByClassName("front")[0].getElementsByClassName("card-inner")[0];
            node.getElementsByClassName("front")[0].removeChild(inner)
            node.removeAttribute("id")
            node.removeAttribute("onclick")
            node.setAttribute("class", "card-container")
            flip_card(node,true)
            put_in_other_hand(node)
        } else {
            // Put in the done pile
            flip_card(node, true)
            animate_transform(node, getTransform(9,0,2,0), 300)
        }


    }
    animation_state.table.cards = []
    animation_state.table.last_attack_slot=-1
    await sleep(400);
}