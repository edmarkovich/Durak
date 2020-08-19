import {sleep} from "./utils.js";
import {Deck} from "./deck.js"
import {Table} from "./table.js"

let state = {
    game: null,
    running: false
}

let host = "ws://"+location.host+":5678"
if (location.host == "localhost:8000") { host = "ws://thepi:5678" }


let socket = new WebSocket(host)
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
            Table.state.theTable = new Table(game.trump, state.my_name, game.players.map(x => x.name))
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
        checker(game)
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

function checker(game) {
    // Does deck contain what it should?
    let a = document.getElementsByClassName("deck").length

    // Does my hand contain what it should?
    let b = document.getElementsByClassName("mine").length

    // Does other hand contain what it should?
    let c = document.getElementsByClassName("his_card").length

    if (a != parseInt(game.deck)) {
        console.log("Deck Problem:", a, game.deck)
        alert("Deck Problem")
    }

    if (b != get_hand_array(true, game).length) {
        console.log("Mine Problem:", b, get_hand_array(true, game).length)
        alert("Mine Problem")
    }
    
    if (c != get_hand_array(false, game).length) {
        console.log("His Problem:", c, get_hand_array(false, game).length)
        alert("His Problem")
    }
}