import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function JoinLobby() {
  const navigate                     = useNavigate();
  const [name, setName]              = useState("");
  const [username, setUsername]      = useState("");
  const [lobby_code, setLobbyCode]   = useState("");

  const handleNameInputChange = (e) => {
    setName(e.target.value);
  };

  const handleUsernameInputChange = (e) => {
    setUsername(e.target.value);
  };

  const handleLobbyCodeInputChange = (e) => {
    setLobbyCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    //e.preventDefault();

    const response = await fetch("https://hackku2025.onrender.com/api/joinlobby", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name        : name,
        username    : username,
        lobby_code  : lobby_code,
      }),
    });

    const data = await response.json();
    console.log("Received data:", data);
    navigate(`waitinglobby/${lobby_code}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Join Lobby</h1>

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
            <p>Enter lobby code</p>
            <input
            type="text"
            placeholder="Lobby code"
            value={lobby_code}
            onChange={handleLobbyCodeInputChange}
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

export default JoinLobby;