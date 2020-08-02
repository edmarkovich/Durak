import json
from card import Card

class IOUtil:

    defaultSource = lambda: '{}'

    @staticmethod
    def get_input(prompt = None, player = None):

        if prompt: print("XXXX",prompt,"==>")
        
        source = IOUtil.defaultSource

        input = source()
        input = json.loads(input)

        if "card" in input:
            input["card"] = Card.from_string(input["card"])

        return input
