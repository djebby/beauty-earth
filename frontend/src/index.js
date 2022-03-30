import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
//importing bootstrap & bootstrap-icons css files
import "bootstrap/dist/css/bootstrap.min.css"; // npm i bootstrap
import "bootstrap-icons/font/bootstrap-icons.css"; // npm i bootstrap-icons
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
