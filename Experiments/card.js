function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function animate_transform(element, transform,speed) {
    animation = element.animate([
        { transform: transform},   
    ], {
        duration: speed,
        iterations: 1,
        fill: "forwards",
    })     
}

function card_to_unicode(card) {
    suit = card[0]
    rank = card.substring(1)
    switch (suit) {
        case '♠': base = 127137; break;
        case '♥': base = 127153; break;
        case '♦': base = 127169; break;
        case '♣': base = 127185; break;
    }

    switch (rank) {
        case 'A': offset = 0; break;
        case 'J': offset = 10; break;
        case 'Q': offset = 12; break;
        case 'K': offset = 13; break;
        default: offset = parseInt(rank) -1;
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
    front = node.getElementsByClassName("front")[0];
    back = node.getElementsByClassName("back")[0];

    animate_transform(front, "rotate3d(0,1,0,0deg)", 500);
    animate_transform(back, "rotate3d(0,1,0,-180deg)", 500);
}

async function put_trump(trump_card) {
    nodes = document.getElementsByClassName("card-container")
    node = nodes[0]

    //Flip and move turmp
    flip_card(node)
    await sleep(600)


    mathX = "calc((1.2 * 0 * var(--card_width)) + 40px)"
    mathY = "calc(var(--card_height) * "+2.0+ " + " + 10 + "px)"
    animate_transform(node, "translate3d("+mathX+", "+mathY+", 0px) rotate3d(0,0,1,90deg)", 500);
    await sleep(600)
    

    //Put the deck over it
    for (i=1; i<nodes.length; i++) {
        node = nodes[i]
        mathX = "calc((1.2 * 0 * var(--card_width)) - " + 1 + "px)"
        mathY = "calc(var(--card_height) * "+2.0+ ")"
        animate_transform(node, "translate3d("+mathX+", "+mathY+", 0px)", 200);
        await sleep(50)
    } 
    await sleep(200)
}

function take_card_from_deck(card) {
    nodes = document.getElementsByClassName("deck")
    node = nodes[nodes.length-1]
    node.classList.remove("deck")

    // Make it be the actual card
    node.getElementsByClassName("front")[0].innerHTML = card_to_unicode(card)
    if (card[0] == '♥' || card[0] == '♦') {
        node.classList.add("red");
    } 

    return node
}

async function deal_one(player_row, cards) {
    
    for (i = cards.length-1; i>= 0; i--) {
        node = take_card_from_deck(cards[i])

        if (player_row==4) {
            flip_card(node)
        }
        mathX = "calc(1.2 * var(--card_width) * "+(i+1)+ ")"
        mathY = "calc(var(--card_height) * "+(player_row)+ ")"
        animate_transform(node, "translate3d("+mathX+", "+mathY+", 0px)", 700);

        await sleep(100)
    }
}

