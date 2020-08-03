#https://websockets.readthedocs.io/en/stable/intro.html


import asyncio
import websockets
import json

from server.game import Game
from server.ioutil import IOUtil


x=0
async def inp():
    global x
    while True:
        if x==1:
            print("YESS!")
            x=0
        print("Ran")
        await asyncio.sleep(1)
        print("Slept")


async def update(websocket, path):
    global x
    while True:
        await websocket.send("Hello")
        async for message in websocket:
            data = message #= json.loads(message)
            x=1
            await websocket.send("Got: "+data)            

#game = Game(4)
#IOUtil.defaultSource = foo
#IOUtil.game = game

start_server = websockets.serve(update, "192.168.0.111", 5678)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_until_complete(inp())
asyncio.get_event_loop().run_forever()
