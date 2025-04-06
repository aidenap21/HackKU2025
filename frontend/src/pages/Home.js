import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
  
    const handleCreateLobby = () => {
      const new_lobby_code = Math.random().toString(36).substring(2, 8);  // Random lobby code
      navigate(`/hostlobby/${new_lobby_code}`);  // Redirect to the new lobby page
    };

    const handleJoinLobby = () => {
        navigate(`/joinlobby`);  // Redirect to the new lobby page
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-blue-600 mb-6">Welcome to CineMe Trivia!</h1>
            <div className="flex flex-col gap-4">
                <button 
                    onClick={handleCreateLobby}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-200"
                >
                    Create Lobby
                </button>
                <button 
                    onClick={handleJoinLobby}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-700 transition duration-200"
                >
                    Join Lobby
                </button>
            </div>
        </div>
    );
}

export default Home;
