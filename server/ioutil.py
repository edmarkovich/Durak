import json
from .card import Card

class IOUtil:

    defaultSource      = lambda: '{}'
    defaultDestination = lambda x: '{}'
    game = None

    @staticmethod
    def get_input(prompt = None, player = None):

        if IOUtil.game:
            print(IOUtil.game)

        if prompt:
            prompt = prompt+"["+str(player)+"] => " 
            print(prompt,end='')
            IOUtil.defaultDestination(prompt)
        
        source = IOUtil.defaultSource

        inputA = source()
        input = json.loads(inputA)
        IOUtil.defaultDestination(inputA)

        if "card" in input:
            input["card"] = Card.from_string(input["card"])

        return input
