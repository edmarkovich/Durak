import json
from .card import Card

class IOUtil:

    defaultSource      = lambda: '{}'
    defaultDestination = lambda x: '{}'
    game = None

    @staticmethod
    def get_input(prompt = None, player = None):

        if IOUtil.game:
            IOUtil.defaultDestination(json.dumps(IOUtil.game.json()))

        if prompt:
            prompt = prompt+"["+str(player)+"] => "
            IOUtil.defaultDestination(prompt)

        source = IOUtil.defaultSource

        inputA = source()
        input = json.loads(inputA)

        if "card" in input:
            input["card"] = Card.from_string(input["card"])

        return input
