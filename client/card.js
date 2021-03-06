import { animate_transform, sleep} from "./utils.js"
import { Table } from './table.js';

function makeDivOfClass(classes, parent) {
    let div = document.createElement("div")
    div.setAttribute("class", classes)
    return parent.appendChild(div)
}

function getFirstOfClass(parent, className) {
    let nodes = parent.getElementsByClassName(className)
    return (nodes.length>0)?nodes[0]:null
}

export class Card {

    static card_to_sprite(card) {
        switch (card[0]) {
            case '♠': var row = 3; break;
            case '♥': row = 2; break;
            case '♦': row = 1; break;
            case '♣': row = 0; break;
            default: return card
        }
        switch (card.substring(1)) {
            case 'A': var offset = 0; break;
            case 'J': offset = 10; break;
            case 'Q': offset = 11; break;
            case 'K': offset = 12; break;
            default: offset = parseInt(card.substring(1)) - 1;
        }
        return [ offset, row]
    }


    static putCardSprite(card, parent) {

        let pos = Card.card_to_sprite(card)
        let scaleFactor = 5.27

        let width = 512/scaleFactor
        let Xskip = width * pos[0]
        let height = 780/scaleFactor
        let Yskip = height * pos[1]

        parent.style.background = "url('assets/small_card_sprites.png')"
        parent.style.width = parent.style.height = "100%"
        parent.style.backgroundSize = "calc(6663px/"+scaleFactor+") calc(3906px/"+scaleFactor+")"
        parent.style.backgroundRepeat = "no-repeat"
        parent.style.backgroundPosition = "-"+Xskip+"px -"+Yskip+"px"
    }

    static set_card_front(node, card) {
        let front = getFirstOfClass(node, "front")
        if (!front) front = makeDivOfClass("front", node)

        let inner = getFirstOfClass(front, "card-inner")
        if (!inner) inner = makeDivOfClass("card-inner", front)

        if (card[0] == '♥' || card[0] == '♦' || card[0] == '♠' || card[0] == '♣') {
            Card.putCardSprite(card,inner)
        } else {
            inner.innerHTML = card
        }
        

    }

    static async flip_card(container, reverse) {
        if (reverse) {
            var a=animate_transform(getFirstOfClass(container,"front"), "rotate3d(0,1,0,-180deg)", 250);
            var b=animate_transform(getFirstOfClass(container,"back"), "rotate3d(0,1,0,0deg)", 250);
        } else {
            a=animate_transform(getFirstOfClass(container, "front"), "rotate3d(0,1,0,0deg)", 650);
            b=animate_transform(getFirstOfClass(container, "back"), "rotate3d(0,1,0,-180deg)", 650);
        }
        await Promise.all([ a.finished ,     await b.finished] )
    }

    static getTransform(column, column_offset, row, row_offset) {
        return "translate3d("
            +"calc((1.2 * " + column + " * var(--card_width)) + " + column_offset + "px), "
            +"calc((var(--card_height) * "+row+ ") + " + row_offset + "px), 0px)" 
    }

    static async make_deck_card(node) {
        node.removeAttribute("id")
        node.setAttribute("class", "card-container")
        Card.flip_card(node,true)
    }

    static make_it_a_card(node, card) {
        node.id = card;
        this.set_card_front(node, card)
        Card.flip_card(node, false)
        node.setAttribute('onclick', 'send_card(\''+card+'\')')
    }

    static make_verb_card(mode) {
        if (mode != 'Defend' && mode != 'Add') {
            let verb = getFirstOfClass(document,"verb")
            return verb? document.body.removeChild(verb) : null
        }

        var node = makeDivOfClass("card-container verb", document.body)
        makeDivOfClass("back", node)
        
        if (mode == 'Defend') { 
            this.set_card_front(node, "Take")
            node.setAttribute("onclick", "send_verb('take')")
        } else if (mode == 'Add') { 
            this.set_card_front(node, "Done")
            node.setAttribute("onclick", "send_verb('pass')")
        } 
        
        animate_transform(node, 
            Card.getTransform(Table.state.theTable.getHand(Table.state.theTable.my_name).count()+0, 0, 4, 0), 0)
        Card.flip_card(node)  
    }

    static async make_menu_card(option, position, onclick) {
        var node = makeDivOfClass("card-container verb menu", document.body)
        makeDivOfClass("back", node)

        this.set_card_front(node, ""+option) 
        await animate_transform(node, 
            Card.getTransform(1+position, 0, 2, 0), 300).finished
        await Card.flip_card(node)
        node.onclick=onclick
        node.classList.add("highlight")
    }

    static delete_menu_cards() {
        while (getFirstOfClass(document.body, "menu"))  document.body.removeChild(getFirstOfClass(document.body, "menu"))
    }
}