import asyncio
import websockets
import json
import os
import sys

import http.server
import socketserver

import threading
import queue

from server.game import Game
from server.ioutil import IOUtil
from server.ioutil import RestartException

import time

inqueue = queue.Queue()
outqueue = queue.Queue()

class HTTPThread(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)

    def run(self):
        class S(http.server.SimpleHTTPRequestHandler):
            def do_GET(self):
                if self.path == "/":
                    self.send_response(301)
                    self.send_header('Location','/client/client.html')
                    self.end_headers()
                return http.server.SimpleHTTPRequestHandler.do_GET(self)

        S.allow_reuse_address = True

        with socketserver.TCPServer(("", 8000), S) as httpd:
            print ("Serving HTTP")
            httpd.serve_forever()


class WSThread(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
        self.websockets=[]
        self.end_mode=False
    def run(self):
        async def inbound_messaging(websocket, path):
            if len(self.websockets) == 0:
                print("First client, restarting the game")
                inqueue.put("Die")
                self.end_mode=False
            if self.end_mode:
                print("End mode in progress")
                return

            self.websockets.append(websocket)
            async for message in websocket:
                data = message
                inqueue.put(data)
            self.websockets.remove(websocket)
            print("Disconect", len(self.websockets), "remain", websocket)
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
        print("WSThread Done")

class GameThread(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)

    def run(self):
        while True:
            try:
                game = Game(2)
                IOUtil.game = game
                IOUtil.defaultSource = inqueue.get
                IOUtil.defaultDestination = outqueue.put
                game.main_loop()
            except RestartException as e:
                print ("Restarting")


if len(sys.argv)>1 and sys.argv[1]=="http":
    httpthread = HTTPThread()
    httpthread.start()
else:
    wsthread = WSThread()
    wsthread.start()

    gamethread = GameThread()
    gamethread.start()
