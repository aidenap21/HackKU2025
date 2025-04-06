import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";


function Question() {
  const { lobby_code } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const {
    name,
    question_number,
    movie,
    question,
    option_1,
    option_2,
    option_3,
    option_4,
    total_questions,
  } = location.state;
  
  const [selected, setSelected] = useState(null);
  const [socket, setSocket] = useState(null);
  const [options, setOptions] = useState([option_1, option_2, option_3, option_4]);
  const [player_count, setPlayerCount] = useState(1); // Include host by default

  useEffect(() => {
    const socket = new WebSocket(`wss://hackku2025.onrender.com/ws/${lobby_code}`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "player_count") {
        setPlayerCount(data.count);
      }
      if (data.type === "round_over") {
        navigate(`/incorrect/${lobby_code}`, {
            state: {
                name: name,
                question_number: question_number,
                total_questions: total_questions,
                answer: data.answer
                }
            });
        }
    if (data.type === "answer") {
        navigate(`/${data.outcome}/${lobby_code}`, {
            state: {
                name: name,
                question_number: question_number,
                total_questions: total_questions,
                answer: data.correct_answer
                }
            });
        }
    };

    return () => {
      socket.close();
    };
  }, [lobby_code]);

  const handleAnswerClick = (answer) => {
    if (!socket || selected !== null) return;

    setSelected(answer);

    // Send selected answer to backend
    socket.send(
      JSON.stringify({
        type: "answer",
        name: name,
        current_question: question_number,
        answer: answer
      })
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-2xl font-bold mb-2">{movie}</h1>
      <p className="text-xl mb-6">{question}</p>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {options.map((opt, index) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(opt)}
            className={`p-4 rounded-xl text-white font-bold transition duration-200 ${
              selected === null
                ? "bg-blue-600 hover:bg-blue-700"
                : selected === opt
                ? "bg-gray-400"
                : "bg-gray-300"
            }`}
            disabled={selected !== null}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

}

export default Question;