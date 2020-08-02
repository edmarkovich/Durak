import json
from card import Card

class IOUtil:

    defaultSource = lambda: '{}'
    game = None

    @staticmethod
    def get_input(prompt = None, player = None):

        if IOUtil.game:
            print(IOUtil.game)

        if prompt: 
            print(prompt,"["+str(player)+"] => ",end='')
        
        source = IOUtil.defaultSource

        input = source()
        input = json.loads(input)

        if "card" in input:
            input["card"] = Card.from_string(input["card"])

        return input
