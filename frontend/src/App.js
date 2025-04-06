import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import HostLobby from "./pages/HostLobby";
import JoinLobby from "./pages/JoinLobby";
import WaitingLobby from "./pages/WaitingLobby";
import Question from "./pages/Question";
import Correct from "./pages/Correct";
import Incorrect from "./pages/Incorrect";
import Scoreboard from "./pages/Scoreboard"

// Testing Pages
import UsernameTrivia from "./pages/UsernameTrivia";
import ListTrivia from "./pages/ListTrivia";

// Page flow
// Home -> HostLobby -----------------> Question -> Correct ---> Question ... -> Scoreboard
//         JoinLobby -> WaitingLobby ->             Incorrect -> 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hostlobby/:lobby_code" element={<HostLobby />} />
      <Route path="/joinlobby" element={<JoinLobby />} />
      <Route path="/waitinglobby/:lobby_code" element={<WaitingLobby />} />
      <Route path="/question/:lobby_code/:question_number" element={<Question />} />
      <Route path="/correct/:lobby_code" element={<Correct />} />
      <Route path="/incorrect/:lobby_code" element={<Incorrect />} />
      <Route path="/scoreboard/:lobby_code" element={<Scoreboard />} />

      <Route path="/usernametrivia" element={<UsernameTrivia />} />
      <Route path="/listtrivia" element={<ListTrivia />} />
    </Routes>
  );
}

export default App;
