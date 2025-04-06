import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function JoinLobby() {
  const [lobbyCode, setLobbyCode] = useState("");
  const navigate = useNavigate();

  const handleJoinLobby = () => {
    navigate(`/lobby/${lobbyCode}`);
  };

  return (
    <div>
      <h1>Join an Existing Lobby</h1>
      <input
        type="text"
        value={lobbyCode}
        onChange={(e) => setLobbyCode(e.target.value)}
        placeholder="Enter Lobby Code"
      />
      <button onClick={handleJoinLobby}>Join Lobby</button>
    </div>
  );
}

export default JoinLobby;
