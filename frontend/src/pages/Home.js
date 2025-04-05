import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to Movie Trivia!</h1>
      <Link to="/usernametrivia" className="bg-blue-500 text-white px-6 py-3 rounded shadow mb-4">
        Play Trivia with Letterboxd Username
      </Link>
      <Link to="/listtrivia" className="bg-green-500 text-white px-6 py-3 rounded shadow">
        Play Trivia with Letterboxd List
      </Link>
    </div>
  );
}

export default Home;
