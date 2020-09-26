/* eslint-disable no-constant-condition */
import {sleep} from "./utils.js";
import {Deck} from "./deck.js"
import {Table} from "./table.js"
import {Create} from "./create.js"

let state = {
    game: null,
    running: false
}

var action_list = []
var IOsocket = io();
var initialized = false

IOsocket.on('connect', async function() {


    if (initialized) {
        console.log("Already Initialized")
        return
    }
    initialized = true

    let create = new Create()
    window.got_click =  create.got_click.bind(create)
    create.renderCreate()

    state.my_name = await create.getName()

    
    state.firstRequest = await create.getRequest()
    state.game_id = create.getGameId()
    IOsocket.emit(state.firstRequest[0], state.firstRequest[1])
    event_loop()
});

IOsocket.on('connect_error', (error) => {
    console.log(error)
    //alert("Connection Error")
  });

  IOsocket.on('connect_timeout', (timeout) => {
    console.log(timeout)
    alert("Connection Error")
  });

  IOsocket.on('error', (error) => {
    console.log(error)
    alert("Connection Error")
  });

  IOsocket.on('disconnect', (reason) => { 
    console.log(reason)
    alert("Connection Error")
  })


IOsocket.on('created', data => {
    state.game_id = data['created']
    if (state.my_name != "You") //TODO - there's a better way to do this
        alert("Tell your friends to join game #"+ state.game_id)

    IOsocket.emit('join', {"game_id": state.game_id , "name": state.my_name, "action":"join"})
});

IOsocket.on('GAME_UPDATE', data => {
    console.log("Here", data)
    action_list.push(data)
})

window.onload = async function() {
    state.my_name = new URLSearchParams(window.location.search).get("name")
    cache_card_sprites()
}

async function cache_card_sprites() {
    await sleep(3000)
    Deck.place_one_card()
    Deck.put_trump("♠A")
    let node = document.getElementsByClassName("deck")[0]
    node.classList.remove("deck")
    node.classList.remove("card-container")
    node.id = "sprite_cache"

    node.classList.add("sprite_cache")
    node.style.opacity = "0.1%"
    node.style.transform = "scale(0.1)"
}


function get_hands_array(game) {
    let out = {}
    for (let i=0; i< game.players.length; i++) {
            out[game.players[i].name] = game.players[i].hand 
    }
    return out    
}

async function event_loop() {
    while (true) {
        await sleep(100)
        if (action_list.length == 0) { continue }
            let event = action_list.shift()
            await process_inbound(event)
    }
}





async function process_inbound(payload) {


    if (payload == {}) return


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
                await sleep(100 + (Math.random() * 500))
            }
        } 
        
        if (payload.prompt.prompt == "over") {
            alert("Game Over!")
        }
    }

}

export function send_card(card) { IOsocket.emit('game_action', {"game_id": state.game_id, "name":state.my_name, "action":"play", "card":card})}
export function send_verb(verb) { IOsocket.emit('game_action', {"game_id": state.game_id, "name":state.my_name, "action":verb}) }





