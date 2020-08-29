import { animate_transform} from "./utils.js"
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

    static card_to_unicode(card) {
        switch (card[0]) {
            case '♠': var base = 127137; break;
            case '♥': base = 127153; break;
            case '♦': base = 127169; break;
            case '♣': base = 127185; break;
            default: return card
        }
        switch (card.substring(1)) {
            case 'A': var offset = 0; break;
            case 'J': offset = 10; break;
            case 'Q': offset = 12; break;
            case 'K': offset = 13; break;
            default: offset = parseInt(card.substring(1)) - 1;
        }
        return "&#" + (base + offset) + ";";
    }

    static set_card_front(node, card) {
        let front = getFirstOfClass(node, "front")
        if (!front) front = makeDivOfClass("front", node)

        let inner = getFirstOfClass(front, "card-inner")
        if (!inner) inner = makeDivOfClass("card-inner", front)

        inner.innerHTML = Card.card_to_unicode(card)
        if (card[0] == '♥' || card[0] == '♦') { inner.classList.add("red"); } 
    }

    static async flip_card(container, reverse) {
        if (reverse) {
            var a=animate_transform(getFirstOfClass(container,"front"), "rotate3d(0,1,0,-180deg)", 150);
            var b=animate_transform(getFirstOfClass(container,"back"), "rotate3d(0,1,0,0deg)", 150);
        } else {
            a=animate_transform(getFirstOfClass(container, "front"), "rotate3d(0,1,0,0deg)", 150);
            b=animate_transform(getFirstOfClass(container, "back"), "rotate3d(0,1,0,-180deg)", 150);
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

    static make_menu_card(option, position, onclick) {
        var node = makeDivOfClass("card-container verb menu", document.body)
        makeDivOfClass("back", node)
        this.set_card_front(node, ""+option)    
        animate_transform(node, 
            Card.getTransform(3+position, 0, 2, 0), 0)
        Card.flip_card(node)
        node.onclick=onclick
    }

    static delete_menu_cards() {
        while (getFirstOfClass(document.body, "menu"))  document.body.removeChild(getFirstOfClass(document.body, "menu"))

    }
}