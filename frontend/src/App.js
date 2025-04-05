// import { useEffect, useState } from "react";

// function App() {
//   const [message, setMessage] = useState("");

//   const base_URL = "https://hackku2025.onrender.com"; // or "http://localhost:8000" for local dev

//   useEffect(() => {
//     fetch(`${base_URL}/api/hello`)
//       .then((res) => res.json())
//       .then((data) => {
//         console.log("API response:", data); // for debugging
//         setMessage(data.message || data); // support both { message: "..." } and plain string
//       })
//       .catch((err) => console.error("Fetch error:", err));
//   }, []);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded shadow text-center">
//         <h1 className="text-2xl font-bold text-blue-600">React + FastAPI</h1>
//         <p className="mt-4 text-gray-700">{message || "Loading..."}</p>
//       </div>
//     </div>
//   );
// }

// export default App;

import React, { useState } from "react";

function App() {
  const [username, setUsername] = useState(""); // For storing user input
  const [quantity, setQuantity] = useState(""); // For storing user input
  const [message, setMessage] = useState(""); // For storing API response

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
    setMessage(data.message); // Set the message returned from FastAPI
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold text-blue-600">React + FastAPI</h1>

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

        <p className="mt-4 text-gray-700">{message || "Loading..."}</p>
      </div>
    </div>
  );
}

export default App;
