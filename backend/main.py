from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from user_movie_list import *
from list_movie_list import *
from trivia_questions import *
from typing import List
import random
import asyncio
import json

app = FastAPI()

lobbies = {}

# Allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # ["https://aidenap21.github.io"]  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model to define the input schema
class UserInput(BaseModel):
    username    : Optional[str] = None
    list_author : Optional[str] = None
    list_name   : Optional[str] = None
    quantity    : Optional[str] = None


@app.post("/create_lobby")
async def create_lobby():
    lobby_code = str(random.randint(1000, 9999))  # generate a 4-digit code
    lobbies[lobby_code] = {"users": [], "questions": []}
    return {"lobby_code": lobby_code}


@app.post("/join_lobby")
async def join_lobby(lobby_code: str, websocket: WebSocket):
    if lobby_code not in lobbies:
        return {"error": "Lobby not found"}
    lobbies[lobby_code]["users"].append(websocket)
    await websocket.accept()
    # You can later send questions to the user when ready
    

# WebSocket connection handler
@app.websocket("/ws/{lobby_code}")
async def websocket_endpoint(websocket: WebSocket, lobby_code: str):
    await websocket.accept()

    if lobby_code not in lobbies:
        lobbies[lobby_code] = []

    lobbies[lobby_code].append(websocket)
    
    try:
        # Send a question to the connected clients
        question = random.choice(questions)  # Pick a random question
        message = json.dumps({"question": question})
        
        for client in lobbies[lobby_code]:
            await client.send_text(message)

        # Handle incoming messages (answers or usernames)
        while True:
            data = await websocket.receive_text()
            data = json.loads(data)
            if data['type'] == "join":
                username = data['username']
                print(f"{username} has joined the lobby.")
            elif data['type'] == "answer":
                answer = data['answer']
                print(f"Answer received: {answer}")
                # Here, you can check if the answer is correct and update the score if needed

    except WebSocketDisconnect:
        print(f"A client disconnected from lobby {lobby_code}")
        lobbies[lobby_code].remove(websocket)
        if len(lobbies[lobby_code]) == 0:
            del lobbies[lobby_code]


@app.post("/api/username")
def read_username(user_input: UserInput):
    print(user_input)

    user_obj = UserMovieList(username=user_input.username)
    movie_list = user_obj.reduce_movies(int(user_input.quantity))
    trivia_obj = TriviaQuestions()
    questions = trivia_obj.retrieve_questions(movie_list)

    questions_list = []
    for question in questions:
        questions_list.append(question)

    print("Finished processing, sending to React")
    return {"questions": questions_list}


@app.post("/api/list")
def read_list(user_input: UserInput):
    print(user_input)

    list_obj = ListMovieList(list_author=user_input.list_author, list_name=user_input.list_name)
    movie_list = list_obj.reduce_movies(int(user_input.quantity))
    trivia_obj = TriviaQuestions()
    questions = trivia_obj.retrieve_questions(movie_list)

    questions_list = []
    for question in questions:
        questions_list.append(question)

    print("Finished processing, sending to React")
    return {"questions": questions_list}