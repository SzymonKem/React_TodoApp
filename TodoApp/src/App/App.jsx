import "./App.css";
import ListWindow from "../Components/ListWindow/ListWindow.jsx";
import { useState } from "react";
import LoginPage from "../Components/LoginPage/LoginPage.jsx";
import { WebSocketProvider } from "../Contexts/WebSocketProvider.jsx";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [listOwner, setListOwner] = useState(null);

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
                setListOwner={setListOwner}
            />
        );
    }
}

export default App;
