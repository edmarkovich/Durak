import {sleep} from "./utils.js";
import {Deck} from "./deck.js"
import {Table} from "./table.js"

let state = {
    game: null,
    running: false
}

let socket = new WebSocket("ws://192.168.1.13:5678")
socket.onopen = function() {
    state.my_name = prompt("Player Name"); 
    socket.send('{"action":"join","name":"'+state.my_name+'"}');
}

function get_hand_array(mine, game) {
    for (let i=0; i< game.players.length; i++) {
        if (mine && game.players[i].name == state.my_name) { return game.players[i].hand }
        if (!mine && game.players[i].name != state.my_name) { return game.players[i].hand }
     }    
}

socket.onmessage = async function(event) {
    while (state.running) { await sleep(100) }
    state.running = true;

    let payload = JSON.parse(event.data)

    if ('game' in payload) {

        let game = payload.game

        if(!state.game) {
            // Nothing was yet rendered, build up the UI stuff
            await Deck.init(game.trump)
            Table.state.theTable = new Table(game.trump[0])
        } else {
            // These are cards that are on the table this update that were not
            // there during the last one (ie update was triggered by a move)
            await Table.state.theTable.render_turn(state.game.table, game.table, 
                get_hand_array(true,state.game), get_hand_array(false,state.game))
        } 

        if (game.table.length==0) {
            // Server has cleared the table, meaning we're about to start a new 'bout'
            // Clear the table and refill the hands from either table or deck
            await Table.state.theTable.prepare_next_round(  get_hand_array(true, game),
                                                            get_hand_array(false, game))
        }
        
        state.game = game
    }

    if ('prompt' in payload) {
        if ('player' in payload.prompt) {
            // Glow hand and make the verb card
            let my_turn = payload.prompt.player == state.my_name
            Table.state.theTable.prompt_for_action(my_turn, payload.prompt.prompt)
        } 
        
        if (payload.prompt.prompt == "over") {
            alert("Gave Over!")
        }
    }

    state.running = false;
}

export function send_card(card) { socket.send('{"action":"", "card":"'+card+'"}') }
export function send_verb(verb) { socket.send('{"action":"'+verb+'"}') }