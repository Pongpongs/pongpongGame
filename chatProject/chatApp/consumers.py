# chatApp/consumers.py
import json
# from aredis import StrictRedis
# from channels.layers import get_channel_layer


from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):

    play_bar1_position = 0

    async def connect(self):
        # self.redis = StrictRedis(host='localhost', port=6379, db=0)
        await self.accept()

    async def disconnect(self, close_code):
        # self.redis.close()
        # await self.redis.wait_closed()
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # 클라이언트로부터 'w' 또는 's' 입력 받기
        if message == 'w':
            print("Move up")
            self.play_bar1_position += 1
            # new_position = await self.redis.incr("play_bar1_position")

            # 필요한 경우 클라이언트로 응답 보내기
            await self.send(text_data=json.dumps({
                'message': 'Moving up',
                'position': self.play_bar1_position
            }))
        elif message == 's':
            print("Move down")
            self.play_bar1_position -= 1
            # new_position = await self.redis.incr("play_bar1_position")
            # 필요한 경우 클라이언트로 응답 보내기
            await self.send(text_data=json.dumps({
                'message': 'Moving down',
                'position' : self.play_bar1_position
            }))
        # text_data_json = json.loads(text_data)
        # message = text_data_json['message']

        # print(f"Received key press: {message}")
