
class Console:
    __instance = None

    @staticmethod
    def getInstance():
        if Console.__instance == None:
            Console()
        return Console.__instance

    def __init__(self):
        if Console.__instance:
            raise Exception("Second instantiation")

        self.lines=[]
        Console.__instance = self

    def add(self,line):
        self.lines.append(line)

    def destroy(self): #for unit tests
        Console.__instance = None
    
