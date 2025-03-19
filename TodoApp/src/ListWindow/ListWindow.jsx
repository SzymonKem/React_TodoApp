import { useState, useRef, useEffect } from "react";
import TaskList from "../TaskList/TaskList";
import "./ListWindow.css";

export default function ListWindow({ currentUser, setIsLoggedIn }) {
    const [renderItems, setRenderItems] = useState("all");
    const [taskElementsList, setTaskElementsList] = useState([]);
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);
    const [nextId, setNextId] = useState(0);
    const nameRef = useRef(null);
    const descRef = useRef(null);
    useEffect(() => {
        const getTasks = async () => {
            if (taskElementsList.length === 0) {
                try {
                    const response = await fetch(
                        "http://localhost:3000/tasks/?userId=" + currentUser
                    );
                    const data = await response.json();
                    console.log(data);
                    const receivedTaskList = data.data;
                    setTaskElementsList(receivedTaskList);

                    setNextId(
                        receivedTaskList.length > 0
                            ? receivedTaskList[receivedTaskList.length - 1].id +
                                  1
                            : 0
                    );
                } catch (error) {
                    console.error("Error fetching tasks:", error);
                }
            }
        };

        getTasks();
    }, []);

    function handleInput() {
        const isInputEmpty = !nameRef.current.value || !descRef.current.value;
        setIsButtonEnabled(!isInputEmpty);
    }

    async function handleAddClick() {
        const newTask = {
            id: nextId,
            userId: currentUser,
            isDone: false,
            name: nameRef.current.value.trim(),
            desc: descRef.current.value.trim(),
            editable: false,
        };
        setNextId(nextId + 1);
        setTaskElementsList([...taskElementsList, newTask]);
        await fetch("http://localhost:3000/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTask),
        });
        nameRef.current.value = "";
        descRef.current.value = "";
        handleInput();
    }
    async function handleLogoutClick() {
        await fetch("http://localhost:3000/auth/logout", {
            method: "DELETE",
            credentials: "include",
        });
        setIsLoggedIn(false);
    }
    function handleKeyDown(e) {
        if (
            e.key === "Enter" &&
            nameRef.current.value.trim() !== "" &&
            descRef.current.value.trim() !== ""
        ) {
            handleAddClick();
        }
    }
    return (
        <div className="listWindow">
            {/* {console.log("rendered listwindow")} */}
            <button className="logout" onClick={handleLogoutClick}>
                Logout
            </button>
            <div className="inputs">
                <input
                    type="text"
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a task name"
                    ref={nameRef}
                />
                <input
                    type="text"
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a task description"
                    ref={descRef}
                />

                <button onClick={handleAddClick} disabled={!isButtonEnabled}>
                    ADD TASK
                </button>
                <div className="renderControls">
                    <button
                        onClick={() => {
                            setRenderItems("all");
                        }}
                    >
                        Show all tasks
                    </button>
                    <button
                        onClick={() => {
                            setRenderItems("inProgress");
                        }}
                    >
                        Show tasks in progress
                    </button>
                    <button
                        onClick={() => {
                            setRenderItems("done");
                        }}
                    >
                        Show done tasks
                    </button>
                </div>
            </div>
            <TaskList
                taskElementsList={taskElementsList}
                setTaskElementsList={setTaskElementsList}
                currentUser={currentUser}
                renderItems={renderItems}
            />
        </div>
    );
}
