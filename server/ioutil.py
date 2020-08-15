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
    def get_input(prompt, player = None, final_message = False):

        message = IOUtil.get_game_data()
        message['prompt'] = prompt

        IOUtil.defaultDestination(json.dumps(message))

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
