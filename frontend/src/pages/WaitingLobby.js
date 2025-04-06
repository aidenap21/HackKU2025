import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

function JoinLobby() {
  const navigate = useNavigate();
  const {lobby_code} = useParams();
  const location = useLocation();
  const { name } = location.state || {};

  const [player_count, setPlayerCount] = useState(1); // Include host by default

  useEffect(() => {
    const socket = new WebSocket(`wss://hackku2025.onrender.com/ws/${lobby_code}`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "player_count") {
        setPlayerCount(data.count);
      }
      if (data.type === "start_game") {
        navigate(`question/${lobby_code}`, {
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

    return () => {
      socket.close();
    };
  }, [lobby_code]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Waiting for host to start {lobby_code} lobby</h1>
        <h2 className="text-3xl font-bold mb-6">There are {player_count} players connected</h2>
    </div>
  );
}

export default JoinLobby;