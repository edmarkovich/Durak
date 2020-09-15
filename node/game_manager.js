import {Game} from "./game_core/game.js"

export class GameManager {

    constructor (io) {
        this.io = io
        this.games = {}
        this.game_id = 0
    }

    create_game(message) {        
        console.log("create_game", message)
        this.game_id++
        this.games[this.game_id] = {players:[], expected: message.humans, game: null}
        return this.game_id
    }

    join_game(message) {
        console.log("join_game", message)
        let game_id = message.game_id
        this.games[game_id].players.push(message.name)

        if (this.games[game_id].players.length == this.games[game_id].expected) {
            console.log("Starting Game")
            this.games[game_id].game = new Game(this.games[game_id].players)
            this.send_state(game_id)
        }
    }

    process_move() {
        //apply move to the right game
        //send out status update
        //if game over, remove the game
    }

    send_state(game_id) {
        let game = this.games[game_id].game
        let out = {
            game: {
                trump: game.deck.cards[0].toString(), //TODO: will break when deck's done
                players: Object.keys(game.players).map(x => {return {name: x, hand: game.players[x].cards.map(y=>y.toString())}}),
                table: game.table.gatherAllCards(true)
            }


        }


        this.io.to(game_id).emit("GAME_UPDATE", out);
    }


}