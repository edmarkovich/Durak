import os
from flask import Flask, redirect, request
from serv import WSThread, GameThread
from flask_socketio import SocketIO, emit, join_room
import queue
import time
import threading
from atatus.contrib.flask import Atatus


app = Flask(__name__, static_folder='client')


app.config['ATATUS'] = {
    'APP_NAME': 'Playdurak',
    'LICENSE_KEY': 'lic_apm_6d3f3310d4394019a16c42dbf1f91844'
}
atatus = Atatus(app)

@app.route('/')
def client():
    return redirect("/client/index.html")

socketio = SocketIO(app, cors_allowed_origins = "*")

games = {}
outqueue = queue.Queue()

class ReplyThread(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
    def run(self):
        while True:
            socketio.sleep(0.1)
            if not outqueue.empty():
                out = outqueue.get()
                socketio.emit("GAME_UPDATE", out, room=out['game_id'])
rep_thread = ReplyThread()
rep_thread.start()

@socketio.on('create_game')
def on_create(data):
        print("ON CREATE", data)
        player_count = int(data['humans'])
        computer_count = int(data['computers'])
        gamethread = GameThread(player_count, computer_count, outqueue)
        gamethread.start()

        games[gamethread.ident] = {"thread": gamethread, "sockets":[]}
        emit("created", {'created':gamethread.ident})

@socketio.on('join')
def on_join(data):
    game = int(data['game_id'])
    join_room(game)
    games[game]['thread'].dispatch(data)

@socketio.on('game_action')
def on_game_action(data):
    game = int(data['game_id'])
    print ("ON GAME ACTION", game, data)
    games[game]['thread'].dispatch(data)


if __name__ == '__main__':
    socketio.run(app)

