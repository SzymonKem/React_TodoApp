import "./App.css";
import ListWindow from "../ListWindow/ListWindow.jsx";
import { useState } from "react";
import LoginPage from "../LoginPage/LoginPage.jsx";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    if (isLoggedIn) {
        return (
            <ListWindow
                currentUser={currentUserId}
                setIsLoggedIn={setIsLoggedIn}
            />
        );
    } else {
        return (
            <LoginPage
                setIsLoggedIn={setIsLoggedIn}
                setCurrentUserId={setCurrentUserId}
            />
        );
    }
}

export default App;
