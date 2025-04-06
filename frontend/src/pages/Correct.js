import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

function Correct() {
  const navigate = useNavigate();
  const { lobby_code } = useParams();
  const location = useLocation();
  
  const {
    name,
    question_number,
    total_questions,
    answer
  } = location.state;

  const [player_count, setPlayerCount] = useState(1); // Include host by default
  const [socket, setSocket] = useState(null); // State for WebSocket connection

  useEffect(() => {
    const newSocket = new WebSocket(`wss://hackku2025.onrender.com/ws/${lobby_code}`);

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
            question_number: question_number + 1,
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

  const handleContinue = (e) => {
    console.log("Continue...")
    if (socket) {
      if ((question_number + 1) >= total_questions) {
        navigate(`/`);
    }
      else {
        socket.send(JSON.stringify({
            type: "question", // Indicating that the host wants to start the game
            current_question: question_number + 1
        }));
    }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">Correct!</h1>
        <hr className="text-4xl font-bold text-blue-600 mb-6">Answer: {answer}</hr>
        <div className="flex flex-col gap-4">
            <button 
                onClick={handleContinue}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-200"
            >
                Continue
            </button>
        </div>
    </div>
);
}

export default Correct;
