import React, { useState } from "react";

function App() {
  const [username, setUsername] = useState(""); // For storing user input
  const [quantity, setQuantity] = useState(""); // For storing user input
  const [questions, setQuestions] = useState([]); // For storing API response

  const handleUsernameInputChange = (e) => {
    setUsername(e.target.value); // Update name with user input
  };

  const handleQuantityInputChange = (e) => {
    setQuantity(e.target.value); // Update name with user input
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Sending the user input to FastAPI via POST request
    const response = await fetch("https://hackku2025.onrender.com/api/username", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,  // Send the username to the backend
        quantity: quantity,  // Send the quantity to the backend
      }),
    });

    const data = await response.json();
    console.log("Received data:", data); 
    setQuestions(data.questions); // Set the message returned from FastAPI
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold text-blue-600">cineME film trivia</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your Letterboxd username"
            value={username}
            onChange={handleUsernameInputChange}
            className="border p-2 rounded mb-4"
          />
          <input
            type="number"
            placeholder="How many questions do you want?"
            value={quantity}
            onChange={handleQuantityInputChange}
            className="border p-2 rounded mb-4"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded"
          >
            Submit
          </button>
        </form>

        <div className="mt-4">
          {/* Render each question in a box */}
          {Array.isArray(questions) && questions.length > 0 ? (
            questions.map(([movie, question, o1, o2, o3, o4, answer, category], index) => (
              <div key={index} className="border p-4 mb-4 rounded shadow">
                <h3 className="text-xl font-bold text-blue-500">{movie}</h3>
                <p className="mt-2">{question}</p>
                <ul className="mt-2">
                  <ol>
                    <li>{o1}</li>
                    <li>{o2}</li>
                    <li>{o3}</li>
                    <li>{o4}</li>
                  </ol>
                </ul>
                <p className="mt-2">Correct answer: {answer}</p>
                <p className="text-gray-500 text-sm">Category: {category}</p>
              </div>
            ))
          ) : (
            <p>Loading questions...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
