import json
from .card import Card

class IOUtil:

    defaultSource      = lambda: '{}'
    defaultDestination = lambda x: '{}'
    game = None

    @staticmethod
    def get_input(prompt = None, player = None):

        if IOUtil.game:
            js = IOUtil.game.json()
            if js: IOUtil.defaultDestination(json.dumps(js))

        if prompt:
            #prompt = prompt+"["+str(player)+"] => "
            IOUtil.defaultDestination(json.dumps(prompt))

        source = IOUtil.defaultSource

        inputA = source()
        input = json.loads(inputA)

        if "card" in input:
            input["card"] = Card.from_string(input["card"])

        return input
