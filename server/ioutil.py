import json
from .card import Card

class IOUtil:

    defaultSource      = lambda: '{}'
    defaultDestination = lambda x: '{}'
    game = None

    @staticmethod
    def get_input(prompt, player = None):

        message ={
            'prompt' : prompt
        }

        if IOUtil.game:
            g = IOUtil.game.json()
            if g: message['game'] = g


        IOUtil.defaultDestination(json.dumps(message))


        source = IOUtil.defaultSource
        inputA = source()

        if inputA == "Die":
            raise Exception("Time to Die")

        input = json.loads(inputA)

        if "card" in input:
            input["card"] = Card.from_string(input["card"])

        return input
