import json


class IOUtil:

    @staticmethod
    def prompt():
        print("Input: ")
        txt = input("[[[[[[]]]]]]]]]]] ==> ")
        return txt

    @staticmethod
    def get_input(source = prompt, player = None):

        input = source()
        return json.loads(input)
