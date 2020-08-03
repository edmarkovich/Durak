#https://websockets.readthedocs.io/en/stable/intro.html

import asyncio
import websockets
import json

import threading
import queue

from server.game import Game
from server.ioutil import IOUtil

import time

inqueue = queue.Queue(1)
outqueue = queue.Queue(1)

class WSThread(threading.Thread):
    def __init__(self):
      threading.Thread.__init__(self)
      self.websocket=None
    def run(self):
      async def update(websocket, path):
        self.websocket = websocket
        while True:
           await websocket.send("Hello")
           async for message in websocket:
             data = message #= json.loads(message)
             inqueue.put(data)
             #await websocket.send("Got: "+data)            

      async def test():
        while True:
            await asyncio.sleep(1)
            if self.websocket:
              await self.websocket.send(outqueue.get())

      asyncio.set_event_loop(asyncio.new_event_loop())
      start_server = websockets.serve(update, "192.168.0.111", 5678)
      asyncio.get_event_loop().run_until_complete(start_server)
      asyncio.get_event_loop().create_task(test())
      asyncio.get_event_loop().run_forever()

wsthread = WSThread()
wsthread.start()

game = Game(4)
IOUtil.defaultSource = inqueue.get
IOUtil.defaultDestination = outqueue.put
IOUtil.game = game

game.main_loop()


