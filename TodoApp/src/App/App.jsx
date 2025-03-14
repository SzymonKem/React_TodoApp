import "./App.css";
import ListWindow from "../ListWindow/ListWindow.jsx";
import { useEffect } from "react";

function App() {
    const resetDb = async () => {
        await fetch("http://localhost:3000/reset", {
            method: "POST",
        });
    };
    useEffect(() => {
        resetDb();
    }, []);
    return (
        <>
            <h1>ToDo list</h1>
            <ListWindow />
        </>
    );
}

export default App;
