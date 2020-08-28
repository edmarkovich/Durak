import json
from .card import Card
import time

class RestartException(Exception):
    pass

class IOUtil:

    def __init__(self, source, destination, game):
        self.defaultSource      = source
        self.defaultDestination = destination
        self.game = game

    def get_game_data(self):
        if self.game:
            g = self.game.json()
            if g:
                 return {'game': g}
        return {}

    def send_updated_game_state(self, prompt = None):
        message = self.get_game_data()
        if prompt:
            message['prompt'] = prompt
        self.defaultDestination(json.dumps(message))

    def get_input(self, prompt, player = None, final_message = False):

        self.send_updated_game_state(prompt)

        if final_message:
            inputA = "Die"
        else:
            source = self.defaultSource
            inputA = source()

        if inputA == "Die":
            print("Restarting in 1 second")
            time.sleep(1)
            raise RestartException("Time to Die")

        input = inputA # json.loads(inputA)

        if "card" in input:
            input["card"] = Card.from_string(input["card"])

        return input
