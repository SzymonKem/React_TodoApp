import { useState, useRef, useEffect } from "react";
import TaskList from "../TaskList/TaskList";
import Sidebar from "../Sidebar/Sidebar";
import "./ListWindow.css";

export default function ListWindow({ currentUser, setIsLoggedIn }) {
    const [renderItems, setRenderItems] = useState("all");
    const [taskElementsList, setTaskElementsList] = useState([]);
    const [nextId, setNextId] = useState(0);
    const [listOwner, setListOwner] = useState(currentUser);

    useEffect(() => {
        const socket = new WebSocket(
            "ws://localhost:3000/tasks?listOwner=" + JSON.stringify(listOwner)
        );

        socket.addEventListener("open", () => {
            console.log("opened socket connection");
        });
        socket.addEventListener("message", () => {
            console.log("got message");
            getTasks();
        });

        const getTasks = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/tasks/?owner=" +
                        JSON.stringify(listOwner)
                );
                const data = await response.json();
                console.log(data);
                const receivedTaskList = data.data;
                setTaskElementsList(receivedTaskList);
                setNextId(
                    receivedTaskList.length > 0
                        ? receivedTaskList[receivedTaskList.length - 1].id + 1
                        : 0
                );
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        getTasks();
    }, [listOwner]);

    return (
        <div className="listWindow">
            <Sidebar
                setIsLoggedIn={setIsLoggedIn}
                setListOwner={setListOwner}
                setTaskElementsList={setTaskElementsList}
                currentUser={currentUser}
                listOwner={listOwner}
            />
            <div className="inputs">
                <TaskAddInputs
                    nextId={nextId}
                    listOwner={listOwner}
                    setNextId={setNextId}
                    taskElementsList={taskElementsList}
                    setTaskElementsList={setTaskElementsList}
                />
                <Filters setRenderItems={setRenderItems} />
            </div>
            <TaskList
                taskElementsList={taskElementsList}
                setTaskElementsList={setTaskElementsList}
                listOwner={listOwner}
                renderItems={renderItems}
            />
        </div>
    );
}

function TaskAddInputs({
    nextId,
    listOwner,
    setNextId,
    taskElementsList,
    setTaskElementsList,
}) {
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);
    const nameRef = useRef(null);
    const descRef = useRef(null);
    function handleInput() {
        const isInputEmpty = !nameRef.current.value || !descRef.current.value;
        setIsButtonEnabled(!isInputEmpty);
    }
    async function handleAdd(e) {
        e.preventDefault();
        const newTask = {
            id: nextId,
            owner: listOwner,
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
    return (
        <form method="post" onSubmit={handleAdd} className="taskAddForm">
            <input
                required
                type="text"
                onInput={handleInput}
                // onKeyDown={handleKeyDown}
                placeholder="Add a task name"
                ref={nameRef}
            />
            <input
                required
                type="text"
                onInput={handleInput}
                // onKeyDown={handleKeyDown}
                placeholder="Add a task description"
                ref={descRef}
            />

            <input
                type="submit"
                disabled={!isButtonEnabled}
                value="ADD TASK"
                className="taskAddFormSubmit"
            />
        </form>
    );
}

function Filters({ setRenderItems }) {
    return (
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
    );
}
