from game import Game
from ioutil import IOUtil
from console import Console

def print_state_and_input():
    print_state_and_input.next = print_state_and_input.next + 1
    next = print_state_and_input.inputs[print_state_and_input.next]
    print(next)
    return next
    #return input()
print_state_and_input.next = -1
print_state_and_input.inputs = [
    '{"action":"join", "name":"Ed"}',
    '{"action":"join", "name":"Mike"}',
    '{"action":"join", "name":"Jon"}',
    '{"action":"join", "name":"Conway"}',
    '{"action":"attack", "card":"♦J"}'
]
IOUtil.defaultSource = print_state_and_input

game = Game(4)
game.main_loop()

print(Console.getInstance().lines)