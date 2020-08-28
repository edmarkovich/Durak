import asyncio
import websockets
import json
import os
import sys
import traceback
import json

import threading
import queue

from server.game import Game
from server.ioutil import IOUtil
from server.ioutil import RestartException

import time

class WSThread(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
        self.end_mode=False
        self.games = {}
        self.outqueue = queue.Queue()


    def create_game(self, message):

        player_count = int(message['humans'])
        computer_count = int(message['computers'])
        time.sleep(1)
        gamethread = GameThread(player_count, computer_count, self.outqueue)
        gamethread.start()

        self.games[gamethread.ident] = {"thread": gamethread, "sockets":[]}
        return gamethread.ident

    def run(self):
        async def inbound_messaging(websocket, path):

            async for message in websocket:
                message = json.loads(message)

                if 'game_id' in message:
                    game_id = message['game_id']

                    if game_id == "create":
                        id =  self.create_game(message)
                        await websocket.send(json.dumps({'created':id}))
                        continue

                    game_id = int(game_id)
                    if game_id in self.games:
                        #TODO - this can be more efficient
                        if websocket not in self.games[game_id]['sockets']:
                            print("Subscribe", websocket, "for", game_id)
                            self.games[game_id]['sockets'].append(websocket) 
                        self.games[game_id]['thread'].dispatch(message)
                    else:
                        print("Unknown Game ID", message)
                else:
                    print ("Missing Game ID", message)


        async def outbound_messaging():
            while True:
                await asyncio.sleep(0.1)
                if not self.outqueue.empty():
                    m = self.outqueue.get()
                    for ws in self.games[m['game_id']]['sockets']:
                        await ws.send(m['payload'])

        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        start_server = websockets.serve(inbound_messaging, port=5678)

        asyncio.ensure_future(start_server)
        asyncio.ensure_future(outbound_messaging())
        asyncio.get_event_loop().run_forever()
        print("WS: End Run Thread")

class GameThread(threading.Thread):
    def __init__(self, player_count, computer_count, outqueue):
        threading.Thread.__init__(self)
        self.player_count = player_count
        self.computer_count = computer_count
        self.inqueue = queue.Queue()
        self.outqueue = outqueue

    def run(self):
        try:
            print ("Game Thread: New Game Started:", self.player_count)
            game = Game(self.player_count, self.computer_count)
            game.ioutil = IOUtil(self.inqueue.get,
                            lambda x:  self.outqueue.put({"game_id": self.ident, "payload":x}),
                            game)
            
            game.main_loop()
        except RestartException as e:
            print ("Game Thread: Exiting")
        except Exception as e:
            print ("Other Issue", e)
            traceback.print_exc()
            print ("Exiting.....")
        print ("Exiting Game Thread Normally")

    def dispatch(self, message):
        print("Dispatching", self.ident)
        self.inqueue.put(message)

wsthread = WSThread()
wsthread.start()