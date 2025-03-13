import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./Index/index.css";
import App from "./App/App.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);
