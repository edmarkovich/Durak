import unittest
from ioutil import IOUtil
from card import Card

class GameIOCase(unittest.TestCase):

    def test_io_get_input(self):
        def json_string():
            return '{"a":"b", "c":"d"}'

        out = IOUtil.get_input(json_string)
        self.assertEqual(out["a"], "b")      

    def test_io_get_input_card(self):
        def json_string():
            return '{"card":"♠A"}'

        out = IOUtil.get_input(json_string)
        self.assertEqual(out["card"], Card("♠","A"))         