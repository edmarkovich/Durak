import {sleep} from "./utils.js";
import {Deck} from "./deck.js"
import {Table} from "./table.js"
import {Card} from  "./card.js"

let state = {
    game: null
}

let socket = new WebSocket("ws://192.168.1.13:5678")
socket.onopen = function() {
    state.my_name = prompt("Player Name"); 
    socket.send('{"action":"join","name":"'+state.my_name+'"}');
}

var running = false;
socket.onmessage = async function(event) {
    while (running) { await sleep(100) }
    running = true;

    let payload = JSON.parse(event.data)

    Card.make_verb_card(null);

    if ('game' in payload) {
        // This is the "next" state
        let game = payload.game

        // State.game is the previous state (ie what is previously rendered)
        if(!state.game) {
            // Nothing was yet rendered, build up the UI stuff
            await Deck.init(game.trump)
            Table.state.theTable = new Table(game.trump[0])
        }

        // Don't glow either hand until everything else is rendered.
        Table.state.theTable.getHand().glow(false)
        Table.state.theTable.getOtherHand().glow(false)

        // These are cards that are on the table this update that were not
        // there during the last one (ie update was triggered by a move)
        let table_to_add = game.table.filter(x => !state.game.table.includes(x) );
        for (let i=0; i<table_to_add.length; i++) {
            // Figure out whose hand these cards were in during last update
            for (let j=0; j<state.game.players.length; j++) {
                if (state.game.players[j].hand.indexOf(table_to_add[i]) != -1) {
                    // Were they in my hand or "other's" hand. Take them and put
                    // them on the table
                    let is_my_move = (state.game.players[j].name == state.my_name)
                    await Table.state.theTable.play(table_to_add[i], is_my_move)
                }
            }
        }
        
        // Server has cleared the table, meaning we're about to start a new 'bout'
        if (game.table.length==0) {
            let my_hand = null
            let other_hand = null
            for (let id in game.players) {
                // Find my hand and other hands that will be the case in next round.
                if (game.players[id].name == state.my_name) {
                    my_hand = game.players[id].hand
                } else {
                    other_hand = game.players[id].hand
                }
            }

            // Clear the table and refill the hands from either table or deck
            await Table.state.theTable.prepare_next_round(my_hand,other_hand)
        }
        state.game = game
        
    }

    if ('prompt' in payload && 'player' in payload.prompt) {
        // Glow hand and make the verb card
        let mode = payload.prompt.prompt
        let my_turn = payload.prompt.player == state.my_name
        Table.state.theTable.prepare_turn(my_turn, mode)
    }
    running = false;
}

export function send_card(card) { socket.send('{"action":"", "card":"'+card+'"}') }
export function send_verb(verb) { socket.send('{"action":"'+verb+'"}') }