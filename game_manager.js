import { AutoPlay } from "./auto_play.js"
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
        this.games[this.game_id] = {players:[], humans: message.humans, computers: message.computers, game: null}
        return this.game_id
    }

    join_game(message) {
        console.log("join_game", message)
        let game_id = message.game_id
        this.games[game_id].players.push(message.name)

        if (this.games[game_id].players.length == this.games[game_id].humans) {

            for (let i=0; i< this.games[game_id].computers; ++i) {
                this.games[game_id].players.push("🤖 Robot "+(i+1))
            }

            console.log("Starting Game")
            this.games[game_id].game = new Game(this.games[game_id].players)
            this.send_state(game_id)

            this.autoplay(game_id)
        }
    }

    autoplay(game_id) {
        if (this.games[game_id].computers == 0 ) return
        let autoPlay = new AutoPlay(this.games[game_id].game)
        while (this.games[game_id].game.state != "game over") {
            let whose_turn = this.games[game_id].game.whose_turn()
            if (whose_turn.indexOf("🤖") == -1) {
                return //human player
            }
            autoPlay.play_as(whose_turn)
            this.send_state(game_id)
            if (this.games[game_id].game.prepare_next_round())
                this.send_state(game_id)
        }
        this.send_state(game_id)
    }

    process_move(message) {
        console.log("process_move", message)
        //TODO - check it's an actual game in progress
        let game = this.games[message.game_id].game        
        game.process_input(message.name, message.action, message.card)
        this.send_state(message.game_id)
        if (game.prepare_next_round())
            this.send_state(message.game_id) // TODO - often duplicated right?

        this.autoplay(message.game_id)

        //if game over, remove the game
    }

    send_state(game_id) {
        let game = this.games[game_id].game
        let out = {
            game: {
                trump: game.trump_card,
                players: Object.keys(game.players).map(x => {return {name: x, hand: game.players[x].cards.map(y=>y.toString())}}),
                table: game.table.gatherAllCards(true).map(x => x.toString())
            },
            prompt: {
                player: game.whose_turn(),
                prompt: "",
                defender: game.defender
            }
        }

        switch (game.state) {
            case "empty table":
                out.prompt.prompt = "Attack"                                
                break
            case "attack in progress":
                out.prompt.prompt = "Defend"            
                break
            case "taking":
            case "passed on add":
            case "passed on attack":
                out.prompt.took = true
                out.prompt.prompt = "Add"            
                break
            case "beat one":        
                out.prompt.prompt = "Add"            
                break
            case "game over":
                out.prompt.prompt = "over"            
                break  
            default:
                delete out.prompt // these aren't actual promptable states        
        }

        this.io.to(game_id).emit("GAME_UPDATE", out);
    }


}