import threading
import queue
import time
class IOThread(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
    def run(self):
        while True:
            time.sleep(1)
            queue.put("Hi!!!"+str(queue.qsize()))


queue = queue.Queue(100)
iot = IOThread()
iot.start()


def get_next_message():
    data = queue.get()
    return data

while True:
    print(get_next_message())


