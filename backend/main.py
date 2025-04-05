from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from user_movie_list import *
from trivia_questions import *

app = FastAPI()

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
    username: str
    quantity: str

@app.get("/api/hello")
def read_root():
    return {"message": "Hello from FastAPI!"}

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
    return {"questions": f"{questions_list}"}