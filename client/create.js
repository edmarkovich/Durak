import { sleep } from "./utils.js"
import { Card } from "./card.js"


export class Create {

    constructor(socket) {
        this.socket=socket
        this.name = null
        this.game_id = null
    }

    async getName() {
        while (!this.name) {
            await sleep(500)
        }
        return this.name
    }

    getGameId() {
        return this.game_id
    }

    async getRequest() {
        return this.request
    }

    async got_click(verb) {
        this.name   = document.getElementById('player_name').value
        let game_id = document.getElementById('game_id').value

        let species     = document.querySelector('input[name="species"]:checked').value
        let count       = parseInt(document.querySelector('input[name="count"]:checked').value)

        let humans    =  1 + (species=="human"?count:0)
        let computers =  0 + (species=="computer"?count:0)

        let out = ""
        if (verb==1) {
            out = JSON.stringify({"game_id":"create", "humans":humans, "computers":computers, "name": this.name})
        } else {
            out = JSON.stringify({"game_id":game_id, "action":"join", "name": this.name})
            this.game_id = game_id
        }


        let parent = document.body.getElementsByClassName("create")[0]
        document.body.removeChild(parent)

        this.request=out
    }


    async renderCreate() {

        Card.make_menu_card("Humans", 0)
        Card.make_menu_card("Bots", 1)
        return


        let parent = document.createElement("div")
        parent.classList.add("create")

        let html = '<center>'
        html += '<br>'
        html += '<label for="fname">>> Your Name</label>'
        html += '<br>'
        html += '<input type="text" id="player_name" name="player_name" size="10" value="Ed">'
        html += '<br><br>'
        html += ">> Opponents<br>"
        html += '<input type="radio" id="human" name="species" value="human">'
        html += '<label for="human">Humans</label>&nbsp;&nbsp;'
        html += '<input type="radio" id="computer" name="species" value="computer" checked>'
        html += '<label for="computer">Computers</label>'
        html += '<br>'
        html += '<input type="radio" id="1" name="count" value="1"><label for="1">1</label>&nbsp;&nbsp;'
        html += '<input type="radio" id="2" name="count" value="2"><label for="2">2</label>&nbsp;&nbsp;'
        html += '<input type="radio" id="3" name="count" value="3" checked><label for="3">3</label>&nbsp;&nbsp;'
        html += '<br><br>'
        html += '<span onclick="got_click(1)" style="cursor: pointer;">>> Create</span>'
        html += '<br><br>'
        html += '<input type="text" id="game_id" name="game_id" size="10"><br>'
        html += '<span onclick="got_click(2)" style="cursor: pointer;">>> Join</span>'
        html += '</center>'

        parent.innerHTML = html
        document.body.appendChild(parent)
    }
}

