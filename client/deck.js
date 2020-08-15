import {Card} from "./card.js"
import {sleep, animate_transform} from "./utils.js"

export class Deck {

    static async init(trump) {
        await Deck.new_deck()
        await Deck.put_trump(trump)
    }

    static async new_deck() {
        let waits = []
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

            waits.push(animate_transform(container, Card.getTransform(1, 0, 2, 0),500))
        }
        for (let i=0; i<waits.length; ++i) { await waits[i].finished  }
    }

    static async put_trump(trump_card) {
    
        let nodes = document.getElementsByClassName("deck")
        let node = nodes[0]
        Card.make_it_a_card(node, trump_card);
    
        //Flip, turn and move turmp
        Card.flip_card(node)
        await animate_transform(node, Card.getTransform(0, 0, 2, 10), 500).finished
    
        //Put the deck over trump
        let waits = [];
        for (let i=1; i<nodes.length; i++) {
            node = nodes[i]
            waits.push(animate_transform(node, Card.getTransform(0, 70, 2, -50), 500))
        } 
        for (let i=0; i<waits.length; ++i) { await waits[i].finished  }
        await sleep(100)
    }
    
    static async take_card_from_deck() {
    
        let nodes = document.getElementsByClassName("deck")
        let node = nodes[nodes.length-1]
    
        node.classList.remove("deck")
        return node;
    }
}
