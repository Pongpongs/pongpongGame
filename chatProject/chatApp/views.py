from django.shortcuts import render

def index(request):
    return render(request, 'chatApp/chat.html')
