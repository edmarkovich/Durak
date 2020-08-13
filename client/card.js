
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
            a=Card.animate_transform(front, "rotate3d(0,1,0,-180deg)", 150);
            b=Card.animate_transform(back, "rotate3d(0,1,0,0deg)", 150);
        } else {
            a=Card.animate_transform(front, "rotate3d(0,1,0,0deg)", 150);
            b=Card.animate_transform(back, "rotate3d(0,1,0,-180deg)", 150);
        }
        await Promise.all([ a.finished ,     await b.finished] )
    }

    static animate_transform(element, transform,speed) {
        let anim = element.animate([ { transform: transform}], {
            duration: speed,
            iterations: 1,
            fill: "forwards",
        })  
        return anim;
    }

}