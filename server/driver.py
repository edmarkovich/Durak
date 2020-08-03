from .game import Game
from .ioutil import IOUtil
from .console import Console

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
    #Ed doesn't need to pass - round over after 6 attacks

    '{"action":"attack", "card":"♥9"}',   #Conway attacks Ed
    '{"action":"defend", "card":"♥10"}',  #Ed defends
    '{"action":"pass"}',                  #Conway doesn't want to add more
    '{"action":"pass"}',                  #Mike doesn't want to add more
    '{"action":"pass"}',                  #Jon doesn't want to add more

    '{"action":"attack", "card":"♣9"}',   #Ed attacks Mike
    '{"action":"defend", "card":"♣Q"}',   #Mike defends
    '{"action":"add", "card":"♦9"}',      #Ed tosses one more
    '{"action":"take"}',                  #Mike takes
    '{"action":"pass"}',                  #Ed doesn't want to add more
    '{"action":"pass"}',                  #Jon doesn't want to add more
    '{"action":"pass"}',                  #Conway doesn't want to add more

    '{"action":"attack", "card":"♣6"}',   #Jon attacks Conway
    '{"action":"defend", "card":"♣10"}',  #Conway defends
    '{"action":"add",    "card":"♦6"}',   #Jon tosses one more
    '{"action":"defend", "card":"♦Q"}',   #Conway defends
    '{"action":"add",    "card":"♥6"}',   #Jon tosses one more
    '{"action":"defend", "card":"♠6"}',   #Conway defends (uses trump)
    '{"action":"pass"}',                  #Jon doesn't want to add more
    '{"action":"add",    "card":"♦10"}',  #Ed tosses one more
    '{"action":"defend", "card":"♦K"}',   #Conway defends
    '{"action":"add",    "card":"♥K"}',   #Ed tosses one more
    '{"action":"take"}',                  #Conway takes
    '{"action":"add",    "card":"♣K"}',   #Ed tosses one more  
    #Ed doesn't need to pass - round over after 6 attacks 
    
    '{"action":"attack", "card":"♠8"}',   #Ed attacks Mike
    '{"action":"take"}',                  #Mike takes
    '{"action":"pass"}',                  #Ed doesn't want to add more
    '{"action":"attack", "card":"♣8"}',   #Jon tosses in one more
    '{"action":"pass"}',                  #Jon doesn't want to add more
    '{"action":"pass"}',                  #Conway doesn't want to add more

    '{"action":"attack", "card":"♣A"}',   #Jon attacks Conway
    '{"action":"defend", "card":"♠6"}',   #Conway defends
    '{"action":"pass"}',                  #Jon doesn't want to add more
    '{"action":"pass"}',                  #Ed doesn't want to add more
    '{"action":"add",    "card":"♥A"}',   #Mike tosses one more
    '{"action":"defend", "card":"♠Q"}',   #Conway defends
    '{"action":"pass"}',                  #Mike doesn't want to add more
    '{"action":"pass"}',                  #Jon doesn't want to add more
    '{"action":"add",    "card":"♠A"}',   #Ed tosses one more
    '{"action":"take"}',                  #Conway takes
    '{"action":"pass"}',                  #Ed doesn't want to add more
    '{"action":"pass"}',                  #Mike doesn't want to add more
    '{"action":"pass"}',                  #Jon doesn't want to add more

    '{"action":"attack", "card":"♠9"}',   #Ed attacks Mike
    '{"action":"take"}',                  #Mike takes    
    '{"action":"pass"}',                  #Ed doesn't want to add more    
    '{"action":"pass"}',                  #Jon doesn't want to add more    
    '{"action":"pass"}',                  #Conway doesn't want to add more

    '{"action":"attack", "card":"♣7"}',   #Jon attacks Conway
    '{"action":"defend", "card":"♣10"}',  #Conway defends    
    '{"action":"add",    "card":"♦7"}',   #Jon tosses one more
    '{"action":"defend", "card":"♦K"}',   #Conway defends    
    '{"action":"add",    "card":"♥7"}',   #Jon tosses one more
    '{"action":"defend", "card":"♥K"}',   #Conway defends      
    '{"action":"pass"}',                  #Jon doesn't want to add more    
    '{"action":"add",    "card":"♠10"}',  #Ed tosses one more
    '{"action":"defend", "card":"♠Q"}',   #Conway defends    
    '{"action":"add",    "card":"♠K"}',   #Ed tosses one more    
    '{"action":"defend", "card":"♠A"}',   #Conway defends  
    #Ed is out of the game at this point, no need to pass - note: out on offence
    '{"action":"add",    "card":"♥Q"}',   #Mike tosses one more   
    '{"action":"defend", "card":"♥A"}',   #Conway defends  
    #Round over at 6 attacks, no need to pass

    '{"action":"attack", "card":"♥6"}',   #Conway attacks Mike (since Ed's out)
    '{"action":"defend", "card":"♥J"}',   #Mike defends 
    '{"action":"pass"}',                  #Conway doesn't want to add more  
    '{"action":"pass"}',                  #Jon doesn't want to add more (doesn't ask Ed)

    '{"action":"attack", "card":"♣9"}',   #Mike attacks Jon
    '{"action":"defend", "card":"♠7"}',   #Jon defends 
    '{"action":"pass"}',                  #Mike
    '{"action":"pass"}',                  #Conway

    '{"action":"attack", "card":"♦J"}',   #Jon attacks Conway
    '{"action":"defend", "card":"♦Q"}',   #Conway defends
    '{"action":"pass"}',                  #Jon
    '{"action":"pass"}',                  #Mike

    '{"action":"attack", "card":"♣6"}',   #Conway attacks Mike
    '{"action":"defend", "card":"♣Q"}',   #Mike defends
    '{"action":"pass"}',                  #Conway
    '{"action":"pass"}',                  #Jon

    '{"action":"attack", "card":"♣8"}',   #Mike attacks Jon
    '{"action":"defend", "card":"♣J"}',   #Jon defends    
    '{"action":"add", "card":"♦8"}',      #Mike adds
    '{"action":"defend", "card":"♠J"}',   #Jon defends  
    #Round is over. Jon is out on defence  

    '{"action":"attack", "card":"♦6"}',   #Conway attacks Mike
    '{"action":"defend", "card":"♦9"}',   #Mike defends
    '{"action":"add", "card":"♠6"}',      #Conway adds
    '{"action":"defend", "card":"♠9"}',   #Mike defends
    '{"action":"pass"}',                  #Conway

    '{"action":"attack", "card":"♠8"}',   #Mike attacks Conway
    '{"action":"take"}',                  #Conway takes
    '{"action":"attack", "card":"♥8"}',   #Mike adds

    #TODO: test case where both finish at once
]

game = Game(4)
IOUtil.defaultSource = print_state_and_input
IOUtil.game = game

game.main_loop()

#print(Console.getInstance().lines)
