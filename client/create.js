import { sleep } from "./utils.js"
import { Card } from "./card.js"
import { Table } from "./table.js"


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

    async makeBotRequest(self, bots) {
        Table.notice_to_table("")
        Card.delete_menu_cards()
        self.name = "You"
        self.request = JSON.stringify({"game_id":"create", "humans":1, "computers":bots, "name": self.name})
    }

    async makeJoinRequest(self) {
        Table.notice_to_table("")
        Card.delete_menu_cards()
        self.game_id  = prompt ("Game ID?")
        self.name    = prompt("Your Name")
        self.request = JSON.stringify({"game_id":self.game_id, "action":"join", "name": self.name})
    }

    async makeCreateRequest(self, players) {
        Table.notice_to_table("")
        Card.delete_menu_cards()
        self.name    = prompt("Your Name")
        self.request = JSON.stringify({"game_id":"create", "humans": (1+players), "computers":0, "name": self.name})
    }

    async renderHumans(self) {
        Table.notice_to_table("Join a game or start a new one?")
        Card.delete_menu_cards()
        Card.make_menu_card("Join", 0, function()   {self.makeJoinRequest(self)})
        Card.make_menu_card("Create", 1, function() {self.renderPlayerCount(self, self.makeCreateRequest)})       
    }

    async renderPlayerCount(self, callback) {
        Table.notice_to_table("How many opponents?")

        Card.delete_menu_cards()
        Card.make_menu_card("1", 0, function() {callback(self,1)})
        Card.make_menu_card("2", 1, function() {callback(self,2)})
        Card.make_menu_card("3", 2, function() {callback(self,3)})
    }

    async renderCreate() {
        let self = this
        Table.notice_to_table("Play agains Humans or Robots?")
        await Card.make_menu_card("Humans",   0, function() {self.renderHumans(self)})
        await Card.make_menu_card("Robots",   1, function() {self.renderPlayerCount(self, self.makeBotRequest)})
    }
}

