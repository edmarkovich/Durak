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

      async def test():
        while True:
           await asyncio.sleep(0.1)
           if self.websocket:
            if not outqueue.empty():
             m = outqueue.get()
             print("Sending", m)
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
IOUtil.game = game
IOUtil.defaultSource = inqueue.get
IOUtil.defaultDestination = outqueue.put

game.main_loop()
