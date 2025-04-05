import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import UsernameTrivia from "./pages/UsernameTrivia";
import ListTrivia from "./pages/ListTrivia";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/usernametrivia" element={<UsernameTrivia />} />
        <Route path="/listtrivia" element={<ListTrivia />} />
      </Routes>
    </Router>
  );
}

export default App;
