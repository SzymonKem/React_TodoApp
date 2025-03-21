import "./App.css";
import ListWindow from "../ListWindow/ListWindow.jsx";
import { useState } from "react";
import LoginPage from "../LoginPage/LoginPage.jsx";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    if (isLoggedIn) {
        return (
            <ListWindow
                currentUser={currentUser}
                setIsLoggedIn={setIsLoggedIn}
            />
        );
    } else {
        return (
            <LoginPage
                setIsLoggedIn={setIsLoggedIn}
                setCurrentUser={setCurrentUser}
            />
        );
    }
}

export default App;
