from game import Game
from ioutil import IOUtil
from console import Console

def print_state_and_input():
    print_state_and_input.next = print_state_and_input.next + 1
    next = print_state_and_input.inputs[print_state_and_input.next]
    print(next)
    print("")
    return next
    
print_state_and_input.next = -1
print_state_and_input.inputs = [
    '{"action":"join", "name":"Ed"}',
    '{"action":"join", "name":"Mike"}',
    '{"action":"join", "name":"Jon"}',
    '{"action":"join", "name":"Conway"}',

    '{"action":"attack", "card":"♦9"}',   #Conway attacks Ed
    '{"action":"defend", "card":"♦10"}',  #Ed Defends
    '{"action":"add", "card":"♠9"}',      #Conway adds
    '{"action":"take"}',                  #Ed takes
    '{"action":"add", "card":"♥10"}',     #Conway tosses one more
    '{"action":"pass"}',                  #Conway doesn't want to add more
    '{"action":"pass"}',                  #Mike doesn't want to add more
    '{"action":"pass"}',                  #Jon doesn't want to add more

    '{"action":"attack", "card":"♦6"}',   #Mike attacks Jon
    '{"action":"defend", "card":"♠7"}',   #Jon defends (uses trump)
    '{"action":"add", "card":"♥7"}',      #Mike adds
    '{"action":"defend", "card":"♠J"}',   #Jon defends (uses trump)
    '{"action":"add", "card":"♦J"}',      #Mike adds
    '{"action":"take"}',                  #Jon takes
    '{"action":"pass"}',                  #Mike doesn't want to add more
    '{"action":"add", "card":"♣7"}',      #Conway tosses one more
    '{"action":"pass"}',                  #Conway doesn't want to add more
    '{"action":"add", "card":"♣6"}',      #Ed tosses one more
    '{"action":"add", "card":"♦7"}',      #Ed tosses one more
    '{"action":"pass"}',                  #Ed doesn't want to add more
    #TODO: add limit to how much can be tossed in

]

game = Game(4)
IOUtil.defaultSource = print_state_and_input
IOUtil.game = game

game.main_loop()

print(Console.getInstance().lines)