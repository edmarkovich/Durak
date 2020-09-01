from flask import Flask, redirect
app = Flask(__name__, static_folder='client')

@app.route('/')
def client():
    return redirect("/client/index.html")