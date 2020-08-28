/* eslint-disable no-constant-condition */
import {sleep} from "./utils.js";
import {Deck} from "./deck.js"
import {Table} from "./table.js"
import {Create} from "./create.js"

let state = {
    game: null,
    running: false
}

let host = "ws://"+location.hostname+":5678/game"
let socket = null


window.onload = async function() {
    state.my_name = new URLSearchParams(window.location.search).get("name")

    let create = new Create(socket)
    window.got_click =  create.got_click.bind(create)
    create.renderCreate()
    state.my_name = await create.getName()
    
    state.firstRequest = await create.getRequest()
    state.game_id = create.getGameId()

    socket = new WebSocket(host)

    socket.onopen = async function() {
        socket.send(state.firstRequest)
        event_loop()
    }

    socket.onclose = async function() {
        alert("Server Closed Connection")
    }

    socket.onmessage = async function(event) {
        action_list.push(event)
    }
    
}




function get_hands_array(game) {
    let out = {}
    for (let i=0; i< game.players.length; i++) {
            out[game.players[i].name] = game.players[i].hand 
    }
    return out    
}



let action_list = []

async function event_loop() {
    while (true) {
        await sleep(100)
        if (action_list.length == 0) { continue }
            let event = action_list.shift()
            await process_inbound(event)
    }
}





async function process_inbound(event) {

    let payload = JSON.parse(event.data)

    if ('created' in payload) {
        state.game_id = payload['created']
        alert("Tell your friends to join game #"+ state.game_id)
        socket.send('{"game_id":'+ state.game_id+', "action":"join","name":"'+state.my_name+'"}')
    }

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
            Table.state.theTable.prompt_for_action(payload.prompt.player, payload.prompt)
            if (payload.prompt.player.indexOf("🤖") != -1) {
                await sleep(1000 + (Math.random() * 500))
            }
        } 
        
        if (payload.prompt.prompt == "over") {
            alert("Game Over!")
        }
    }

}

export function send_card(card) { socket.send('{"game_id": "'+state.game_id + '", "action":"", "card":"'+card+'"}') }
export function send_verb(verb) { socket.send('{"game_id": "'+state.game_id + '", "action":"'+verb+'"}') }


