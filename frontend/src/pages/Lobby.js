import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Lobby() {
  const { lobbyCode } = useParams();  // Get lobby code from URL params
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/${lobbyCode}`);
    setSocket(ws);

    ws.onopen = () => {
      console.log("Connected to the WebSocket");
      ws.send(JSON.stringify({ type: "join", username: username }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.question) {
        setQuestion(data.question);  // Receive and set the question
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket");
    };

    return () => {
      ws.close();
    };
  }, [lobbyCode, username]);

  const handleAnswerSubmit = () => {
    if (socket) {
      socket.send(JSON.stringify({ type: "answer", answer: answer }));
      setAnswer("");  // Reset answer input
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  return (
    <div>
      <h1>Lobby Code: {lobbyCode}</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={handleUsernameChange}
      />
      <div>
        {question ? (
          <div>
            <h2>{question.question}</h2>
            {question.options.map((option, index) => (
              <button key={index} onClick={() => setAnswer(option)}>
                {option}
              </button>
            ))}
            <button onClick={handleAnswerSubmit}>Submit Answer</button>
          </div>
        ) : (
          <p>Waiting for the question...</p>
        )}
      </div>
    </div>
  );
}

export default Lobby;
