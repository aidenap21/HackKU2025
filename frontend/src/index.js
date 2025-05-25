import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css"; // optional, if you have styles

const root = ReactDOM.createRoot(document.getElementById("root"));

const basename = process.env.REACT_APP_BASENAME_LOCAL || "";

root.render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
