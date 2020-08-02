import unittest
from console import Console

class ConsoleTestCase(unittest.TestCase):

    def tearDown(self):
        Console.getInstance().destroy()
    
    def test_console_init(self):
        console = Console()
        self.assertEqual(console.lines, [])
        
        with self.assertRaises(Exception) as context:
            console = Console()
        self.assertTrue((str(context.exception)).startswith("Second inst"))

    def test_console_instance(self):
        x = Console.getInstance()
        self.assertTrue(x)
        
        y = Console.getInstance()        
        self.assertEqual(x,y)
        
    def test_console_add(self):
        x = Console.getInstance()
        return
        x.add("One")
        
        y = Console.getInstance()
        y.add("Two")

        self.assertEqual(len(y.lines), 2)
        self.assertEqual(y.lines[-2], "One")
        
        
