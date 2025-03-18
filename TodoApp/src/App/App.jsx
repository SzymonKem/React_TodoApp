import "./App.css";
import ListWindow from "../ListWindow/ListWindow.jsx";
import { useState } from "react";
import LoginPage from "../../LoginPage/LoginPage.jsx";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    if (isLoggedIn) {
        return <ListWindow />;
    } else {
        return <LoginPage setIsLoggedIn={setIsLoggedIn} />;
    }
}

export default App;
