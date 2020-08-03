#https://websockets.readthedocs.io/en/stable/intro.html


import asyncio
import websockets
import json

async def update(websocket, path):
    print("Path: ", path)
    while True:
        await websocket.send("Hello")
        async for message in websocket:
            data = json.loads(message)
            await websocket.send("Got: "+data)            

start_server = websockets.serve(update, "192.168.0.111", 5678)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
