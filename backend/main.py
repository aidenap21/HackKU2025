from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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

@app.get("api/username")
def read_username(user_input: UserInput):
    return {"message": f"The username received is {user_input}"}