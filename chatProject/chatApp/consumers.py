# chatApp/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # 클라이언트로부터 'w' 또는 's' 입력 받기
        if message == 'w':
            print("Move up")
            # 필요한 경우 클라이언트로 응답 보내기
            await self.send(text_data=json.dumps({
                'message': 'Moving up'
            }))
        elif message == 's':
            print("Move down")
            # 필요한 경우 클라이언트로 응답 보내기
            await self.send(text_data=json.dumps({
                'message': 'Moving down'
            }))
        # text_data_json = json.loads(text_data)
        # message = text_data_json['message']

        # print(f"Received key press: {message}")
