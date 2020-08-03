#https://websockets.readthedocs.io/en/stable/intro.html

import asyncio
import websockets
import json

import threading
import queue

from server.game import Game
from server.ioutil import IOUtil

queue = queue.Queue(1)

class WSThread(threading.Thread):
    def __init__(self):
      threading.Thread.__init__(self)
    def run(self):
      async def update(websocket, path):
        while True:
           await websocket.send("Hello")
           async for message in websocket:
             data = message #= json.loads(message)
             queue.put(data)
             #await websocket.send("Got: "+data)            

      asyncio.set_event_loop(asyncio.new_event_loop())
      start_server = websockets.serve(update, "192.168.0.111", 5678)
      asyncio.get_event_loop().run_until_complete(start_server)
      asyncio.get_event_loop().run_forever()

wsthread = WSThread()
wsthread.start()

game = Game(4)
IOUtil.defaultSource = queue.get
IOUtil.game = game

game.main_loop()


