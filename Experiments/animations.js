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
    for (i=0; i<36; i++) {
        back = document.createElement("div")
        back.classList.add("back")

        front = document.createElement("div")
        front.classList.add("front")
        
        container = document.createElement("div")
        container.setAttribute("class", "card-container deck")
        
        container.appendChild(back)
        container.appendChild(front)

        document.body.appendChild(container)
    }
}

function make_verb_card(verb) {
    if (verb==null) {
        verbs = document.getElementsByClassName("verb")
        if (verbs.length>0) { document.body.removeChild(verbs[0]) }
        return;
    }
    container = document.createElement("div")
    container.setAttribute("class", "card-container verb")
    inner = document.createElement("div")
    inner.classList.add("card-inner")
    inner.innerHTML = '<i onclick="send_verb(\''+verb+'\')">'+verb+"</i>"
    container.appendChild(inner);

    animate_transform(container, getTransform(1, 0, 4, 0), 100)
    document.body.appendChild(container)
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
    nodes = document.getElementsByClassName("deck")
    node = nodes[0]
    make_it_a_card(node, trump_card);

    //Flip, turn and move turmp
    flip_card(node)
    await sleep(120)
    animate_transform(node, getTransform(0, 50, 2, 10)+"rotate3d(0,0,1,90deg)", 500)
    await sleep(600);

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
    front = node.getElementsByClassName("front")[0]
    inner = document.createElement("div")
    inner.classList.add("card-inner")
    inner.innerHTML = card_to_unicode(card)
    front.appendChild(inner)
    if (card[0] == '♥' || card[0] == '♦') { node.classList.add("red"); } 
    node.setAttribute('onclick', 'send_card(\''+card+'\')')

    node.id = card;
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


async function refill_my_hand(new_hand) {
    cards_to_add = new_hand.filter(x => !animation_state.hand.includes(x) );
    for (i = 0; i< cards_to_add.length; i++) {
        node = take_card_from_deck()
        make_it_a_card(node, cards_to_add[i]);
        flip_card(node); 
        node.classList.add("mine");
        idx = animation_state.hand.indexOf(null);
        if (idx !=-1) {
            animation_state.hand[idx] = cards_to_add[i]
        } else {
            idx = animation_state.hand.length
            animation_state.hand.push(cards_to_add[i])
        }
        animate_transform(node, getTransform(idx+2, 0, 4, 0), 700)
        await sleep(100)
    }
}

async function refill_other_hand(new_hand_size) {
    while (new_hand_size != animation_state.other_hand) {
        node = take_card_from_deck()
        node.classList.add("his_card")
        animate_transform(node, getTransform(1+ ++animation_state.other_hand, 0, 0, 0), 700)
        await sleep(100)
    }
}

let animation_state = {
    table: {
        last_attack_slot: -1,
        zIndex: 100,
        cards: []
    },
    hand: [],
    other_hand: 0
}

async function play_own(card, mode) {
    node = document.getElementById(card);
    node.classList.remove("mine");
    
    animation_state.hand[animation_state.hand.indexOf(card)] = null; //Mark empty slot in hand

    await card_to_table(node,mode,card);
}

async function play_other(card, mode) {
    node = document.getElementsByClassName("his_card")[0]
    node.classList.remove("his_card")
    make_it_a_card(node, card)
    flip_card(node)
    animation_state.other_hand --;

    await card_to_table(node,mode,card);
}

async function card_to_table(node,mode,card) {
    node.style.zIndex=animation_state.table.zIndex++
    animation_state.table.cards.push(card);
    if (mode=="Defend") {
        animate_transform(node, getTransform(2+animation_state.table.last_attack_slot,10,2,15) + "rotate3d(0,0,1,400deg)", 500) 
    } else {
        animation_state.table.last_attack_slot ++
        animate_transform(node, getTransform(2 + animation_state.table.last_attack_slot,0,2,0), 500)
    }
    await sleep(1000)
}

async function clear_table() {
    for (i in animation_state.table.cards) {
        card = animation_state.table.cards[i];
        node = document.getElementById(card);
        flip_card(node, true)
        animate_transform(node, getTransform(9,0,2,0), 300)
    }
    animation_state.table.cards = []
    animation_state.table.last_attack_slot=-1
    await sleep(400);
}