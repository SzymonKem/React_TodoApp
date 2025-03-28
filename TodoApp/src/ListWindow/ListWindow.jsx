import { useState, useRef, useEffect } from "react";
import TaskList from "../TaskList/TaskList";
import Sidebar from "../Sidebar/Sidebar";
import TaskAddPopUp from "./TaskAddPopUp";
import Filters from "./Filters";
import "./ListWindow.css";

export default function ListWindow({ currentUser, setIsLoggedIn }) {
    const [renderItems, setRenderItems] = useState("all");
    const [taskElementsList, setTaskElementsList] = useState([]);
    const [nextId, setNextId] = useState(0);
    const [listOwner, setListOwner] = useState(currentUser);
    const [visible, setVisible] = useState(false);
    const [editingTask, setEditingTask] = useState(false);
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
    const className =
        visible || editingTask ? "listWindow no-scroll" : "listWindow";
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
                tags={tags}
            />
            <div className="inputs">
                <button onClick={() => setVisible(true)} className="addTask">
                    Add task
                </button>
                <Filters
                    setRenderItems={setRenderItems}
                    tags={tags}
                    setTags={setTags}
                    listOwner={listOwner}
                />
            </div>
            <TaskList
                taskElementsList={taskElementsList}
                setTaskElementsList={setTaskElementsList}
                listOwner={listOwner}
                renderItems={renderItems}
                tags={tags}
                editingTask={editingTask}
                setEditingTask={setEditingTask}
            />
        </div>
    );
}
