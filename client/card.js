import { animate_transform} from "./utils.js"
import { Table } from './table.js';

export class Card {

    static card_to_unicode(card) {
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
            default: offset = parseInt(card.substring(1)) - 1;
        }
        return "&#" + (base + offset) + ";";
    }

    static make_it_a_card(node, card) {
        node.id = card;
        let front = node.getElementsByClassName("front")[0]        
        let inner = document.createElement("div")
        inner.classList.add("card-inner")
        inner.innerHTML = Card.card_to_unicode(card)
        front.appendChild(inner)
        if (card[0] == '♥' || card[0] == '♦') { node.classList.add("red"); } 
        node.setAttribute('onclick', 'send_card(\''+card+'\')')
    }

     static async flip_card(container, reverse) {
        let front = container.getElementsByClassName("front")[0];
        let back = container.getElementsByClassName("back")[0];
    
        let a=null
        let b=null
    
        if (reverse) {
            a=animate_transform(front, "rotate3d(0,1,0,-180deg)", 150);
            b=animate_transform(back, "rotate3d(0,1,0,0deg)", 150);
        } else {
            a=animate_transform(front, "rotate3d(0,1,0,0deg)", 150);
            b=animate_transform(back, "rotate3d(0,1,0,-180deg)", 150);
        }
        await Promise.all([ a.finished ,     await b.finished] )
    }

    static getTransform(column, column_offset, row, row_offset) {
        return "translate3d("
            +"calc((1.2 * " + column + " * var(--card_width)) + " + column_offset + "px), "
            +"calc((var(--card_height) * "+row+ ") + " + row_offset + "px), 0px)" 
    }

    static async make_deck_card(node) {
        let inner = node.getElementsByClassName("front")[0].getElementsByClassName("card-inner")[0];
        if (inner) {
            node.getElementsByClassName("front")[0].removeChild(inner)
        }
        node.removeAttribute("id")
        node.removeAttribute("onclick")
        node.setAttribute("class", "card-container")
        Card.flip_card(node,true)
    }

    static make_verb_card(mode) {
        let verb=null
        let text=null

        if (mode == 'Defend') { 
            text = "Take"
            verb = 'take' 
        } else if (mode == 'Add') { 
            text = 'Skip'
            verb = 'pass' 
        }

        let node = null
        let nodes = document.getElementsByClassName("verb")
        if (nodes.length==0) { // Create this element for the first time
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
            return
        } 

        node.classList.remove("hidden")
        node.setAttribute("onclick", "send_verb('"+verb+"')")
        node.getElementsByClassName("front")[0].getElementsByClassName("card-inner")[0].innerHTML 
            =text
        animate_transform(node, 
            Card.getTransform(Table.state.theTable.getHand(Table.state.theTable.my_name).count()+0, 0, 4, 0), 0)
          
    }
}