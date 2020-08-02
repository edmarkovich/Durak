from game import Game
from ioutil import IOUtil
from console import Console

def print_state_and_input():
    return input()

IOUtil.defaultSource = print_state_and_input

game = Game(4)
game.main_loop()

print(Console.getInstance().lines)