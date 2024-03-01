import keyboard

class PongGame:

    # class generator
    def __init__(self):
        self._boardSize = 4;
        # generate game board with 16 * 16 size;
        # generate left paddle
        # generate right paddle
        # self.gameBoard =
        self._leftPaddle = 0.0;
        self._rightPaddle = 0.0;


        # self.ball

    # input keyboard ^, v,  for the right paddle
    # input keyboard w, s, for the left paddle
    def leftPaddle_move_up(self):
        print("left move up")
        if self._leftPaddle < self._boardSize/2:
            print("current leftpaddle location is " + str(self._leftPaddle))
            self._leftPaddle += 0.1
        else :
            print("current leftpaddle location is " + str(self._leftPaddle))
    def leftPaddle_move_down(self):
        print("left move down")
        if self._leftPaddle > -self._boardSize/2:
            self._leftPaddle -= 0.1
            print("current leftpaddle location is " + str(self._leftPaddle))
        else :
            print("current leftpaddle location is " + str(self._leftPaddle))

    def rightPaddle_move_up(self):
        print("right move up")

    def rightPaddle_move_down(self):
        print("right move down")

    def get_input(self):
        while True:
            command = input()
            if (command == 'w'):
                self.leftPaddle_move_up()
            elif (command == 's'):
                self.leftPaddle_move_down()
    # get input from user and change the value of left paddle's location, till it collides with

# gameboard's boundary

# if it gets to the boundary, it can't go farther and stops there.

# ------------------------------- #

ponggame = PongGame()
ponggame.get_input()