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
    name: str

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

    message = ""
    for movie, question, o1, o2, o3, o4, answer, category in questions:
        message += f"Movie: {movie}\n"
        message += f"Q: {question}\n"
        message += f"1. {o1}\n"
        message += f"2. {o2}\n"
        message += f"3. {o3}\n"
        message += f"4. {o4}\n"
        message += f"\n"

    return {"message": f"{message}"}