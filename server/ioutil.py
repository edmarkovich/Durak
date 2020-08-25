import json
from .card import Card
import time

class RestartException(Exception):
    pass

class IOUtil:

    defaultSource      = lambda: '{}'
    defaultDestination = lambda x: {}
    game = None

    @staticmethod
    def get_game_data():
        if IOUtil.game:
            g = IOUtil.game.json()
            if g:
                 return {'game': g}
        return {}

    @staticmethod
    def notify(text):
        IOUtil.defaultDestination(json.dumps({"notify":text}))

    @staticmethod
    def send_updated_game_state(prompt = None):
        message = IOUtil.get_game_data()
        if prompt:
            message['prompt'] = prompt
        IOUtil.defaultDestination(json.dumps(message))

    @staticmethod
    def get_input(prompt, player = None, final_message = False):

        IOUtil.send_updated_game_state(prompt)

        if final_message:
            inputA = "Die"
        else:
            source = IOUtil.defaultSource
            inputA = source()

        if inputA == "Die":
            print("Restarting in 1 second")
            time.sleep(1)
            raise RestartException("Time to Die")

        input = json.loads(inputA)

        if "card" in input:
            input["card"] = Card.from_string(input["card"])

        return input
