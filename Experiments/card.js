function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function move_and_transform(element, targetX, targetY, speed, extra) {

    animation = element.animate([
        { transform: 'translate3d('+targetX+','+targetY+',0px) '+extra},   
    ], {
        duration: speed,
        iterations: 1,
        fill: "forwards",
    })
}

async function animate_rotateY(element, speed, degrees) {
    animation = element.animate([
        { transform: 'rotateY('+degrees+ 'deg)'},   
    ], {
        duration: speed,
        iterations: 1,
        fill: "forwards",
    })    
}

async function new_deck() {
    for (i=0; i<36; i++) {

        inner = document.createElement("div")
        inner.setAttribute("class", "card-container deck")

        b = document.createElement("div")
        b.classList.add("back")
        b.innerHTML = ""

        a = document.createElement("div")
        a.classList.add("front")
        a.innerHTML = "X"

        inner.appendChild(b)
        inner.appendChild(a)

        document.body.appendChild(inner)
    }
}

function flip_card(container) {
    front = node.getElementsByClassName("front")[0];
    back = node.getElementsByClassName("back")[0];

    animate_rotateY(front, 500, 0)
    animate_rotateY(back, 500, -180)
}

async function put_trump(trump_card) {
    nodes = document.getElementsByClassName("card-container")
    node = nodes[0]

    //Flip and move turmp
    flip_card(node)
    await sleep(600)


    mathX = "calc((1.2 * 0 * var(--card_width)) + 40px)"
    mathY = "calc(var(--card_height) * "+2.0+ " - " + 10 + "px)"
    move_and_transform(node, mathX, mathY,500,"rotate3d(0,0,1,90deg)")


    //move_and_transform(node, mathX, mathY,500,"rotate3d(0,0,1,90deg) rotate3d(0,1,0,-180deg)")
    await sleep(600)
    
    

    //Put the deck over it
    for (i=1; i<nodes.length; i++) {
        node = nodes[i]
        mathX = "calc((1.2 * 0 * var(--card_width)) - " + 0.5*i+ "px + 15px)"
        mathY = "calc(var(--card_height) * "+2.0+ " - " + 0.5*24+ "px)"
        move_and_transform(node, mathX, mathY,200,"")
        await sleep(50)
    } 
    await sleep(1200)
}

function get_top_of_deck() {
    nodes = document.getElementsByClassName("deck")
    node = nodes[nodes.length-1]
    return node
}

async function deal_one(player_row, number_cards) {
    
    for (i = number_cards-1; i>= 0; i--) {
        node = get_top_of_deck()

        await node.classList.remove("deck")
        if (player_row==5) {
            flip_card(node)
        }
        mathX = "calc(1.2 * var(--card_width) * "+(i+1)+ ")"
        mathY = "calc(var(--card_height) * "+(player_row)+ ")"
        move_and_transform(node, mathX, mathY,700,"")
        await sleep(100)
    }
}

