import json
from .card import Card

class RestartException(Exception):
    pass

class IOUtil:

    defaultSource      = lambda: '{}'
    defaultDestination = lambda x: print("defaultDestination", x)
    game = None

    @staticmethod
    def get_game_data():
        if IOUtil.game:
            g = IOUtil.game.json()
            if g:
                 return {'game': g}
        return {}

    @staticmethod
    def send_game_state():
        IOUtil.defaultDestination(json.dumps(IOUtil.get_game_data()))

    @staticmethod
    def get_input(prompt, player = None):

        IOUtil.send_game_state()

        message = {} #IOUtil.get_game_data()
        message['prompt'] = prompt

        IOUtil.defaultDestination(json.dumps(message))

        source = IOUtil.defaultSource
        inputA = source()

        if inputA == "Die":
            raise RestartException("Time to Die")

        input = json.loads(inputA)

        if "card" in input:
            input["card"] = Card.from_string(input["card"])

        return input
