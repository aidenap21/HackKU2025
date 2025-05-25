import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function HostLobby() {
  const navigate = useNavigate();
  const { lobby_code } = useParams();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [list_author, setListAuthor] = useState("");
  const [list_name, setListName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [player_count, setPlayerCount] = useState(1); // Include host by default
  const [socket, setSocket] = useState(null); // State for WebSocket connection

  useEffect(() => {
    const newSocket = new WebSocket(`wss://${process.env.REACT_APP_BACKEND_URL_LOCAL}/ws/${lobby_code}`);

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "player_count") {
        setPlayerCount(data.count);
      }

      // Handle the first question message when host starts the game
      if (data.type === "question") {
        navigate(`/question/${lobby_code}`, {
          state: {
            name: name,
            question_number: 0,
            movie: data.movie,
            question: data.question,
            option_1: data.option_1,
            option_2: data.option_2,
            option_3: data.option_3,
            option_4: data.option_4,
            total_questions: data.total_questions
          }
        });
      }
    };

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [lobby_code, name, navigate]);

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

  const handleStartGame = (e) => {
    e.preventDefault();
    console.log("Game starting...")
    if (socket) {
      socket.send(JSON.stringify({
        type: "start_game", // Indicating that the host wants to start the game
        lobby_code: lobby_code,
        name: name,
        username: username,
        list_author: list_author,
        list_name: list_name,
        quantity: quantity
      }));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Hosting Lobby: {lobby_code}</h1>
      <h2 className="text-3xl font-bold mb-6">There are {player_count} players connected</h2>

      <form onSubmit={handleStartGame}>
        <p>Enter your name</p>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={handleNameInputChange}
          className="border p-2 rounded mb-4 w-full"
        />
        <br />
        <p>Enter your Letterboxd username</p>
        <input
          type="text"
          placeholder="Letterboxd username"
          value={username}
          onChange={handleUsernameInputChange}
          className="border p-2 rounded mb-4 w-full"
        />
        <br />
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
        <br />
        <p>How many questions do you want to play with?</p>
        <input
          type="number"
          placeholder="Number of questions"
          value={quantity}
          onChange={handleQuantityInputChange}
          className="border p-2 rounded mb-4 w-full"
        />
        <br />
        <br />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded w-full"
        >
          Start Game
        </button>
      </form>
    </div>
  );
}

export default HostLobby;
