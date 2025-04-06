import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function HostLobby() {
  const navigate                     = useNavigate();
  const {lobby_code}                  = useParams();
  const [name, setName]              = useState("");
  const [username, setUsername]      = useState("");
  const [list_author, setListAuthor] = useState("");
  const [list_name, setListName]     = useState("");
  const [quantity, setQuantity]      = useState("");

  const handleNameInputChange = (e) => {
    setName(e.target.value);
  };

  const handleUsernameInputChange = (e) => {
    setUsername(e.target.value);
  };

  const handleListAuthorInputChange = (e) => {
    setListAuthor(e.target.value);
  };

  const handleListNameInputChange = (e) => {
    setListName(e.target.value);
  };

  const handleQuantityInputChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleSubmit = async (e) => {
    //e.preventDefault();

    const response = await fetch("https://hackku2025.onrender.com/api/startlobby", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lobby_code  : lobby_code,
        name        : name,
        username    : username,
        list_author : list_author,
        list_name   : list_name,
        quantity    : quantity
      }),
    });

    // const data = await response.json();
    // console.log("Received data:", data);
    // setQuestions(data.questions);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Hosting Lobby: {lobby_code}</h1>

        <form onSubmit={handleSubmit}>
            <p>Enter your name</p>
            <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={handleNameInputChange}
            className="border p-2 rounded mb-4 w-full"
            />
            <br></br>
            <p>Enter your Letterboxd username</p>
            <input
            type="text"
            placeholder="Letterboxd username"
            value={username}
            onChange={handleUsernameInputChange}
            className="border p-2 rounded mb-4 w-full"
            />
            <br></br>
            <p>Enter a Letterboxd list filter (optional)</p>
            <input
            type="text"
            placeholder="List author"
            value={list_author}
            onChange={handleListAuthorInputChange}
            className="border p-2 rounded mb-4 w-full"
            />
            <input
            type="text"
            placeholder="List name"
            value={list_name}
            onChange={handleListNameInputChange}
            className="border p-2 rounded mb-4 w-full"
            />
            <br></br>
            <p>How many questions do you want to play with?</p>
            <input
            type="number"
            placeholder="Number of questions"
            value={quantity}
            onChange={handleQuantityInputChange}
            className="border p-2 rounded mb-4 w-full"
            />
            <br></br>
            <br></br>
            <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded w-full"
            >
            Submit
            </button>
        </form>
    </div>
  );
}

export default HostLobby;
