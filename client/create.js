import { sleep } from "./utils.js"


export class Create {

    constructor(socket) {
        this.socket=socket
        this.name = null
    }

    async getName() {
        while (!this.name) {
            await sleep(200)
        }
        return this.name
    }

    got_click() {
        this.name = document.getElementById('player_name').value
        let species     = document.querySelector('input[name="species"]:checked').value
        let count       = parseInt(document.querySelector('input[name="count"]:checked').value)

        console.log(species,count)

        let humans    =  1 + (species=="human"?count:0)
        let computers =  0 + (species=="computer"?count:0)

        let out = JSON.stringify({"action":"create", "humans":humans, "computers":computers, "name": this.name})
        console.log(out)

        this.socket.send(out)

        let parent = document.body.getElementsByClassName("create")[0]
        document.body.removeChild(parent)
    }


    renderCreate() {
        let parent = document.createElement("div")
        parent.classList.add("create")

        let html = '<center>'
        html += '<br>'
        html += '<label for="fname">>> Your Name</label>'
        html += '<br>'
        html += '<input type="text" id="player_name" name="player_name" size="10" autofocus>'
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
        html += '<span onclick="got_click()" style="cursor: pointer;">>> Play</span>'
        html += '</center>'

        parent.innerHTML = html
        document.body.appendChild(parent)
    }
}

