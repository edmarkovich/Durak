import asyncio
import websockets
import json
import os
import sys

import threading
import queue

from server.game import Game
from server.ioutil import IOUtil
from server.ioutil import RestartException

import time

inqueue = queue.Queue()
outqueue = queue.Queue()




class WSThread(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
        self.websockets=[]
        self.end_mode=False
    def run(self):
        async def inbound_messaging(websocket, path):
            if len(self.websockets) == 0:
                print(websocket.remote_address, "WS: First client, restarting the game")
                inqueue.put("Die")
                self.end_mode=False
            if self.end_mode:
                print(websocket.remote_address, "WS: End mode in progress")
                return
            
            self.websockets.append(websocket)
            print (websocket.remote_address, "WS: Subscribing #", len(self.websockets))

            async for message in websocket:
                #print(websocket.remote_address, "WS: message: ", message)
                inqueue.put(message)

            self.websockets.remove(websocket)
            print(websocket.remote_address, "WS: Disconect. Now: ", len(self.websockets))
            self.end_mode=True

        async def outbound_messaging():
            while True:
                await asyncio.sleep(0.1)
                if not outqueue.empty():
                    m = outqueue.get()
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
    def __init__(self):
        threading.Thread.__init__(self)

    def run(self):
        while True:
            try:
                game = Game(2)
                print ("Game Thread: New Game Started")
                IOUtil.game = game
                IOUtil.defaultSource = inqueue.get
                IOUtil.defaultDestination = outqueue.put
                game.main_loop()
            except RestartException as e:
                print ("Game Thread: Restarting")
            except Exception as e:
                print ("Other Issue", e)
                print ("Restarting.....")


wsthread = WSThread()
wsthread.start()

gamethread = GameThread()
gamethread.start()
