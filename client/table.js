import { Card } from './card.js';
import { MyHand, OtherHand } from "./hand.js";
import { animate_transform, sleep} from "./utils.js"

export class Table {

    constructor(trump_card, my_name, players) {
        this.my_name = my_name
        this.hands = {}
        let hands_index = 0
        let idx = players.indexOf(my_name)

        this.player_sequence=players.slice(idx+1,).concat(players.slice(0, idx)).concat([my_name])

        this.hands = this.player_sequence.reduce( function (acc, item) {acc[item]=new OtherHand(trump_card, hands_index++, item); return acc}, {} )
        this.hands[my_name] = new MyHand(trump_card, my_name)
        
        this.last_attack_slot = -1
        this.zIndex = 100

        this.done_pile =0

    }
    
    getHand(player_name) {
        for (let name in this.hands) {
            if (name == player_name) {
                return this.hands[name]
            }
        }
    }

    prompt_for_action(player_name, prompt){
        this.mode = prompt.prompt
        this.getHand(player_name).glow(true)
        if (player_name == this.my_name) {
            Card.make_verb_card(this.mode)

            if (prompt.prompt == "Defend") { Table.notice_to_table("Defend or take cards") }
            if (prompt.prompt == "Attack") { Table.notice_to_table("Attack " + prompt.defender)}
            if (prompt.prompt == "Add") {
                if (prompt.took) {
                    Table.notice_to_table(prompt.defender + " is taking, add cards")
                } else {
                    Table.notice_to_table(prompt.defender + " defended, add cards")
                }
            }
        } 
    }

    async table_to_hand(player_name, player_hand) {
        let waits = []
        let nodes = document.getElementsByClassName("table")
        let to_hand = []

        for (let i=0; i<nodes.length; ++i) {
            let node = nodes[i]
            let card = node.id

            if (player_hand.indexOf(card) != -1) {
                to_hand.push(node)
            }
        }

        for (let i=0; i<to_hand.length; ++i) {
            let node = to_hand[i]
            node.classList.remove("table")
            if (player_name != this.my_name) {
                await Card.make_deck_card(node)
            }
            //waits.push(this.getOtherHand(player_name).add_card(node))
            await this.hands[player_name].add_card(node,node.id)
        }

        await Promise.all(waits)
    }

    async clear(all_hands) {
        let waits = []

        for (let player in all_hands) {
            await this.table_to_hand(player, all_hands[player])
        }

        while (document.getElementsByClassName("table").length>0) {
            let node = document.getElementsByClassName("table")[0]
            node.classList.remove("table")
            node.classList.add("pile")

            this.done_pile++

            // Put in the done pile
            await Card.flip_card(node, true)
            let r = (Math.random()*30)+(this.done_pile%10)*5
            let x = (Math.random()*10)+this.done_pile*5
            let y = (Math.random()*10)+(this.done_pile)*5
            node.style.zIndex = this.done_pile
            waits.push(animate_transform(node, Card.getTransform(8,x,2,y) + "rotate3d(0,0,1,"+r+"deg)", 300).finished)
            await sleep(100)
        }

        waits.push(this.getHand(this.my_name).arrange());
        await Promise.all(waits)
        this.last_attack_slot=-1
    }

    async prepare_next_round(all_hands) {
        await this.clear(all_hands) 
        
        for (let i=0; i<this.player_sequence.length; ++i) {
            await this.hands[this.player_sequence[i]].refill(all_hands[this.player_sequence[i]])
        }
    }

    async play(card, player_name) {
        let hand = this.getHand(player_name)
        let node = hand.pop_card(card);
        await this.card_to_table(node, this.mode)
        await hand.arrange()
    }

    async render_turn(old_table_cards, new_table_cards, all_hands) {
        Card.make_verb_card(null)

        for (let name in all_hands) {
            Table.notice_to_table("")
            this.hands[name].glow(false)
        }

        let table_to_add = new_table_cards.filter(x => !old_table_cards.includes(x) );
        for (let i=0; i<table_to_add.length; i++) {
            
            for (let name in all_hands) {
                this.getHand(name).glow(false)
                if (all_hands[name].indexOf(table_to_add[i]) != -1 ) {
                    await this.play(table_to_add[i], name)
                }
            }
        }
    }

    static async notice_to_table(text) {

        let notice_areas = document.getElementsByClassName("notice")
        if (notice_areas.length==0){ 
            let notice_area = document.createElement("div")
            notice_area.classList.add("notice")
            document.body.appendChild(notice_area)
        }
        let notice_area = document.getElementsByClassName("notice")[0]
        notice_area.innerHTML =  text?">> "+ text:""
    }

    async card_to_table(node, mode) {
        node.style.zIndex = this.zIndex++
        node.classList.add("table")

        if (mode == "Defend") {
            await animate_transform(node, Card.getTransform(2 + this.last_attack_slot, 10, 2, 15) + "rotate3d(0,0,1,400deg)", 500).finished
        }
        else {
            this.last_attack_slot++
            await animate_transform(node, Card.getTransform(2 + this.last_attack_slot, 0, 2, 0), 500).finished
        }
    }
}


Table.state = { }