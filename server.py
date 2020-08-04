#https://websockets.readthedocs.io/en/stable/intro.html

import asyncio
import websockets
import json

import threading
import queue

from server.game import Game
from server.ioutil import IOUtil

import time

inqueue = queue.Queue()
outqueue = queue.Queue()

class WSThread(threading.Thread):
    def __init__(self):
      threading.Thread.__init__(self)
      self.websocket=None
    def run(self):
      async def update(websocket, path):
           print("Serving", websocket)
           self.websocket = websocket
           async for message in websocket:
             data = message
             inqueue.put(data)
             print("Got: ", data)
             await websocket.send("Thanks for "+data)
           print("Exited update")

      async def test():
        while True:
           await asyncio.sleep(1)
           if self.websocket:
            if not outqueue.empty():
             m = outqueue.get()
             await self.websocket.send(m)

      loop = asyncio.new_event_loop()
      asyncio.set_event_loop(loop)

      start_server = websockets.serve(update, "192.168.1.13", 5678)

      asyncio.ensure_future(start_server)
      asyncio.ensure_future(test())
      asyncio.get_event_loop().run_forever()

wsthread = WSThread()
wsthread.start()

game = Game(4)
IOUtil.defaultSource = inqueue.get
IOUtil.defaultDestination = outqueue.put
IOUtil.game = game

game.main_loop()


