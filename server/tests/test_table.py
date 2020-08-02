import unittest
from table import Table
from card import Card
from player import Player

class TableTestCase(unittest.TestCase):

    def test_table_init(self):
        table = Table('♠')
        self.assertFalse(table.pile)
        self.assertEqual(table.trump, '♠')
        self.assertEqual(table.attack_cards, 0)
        
    def test_table_attack(self):
        table = Table('♠')
        c1 = Card('♠', '8')
        c2 = Card('♠', '9')
        c3 = Card('♦', '8')
        c4 = Card('♦', '10')

        player = Player([c1,c2,c3])

        player2 = Player([Card('♠', '10')])
        
        self.assertTrue(table.attack(c1, player))
        self.assertEqual(len(table.pile), 1)
        self.assertEqual(len(player.hand), 2)
        self.assertEqual(table.attack_cards, 1)
        table.defend(Card('♠', '10'), player2)
        self.assertEqual(table.attack_cards, 1)
        
        self.assertFalse(table.attack(c2, player))
        self.assertEqual(len(table.pile), 2)
        self.assertEqual(len(player.hand), 2)
        self.assertEqual(table.attack_cards, 1) 

        self.assertTrue(table.attack(c3, player))
        self.assertEqual(len(table.pile), 3)
        self.assertEqual(len(player.hand), 1)
        self.assertEqual(table.attack_cards, 2)

        #with self.assertRaises(Exception) as context:
        #    table.attack(c4, player)
        #self.assertTrue((str(context.exception)).startswith("Attack in progress"))
        #self.assertEqual(len(table.pile), 3)
        #self.assertEqual(len(player.hand), 1)      

    def test_table_defend(self):
        table = Table('♠')
        player1 = Player([Card('♠', '8')])
        table.attack(Card('♠', '8'), player1)

        player2 = Player([Card('♠', '7'), Card('♠', '9')])

        self.assertFalse(table.defend(Card('♠', '7'), player2))
        self.assertEqual(len(table.pile), 1)

        self.assertTrue(table.defend(Card('♠', '9'), player2))
        self.assertEqual(len(table.pile), 2)  

        with self.assertRaises(Exception) as context:
            table.defend(Card('♠', '10'), player2)
        self.assertTrue((str(context.exception)).startswith("No attack in progress"))

    def test_table_take_pile(self):
        table = Table('♠')

        player1 = Player([Card('♠', '8'), Card('♦', '8')])
        player2 = Player([Card('♠', '9'), Card('♠', 'A')])
        
        with self.assertRaises(Exception) as context:
            table.take_pile(player2)
        self.assertTrue((str(context.exception)).startswith("Nothing on the table"))
        

        
        table.attack(Card('♠', '8'), player1)
        table.defend(Card('♠', '9'), player2)
        table.attack(Card('♦', '8'), player1)

        table.take_pile(player2)
        self.assertEqual(len(player2.hand), 4)

