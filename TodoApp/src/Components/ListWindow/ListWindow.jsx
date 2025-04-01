import { useState, useEffect, useCallback } from "react";
import TaskList from "../TaskList/TaskList";
import Sidebar from "../Sidebar/Sidebar";
import TaskAddPopUp from "./TaskAddPopUp";
import Filters from "./Filters";
import "./ListWindow.css";
import { useWebSocket } from "../../Contexts/WebSocketProvider";

export default function ListWindow({
    currentUser,
    setIsLoggedIn,
    listOwner,
    setListOwner,
}) {
    const [taskElementsList, setTaskElementsList] = useState([]);
    const [nextId, setNextId] = useState(0);
    const [visible, setVisible] = useState(false);
    const [editingTask, setEditingTask] = useState(false);
    const [tags, setTags] = useState(["in progress", "done"]);
    const { addWebSocketEventListener, isConnected } = useWebSocket();

    const getTasks = useCallback(
        async (type) => {
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
                if (type == "allTasksRefresh") {
                    return receivedTaskList;
                }
                setTaskElementsList(receivedTaskList);
                setNextId(
                    receivedTaskList.length > 0
                        ? receivedTaskList[receivedTaskList.length - 1].id + 1
                        : 0
                );
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        },
        [listOwner]
    );
    useEffect(() => {
        if (!isConnected) return;
        console.log("Adding websocket listener: ");
        addWebSocketEventListener("message", (event) => {
            console.log("Received message tasks");
            console.log(event.data);
            if (event.data == "tasksUpdated" || event.data == "tagsUpdated") {
                getTasks();
            }
        });

        getTasks();
        return () => {};
    }, [listOwner, addWebSocketEventListener, isConnected, getTasks]);
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
                    tags={tags}
                    setTags={setTags}
                    listOwner={listOwner}
                    taskElementsList={taskElementsList}
                    setTaskElementsList={setTaskElementsList}
                    getTasks={getTasks}
                />
            </div>
            <TaskList
                taskElementsList={taskElementsList}
                setTaskElementsList={setTaskElementsList}
                listOwner={listOwner}
                tags={tags}
                editingTask={editingTask}
                setEditingTask={setEditingTask}
            />
        </div>
    );
}
