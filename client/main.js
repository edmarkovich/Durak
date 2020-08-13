import {sleep, animation_state} from "./animations.js";
import {Deck} from "./deck.js"
import {Hand} from "./hand.js"
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


                while (running) {
                    await sleep(100)
                }
                running = true;

                let payload = JSON.parse(event.data)

                Hand.glow_hand("clear");
                Card.make_verb_card(null);

                if ('game' in payload) {

                    let game = payload.game
                    if(!state.game) {
                        await Deck.new_deck()
                        animation_state.trump =game.trump[0]
                        animation_state.trump_card = game.trump
                        await Deck.put_trump(game.trump)
                    }

                    let table_to_add = game.table.filter(x => !state.game.table.includes(x) );
                    for (let i=0; i<table_to_add.length; i++) {
                        for (let j=0; j<state.game.players.length; j++) {
                            if (state.game.players[j].hand.indexOf(table_to_add[i]) != -1) {
                                if (state.game.players[j].name == state.my_name) {
                                    await Table.play_own(table_to_add[i], state.mode);
                                } else {
                                    await Table.play_other(table_to_add[i], state.mode);
                                }
                            }
                        }
                    }
                    
                    if (game.table.length==0) {
                        let my_hand = null
                        let other_hand = null
                        for (let id in game.players) {
                            let name = game.players[id].name
                            let hand = game.players[id].hand

                            if (name == state.my_name) {
                                my_hand = hand
                            } else {
                                other_hand = hand
                            }
                        }
                        await Table.clear_table(my_hand,other_hand) 
                        await Hand.refill_my_hand(my_hand);
                        await Hand.refill_other_hand(other_hand)
                    }
                    state.game = game
                    
                }

                if ('prompt' in payload) {
                    state.mode = payload.prompt.prompt;
                   if ('player' in payload.prompt) {
                        if (payload.prompt.player == state.my_name) {
                            Hand.glow_hand("me");
                            if (state.mode == 'Defend') { Card.make_verb_card('take') }
                            else if (state.mode == 'First attack') { Card.make_verb_card(null) }
                            else if (state.mode == 'Add Cards') { Card.make_verb_card('pass') }
                            else {Card.make_verb_card(state.mode)}

                        } else {
                            Hand.glow_hand("other")
                        }
                    }
                }
                running = false;
            }

            export function send_card(card) {
                socket.send('{"action":"", "card":"'+card+'"}')
            }
            
            export function send_verb(verb) {
                socket.send('{"action":"'+verb+'"}')
            }