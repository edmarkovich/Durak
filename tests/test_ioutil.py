import unittest
from ioutil import IOUtil

class GameIOCase(unittest.TestCase):

    def test_io_get_input(self):
        def json_string():
            return '{"a":"b", "c":"d"}'

        out = IOUtil.get_input(json_string)
        self.assertEqual(out["a"], "b")      