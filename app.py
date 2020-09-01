from flask import Flask, redirect
from serv import WSThread

app = Flask(__name__, static_folder='client')

@app.route('/')
def client():
    return redirect("/client/index.html")

wsthread = WSThread()
wsthread.start()