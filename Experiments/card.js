function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms));}

async function animate_transform(element, transform,speed) {
    animation = element.animate([ { transform: transform}], {
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
    for (i=0; i<36; i++) {
        back = document.createElement("div")
        back.classList.add("back")
        back.innerHTML = "&#127136;"

        front = document.createElement("div")
        front.classList.add("front")
        
        inner = document.createElement("div")
        inner.setAttribute("class", "card-container deck")
        inner.appendChild(back)
        inner.appendChild(front)
        document.body.appendChild(inner)
    }
}

function flip_card(container, reverse) {
    front = container.getElementsByClassName("front")[0];
    back = container.getElementsByClassName("back")[0];

    if (reverse) {
        animate_transform(front, "rotate3d(0,1,0,-180deg)", 300);
        animate_transform(back, "rotate3d(0,1,0,0deg)", 300);
    } else {
        animate_transform(front, "rotate3d(0,1,0,0deg)", 300);
        animate_transform(back, "rotate3d(0,1,0,-180deg)", 300);
    }
}

async function put_trump(trump_card) {
    nodes = document.getElementsByClassName("card-container")
    node = nodes[0]
    make_it_a_card(node, trump_card);

    //Flip, turn and move turmp
    flip_card(node)
    await sleep(120)
    animate_transform(node, getTransform(0, 50, 2, 10)+"rotate3d(0,0,1,90deg)", 500)
    await sleep(600)
    
    //Put the deck over trump
    for (i=1; i<nodes.length; i++) {
        node = nodes[i]
        animate_transform(node, getTransform(0, -1, 2, 0), 200)
        await sleep(50)
    } 
    await sleep(200)
}

function take_card_from_deck() {
    nodes = document.getElementsByClassName("deck")
    node = nodes[nodes.length-1]
    node.classList.remove("deck")
    return node;
}

function make_it_a_card(node, card) {
    node.getElementsByClassName("front")[0].innerHTML = card_to_unicode(card)
    if (card[0] == '♥' || card[0] == '♦') { node.classList.add("red"); } 
    node.id = card;
}

async function deal_one(player_row, old_hand, new_hand) {

    old_hand = state.hand;
    cards_to_add = new_hand.filter(x => !old_hand.includes(x) );

    for (i = 0; i< cards_to_add.length; i++) {
        node = take_card_from_deck()

        if (player_row==4) { 
            make_it_a_card(node, cards_to_add[i]);
            flip_card(node); 
            idx = state.hand.indexOf(null);
            if (idx !=-1) {
                state.hand[idx] = cards_to_add[i]
            } else {
                idx = state.hand.length
                state.hand.push(cards_to_add[i])
            }
        } else {
            node.classList.add("his_card")
            idx = state.other_hand
            state.other_hand ++
        }

        animate_transform(node, getTransform(idx+1, 0, player_row, 0), 1700)
        await sleep(100)
    }
    
}

state = {
    table: {
        last_attack_slot: -1,
        zIndex: 100,
        cards: []
    },
    hand: [],
    other_hand: 0
}

async function play_own(card) {
    node = document.getElementById(card);
    state.table.last_attack_slot ++
    node.style.zIndex=state.table.zIndex++
    state.table.cards.push(card);
    
    idx = state.hand.indexOf(card)
    state.hand[idx] = null

    animate_transform(node, getTransform(2 + state.table.last_attack_slot,0,2,0) + "rotate3d(0,0,1,360deg)", 500)
    await sleep(1000)
}

async function play_other(card) {
    node = document.getElementsByClassName("his_card")[0]
    node.classList.remove("his_card")
    make_it_a_card(node, card)
    node.style.zIndex=state.table.zIndex++
    state.table.cards.push(card);
    flip_card(node)

    state.other_hand --;

    animate_transform(node, getTransform(2+state.table.last_attack_slot,10,2,15) + "rotate3d(0,0,1,400deg)", 500)
    await sleep(1000)
}

async function clear_table() {
    for (i in state.table.cards) {
        card = state.table.cards[i];
        node = document.getElementById(card);
        flip_card(node, true)
        animate_transform(node, getTransform(9,0,2,0), 300)
    }
    state.table.cards = []
    state.table.last_attack_slot=-1
}