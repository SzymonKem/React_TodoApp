import { useState, useRef, useEffect } from "react";
import TaskList from "../TaskList/TaskList";
import Sidebar from "../Sidebar/Sidebar";
import "./ListWindow.css";

export default function ListWindow({ currentUser, setIsLoggedIn }) {
    const [renderItems, setRenderItems] = useState("all");
    const [taskElementsList, setTaskElementsList] = useState([]);
    const [nextId, setNextId] = useState(0);
    const [listOwner, setListOwner] = useState(currentUser);
    const [visible, setVisible] = useState(false);
    const [tags, setTags] = useState(["in progress", "done"]);
    const socket = useRef(null);
    const teamUpdateHandlerRef = useRef(null);
    const userUpdateHandlerRef = useRef(null);

    useEffect(() => {
        socket.current = new WebSocket(
            "ws://localhost:3000?listOwner=" +
                JSON.stringify(listOwner) +
                "&currentUser=" +
                JSON.stringify(currentUser)
        );
        socket.current.addEventListener("open", () => {
            console.log("opened socket connection");
        });
        socket.current.addEventListener("ping", () => {
            console.log("Received ping, sending pong");
            socket.current.pong();
        });
        socket.current.addEventListener("message", (event) => {
            console.log("Event: ", event);
            console.log("Event data: ", event.data);
            if (event.data == "tasksUpdated") {
                getTasks();
            } else if (event.data == "teamsUpdated") {
                console.log("TeamsUpdated");
                teamUpdateHandlerRef.current();
                if (listOwner.type == "team") {
                    userUpdateHandlerRef.current();
                }
            }
        });
        socket.current.addEventListener("close", () => {
            console.log("Connection closed");
        });

        const getTasks = async () => {
            try {
                console.log("Logging listOwner from getTasks:");
                console.log(listOwner);
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
        return () => socket.current.close();
    }, [listOwner]);
    const className = visible ? "listWindow no-scroll" : "listWindow";
    return (
        <div className={className}>
            <Sidebar
                setIsLoggedIn={setIsLoggedIn}
                setListOwner={setListOwner}
                setTaskElementsList={setTaskElementsList}
                currentUser={currentUser}
                listOwner={listOwner}
                teamUpdateHandler={(fun) =>
                    (teamUpdateHandlerRef.current = fun)
                }
                userUpdateHandler={(fun) =>
                    (userUpdateHandlerRef.current = fun)
                }
            />
            <TaskAddPopUp
                nextId={nextId}
                listOwner={listOwner}
                setNextId={setNextId}
                taskElementsList={taskElementsList}
                setTaskElementsList={setTaskElementsList}
                visible={visible}
                setVisible={setVisible}
            />
            <div className="inputs">
                <button onClick={() => setVisible(true)} className="addTask">
                    Add task
                </button>
                <Filters
                    setRenderItems={setRenderItems}
                    tags={tags}
                    setTags={setTags}
                />
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

function TaskAddPopUp({
    visible,
    setVisible,
    nextId,
    listOwner,
    setNextId,
    taskElementsList,
    setTaskElementsList,
}) {
    return (
        <div className={visible === true ? "visiblePopUp" : "invisiblePopUp"}>
            <div className="popUpContent">
                <a
                    href="#"
                    className="popUpClose"
                    onClick={() => setVisible(false)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                        />
                    </svg>
                </a>
                <TaskAddInputs
                    nextId={nextId}
                    listOwner={listOwner}
                    setNextId={setNextId}
                    taskElementsList={taskElementsList}
                    setTaskElementsList={setTaskElementsList}
                    setVisible={setVisible}
                />
            </div>
        </div>
    );
}

function TaskAddInputs({
    nextId,
    listOwner,
    setNextId,
    taskElementsList,
    setTaskElementsList,
    setVisible,
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
            list: listOwner.list,
            isDone: false,
            name: nameRef.current.value.trim(),
            desc: descRef.current.value.trim(),
            editable: false,
            tags: ["in progress"],
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
        setVisible(false);
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

function Filters({ setRenderItems, tags, setTags }) {
    console.log("tags");
    console.log(tags);

    return (
        <>
            <div className="tagList">
                <ul className="tagListUl">
                    {tags.map((tag) => (
                        <li key={tag}>
                            <a href="#">{tag}</a>
                        </li>
                    ))}
                    <li className="createTag">
                        <a href="#">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4.5v15m7.5-7.5h-15"
                                />
                            </svg>
                            <span>Create tag</span>
                        </a>
                    </li>
                </ul>
            </div>
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
        </>
    );
}
