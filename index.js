import express from 'express'
import htt from 'http'
import socketio from 'socket.io'
import {GameManager} from "./game_manager.js"



let app = express()
let http = htt.createServer(app);
let io = socketio(http);


app.use(express.static('client'))

let gameManager = new GameManager(io)



io.on('connection', (socket) => {
  
    socket.on('create_game', (msg) => {
      
      
      let player_count = msg['humans']
      let computer_count = msg['computers']
      console.log("Create_game", player_count, computer_count)

      let game_id = gameManager.create_game(msg)
      socket.emit("created", {'created':game_id})

    });

    socket.on('join', (msg) => {
      let game_id = msg['game_id']      
      socket.join(game_id)
      gameManager.join_game(msg)      
    });

    socket.on('game_action', (msg) => {
      gameManager.process_move(msg)
    });
  });

const PORT = process.env.PORT || 3000
http.listen(PORT, () => {
  console.log('listening on *:', PORT);
});