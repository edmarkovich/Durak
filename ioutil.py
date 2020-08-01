import json


class IOUtil:

    @staticmethod
    def get_input(source, player = None):

        input = source()
        return json.loads(input)
