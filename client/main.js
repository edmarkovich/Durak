import {sleep} from "./utils.js";
import {Deck} from "./deck.js"
import {Table} from "./table.js"

let state = {
    game: null,
    running: false
}

let host = "ws://"+location.hostname+":5678"


let socket = new WebSocket(host)


socket.onopen = function() {

    event_loop()

    state.my_name = new URLSearchParams(window.location.search).get("name")

    if (!state.my_name) {
        state.my_name = prompt("Player Name")
    } 
    socket.send('{"action":"join","name":"'+state.my_name+'"}')
}


function get_hands_array(game) {
    let out = {}
    for (let i=0; i< game.players.length; i++) {
            out[game.players[i].name] = game.players[i].hand 
    }
    return out    
}

socket.onclose = async function() {
    alert("Server Closed Connection")
}

let action_list = []

async function event_loop() {
    while (true) {
        await sleep(10)
        if (action_list.length == 0) { continue }
            let event = action_list.shift()
            await process_inbound(event)
    }
}

socket.onmessage = async function(event) {
    action_list.push(event)
}



async function process_inbound(event) {


    let payload = JSON.parse(event.data)

    if ('game' in payload) {
        let game = payload.game

        if(!state.game) {
            // Nothing was yet rendered, build up the UI stuff
            await Deck.init(game.trump)
            Table.state.theTable = new Table(game.trump, state.my_name, game.players.map(x => x.name))
        } else {
            // These are cards that are on the table this update that were not
            // there during the last one (ie update was triggered by a move)
            await Table.state.theTable.render_turn(state.game.table, game.table, 
                get_hands_array(state.game))
        } 

        if (game.table.length==0) {
            // Server has cleared the table, meaning we're about to start a new 'bout'
            // Clear the table and refill the hands from either table or deck
            await Table.state.theTable.prepare_next_round(  get_hands_array(game))

        }
        
        state.game = game
    }

    if ('prompt' in payload) {

        if ('player' in payload.prompt) {
            // Glow hand and make the verb card
            Table.state.theTable.prompt_for_action(payload.prompt.player, payload.prompt.prompt)
            if (payload.prompt.player.indexOf("Computer") != -1) {
                await sleep(500)
            }
        } 
        
        if (payload.prompt.prompt == "over") {
            alert("Game Over!")
        }
    }

}

export function send_card(card) { socket.send('{"action":"", "card":"'+card+'"}') }
export function send_verb(verb) { socket.send('{"action":"'+verb+'"}') }

