// src/pages/UsernameTrivia.js
import React, { useState } from "react";

function UsernameTrivia() {
  const [username, setUsername] = useState("");
  const [quantity, setQuantity] = useState("");
  const [questions, setQuestions] = useState([]);

  const handleUsernameInputChange = (e) => {
    setUsername(e.target.value);
  };

  const handleQuantityInputChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("https://hackku2025.onrender.com/api/username", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        quantity: quantity,
      }),
    });

    const data = await response.json();
    console.log("Received data:", data);
    setQuestions(data.questions);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow text-center max-w-2xl">
        <h1 className="text-2xl font-bold text-blue-600">cineME film trivia</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your Letterboxd username"
            value={username}
            onChange={handleUsernameInputChange}
            className="border p-2 rounded mb-4 w-full"
          />
          <input
            type="number"
            placeholder="How many questions do you want?"
            value={quantity}
            onChange={handleQuantityInputChange}
            className="border p-2 rounded mb-4 w-full"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded w-full"
          >
            Submit
          </button>
        </form>

        <div className="mt-4">
          {Array.isArray(questions) && questions.length > 0 ? (
            questions.map(([movie, question, o1, o2, o3, o4, answer, category], index) => (
              <div key={index} className="border p-4 mb-4 rounded shadow">
                <h3 className="text-xl font-bold text-blue-500">{movie}</h3>
                <p className="mt-2">{question}</p>
                <ol className="list-decimal list-inside mt-2 text-left">
                  <li>{o1}</li>
                  <li>{o2}</li>
                  <li>{o3}</li>
                  <li>{o4}</li>
                </ol>
                <p className="mt-2">Correct answer: {answer}</p>
                <p className="text-gray-500 text-sm">Category: {category}</p>
              </div>
            ))
          ) : (
            <p>No questions yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UsernameTrivia;