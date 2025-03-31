import "./App.css";
import ListWindow from "../ListWindow/ListWindow.jsx";
import { useState, useEffect } from "react";
import LoginPage from "../LoginPage/LoginPage.jsx";
import { WebSocketProvider } from "../WebSocketProvider.jsx";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [listOwner, setListOwner] = useState(null);

    useEffect(() => {
        if (currentUser && !listOwner) {
            setListOwner(currentUser);
        }
    }, [currentUser]);

    if (isLoggedIn && listOwner) {
        return (
            <WebSocketProvider currentUser={currentUser} listOwner={listOwner}>
                <ListWindow
                    currentUser={currentUser}
                    setIsLoggedIn={setIsLoggedIn}
                    listOwner={listOwner}
                    setListOwner={setListOwner}
                />
            </WebSocketProvider>
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
