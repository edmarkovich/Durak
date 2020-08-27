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
        self.websockets=[]
        self.end_mode=False
        self.gamethread = None

    def create_game(self, message):
        message = json.loads(message)

        if self.gamethread: 
            self.gamethread.inqueue.put("Die")
            self.gamethread = None
        self.end_mode=False

        player_count = int(message['humans'])
        computer_count = int(message['computers'])
        time.sleep(1)
        self.gamethread = GameThread(player_count, computer_count)
        self.gamethread.start()

    def run(self):
        async def inbound_messaging(websocket, path):
            if len(self.websockets) == 0:
                print(websocket.remote_address, "WS: First client, restarting the game", path)
                self.end_mode=False

            if self.end_mode:
                print(websocket.remote_address, "WS: End mode in progress")
                return
            
            print (websocket.remote_address, "WS: Subscribing #", len(self.websockets))
            self.websockets.append(websocket)

            async for message in websocket:
                if 'create' in message and (not self.gamethread or not self.gamethread.is_alive()):
                    self.create_game(message)

                self.gamethread.inqueue.put(message)

            self.websockets.remove(websocket)
            print(websocket.remote_address, "WS: Disconect. Now: ", len(self.websockets))
            self.end_mode=True

        async def outbound_messaging():
            while True:
                await asyncio.sleep(0.1)
                if self.gamethread and not self.gamethread.outqueue.empty():
                    m = self.gamethread.outqueue.get()
                    for ws in self.websockets:
                        await ws.send(m)

        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        start_server = websockets.serve(inbound_messaging, port=5678)

        asyncio.ensure_future(start_server)
        asyncio.ensure_future(outbound_messaging())
        asyncio.get_event_loop().run_forever()
        print("WS: End Run Thread")

class GameThread(threading.Thread):
    def __init__(self, player_count, computer_count):
        threading.Thread.__init__(self)
        self.player_count = player_count
        self.computer_count = computer_count
        self.inqueue = queue.Queue()
        self.outqueue = queue.Queue()

    def run(self):
        try:
            game = Game(self.player_count, self.computer_count)
            print ("Game Thread: New Game Started:", self.player_count)
            IOUtil.game = game
            IOUtil.defaultSource = self.inqueue.get
            IOUtil.defaultDestination = self.outqueue.put
            game.main_loop()
        except RestartException as e:
            print ("Game Thread: Exiting")
        except Exception as e:
            print ("Other Issue", e)
            traceback.print_exc()
            print ("Exiting.....")
        print ("Exiting Game Thread Normally")

wsthread = WSThread()
wsthread.start()


