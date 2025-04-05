import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  const base_URL = "https://hackku2025.onrender.com"; // or "http://localhost:8000" for local dev

  useEffect(() => {
    fetch(`${base_URL}/api/hello`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API response:", data); // for debugging
        setMessage(data.message || data); // support both { message: "..." } and plain string
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold text-blue-600">React + FastAPI</h1>
        <p className="mt-4 text-gray-700">{message || "Loading..."}</p>
      </div>
    </div>
  );
}

export default App;
