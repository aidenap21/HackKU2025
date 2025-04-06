from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from user_movie_list import *
from list_movie_list import *
from total_movie_list import *
from trivia_questions import *
from typing import List
import random
import asyncio
import json

app = FastAPI()

lobbies: dict[str, List[WebSocket]] = {}
questions: dict[str, List[tuple]] = {}
names: dict[str, List[str]] = {}
usernames: dict[str, List[str]] = {}
scores: dict [str, List[int]] = {}

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


@app.post("/api/join_lobby")
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
    data = await websocket.receive_json()

    if lobby_code not in lobbies:
        lobbies[lobby_code] = []
        names[lobby_code] = []
        usernames[lobby_code] = []
        scores[lobby_code] = []

    if websocket not in lobbies[lobby_code]:
        lobbies[lobby_code].append(websocket)
        names[lobby_code].append(data['name'])
        usernames[lobby_code].append(data['username'])
        scores[lobby_code].append(0)

    await broadcast_player_count(lobby_code)
    
    trivia = TriviaQuestions()

    try:
        while True:
            try:
                data = await websocket.receive_json()

                # Called by host to start game
                if data["type"] == "start_game":
                    print("Starting game")
                    user_objs = []
                    for username in usernames[lobby_code]:
                        user_obj = UserMovieList(username=username)
                        user_objs.append(user_obj)

                    list_obj = ListMovieList(list_author=data['list_author'], list_name=data['list_name'])

                    total_obj = TotalMovieList(user_movie_lists=user_objs, list_movie_list=list_obj)
                    movie_list = total_obj.reduce_movies(int(data['quantity']))

                    questions[lobby_code] = trivia.retrieve_questions(movie_list)

                    # Send first question to all clients
                    for conn in lobbies[lobby_code]:

                        await conn.send_json({
                            "type": "question",
                            "movie": questions[lobby_code][0][0],
                            "question": questions[lobby_code][0][1],
                            "option_1": questions[lobby_code][0][2],
                            "option_2": questions[lobby_code][0][3],
                            "option_3": questions[lobby_code][0][4],
                            "option_4": questions[lobby_code][0][5],
                            "total_questions": len(questions[lobby_code])
                        })

                # Client requests next question
                elif data["type"] == "question":
                    if int(data['current_question']) >= len(questions[lobby_code]):
                        print("Invalid question number")
                        await websocket.send_json({
                            "type": "error",
                            "response": "Current question exceed number of questions"
                        })

                    else:
                        print("Sending next question")
                        await websocket.send_json({
                            "type": "question",
                            "movie": questions[lobby_code][int(data["current_question"])][0],
                            "question": questions[lobby_code][int(data["current_question"])][1],
                            "option_1": questions[lobby_code][int(data["current_question"])][2],
                            "option_2": questions[lobby_code][int(data["current_question"])][3],
                            "option_3": questions[lobby_code][int(data["current_question"])][4],
                            "option_4": questions[lobby_code][int(data["current_question"])][5],
                            "total_questions": len(questions[lobby_code])
                        })

                # Client requests answer check
                elif data["type"] == "answer":
                    if int(data["answer"]) == questions[lobby_code][int(data["current_question"])][6]:
                        print("Correct answer")
                        scores[lobby_code][names[lobby_code].index[data['name']]] += 1

                        await websocket.send_json({
                            "type": "answer",
                            "outcome": "correct",
                            "correct_answer": questions[lobby_code][int(data["current_question"])][1 + questions[lobby_code][int(data["current_question"])][6]]
                        })
                    else:
                        print("Incorrect answer")
                        await websocket.send_json({
                            "type": "answer",
                            "outcome": "incorrect",
                            "correct_answer": questions[lobby_code][int(data["current_question"])][1 + questions[lobby_code][int(data["current_question"])][6]]
                        })

                # Client sends verification
                elif data["type"] == "verify":
                    print("Updating verification")
                    trivia.verify_question(
                        movie=questions[lobby_code][int(data["current_question"])][0],
                        question=questions[lobby_code][int(data["current_question"])][1],
                        verify=int(data["verify"])
                    )

            except WebSocketDisconnect:
                print(f"Client disconnected from {lobby_code}")
                break

            except Exception as e:
                print(f"Error in message loop for {lobby_code}: {e}")
                break

    except WebSocketDisconnect:
        lobbies[lobby_code].remove(websocket)
        await broadcast_player_count(lobby_code)

        # Cleanup if lobby is empty
        if len(lobbies[lobby_code]) == 0:
            del lobbies[lobby_code]
            del questions[lobby_code]
            del names[lobby_code]
            del usernames[lobby_code]
            del scores[lobby_code]

async def broadcast_player_count(lobby_code: str):
    player_count = len(lobbies[lobby_code])
    for conn in lobbies[lobby_code]:
        await conn.send_json({"type": "player_count", "count": player_count})


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