import unittest
from server.ioutil import IOUtil
from server.card import Card

class GameIOCase(unittest.TestCase):

    def test_io_get_input(self):
        def json_string():
            return '{"a":"b", "c":"d"}'

        IOUtil.defaultSource = json_string
        out = IOUtil.get_input({"player":"ed"})
        self.assertEqual(out["a"], "b")      

    def test_io_get_input_card(self):
        def json_string():
            return '{"card":"♠A"}'

        IOUtil.defaultSource = json_string
        out = IOUtil.get_input("hello")
        self.assertEqual(out["card"], Card("♠","A"))         
