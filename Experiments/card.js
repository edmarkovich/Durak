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

function flip_card(container) {
    front = container.getElementsByClassName("front")[0];
    back = container.getElementsByClassName("back")[0];

    animate_transform(front, "rotate3d(0,1,0,0deg)", 500);
    animate_transform(back, "rotate3d(0,1,0,-180deg)", 500);
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

async function deal_one(player_row, cards) {
    for (i = cards.length-1; i>= 0; i--) {
        node = take_card_from_deck()
        make_it_a_card(node, cards[i])

        if (player_row==4) { flip_card(node) }
        animate_transform(node, getTransform(i+1, 0, player_row, 0), 700)
        await sleep(100)
    }
}

async function play(card) {
    node = document.getElementById(card);
    console.log(node)
    animate_transform(node, getTransform(2,0,2,0) + "rotate3d(0,0,1,360deg)", 500)
    await sleep(1111)
}