import { useState } from "react";
import TaskList from "../TaskList/TaskList";
import "./ListWindow.css";

let nextId = 0;

export default function ListWindow() {
    let initialState = [];
    const [taskElementsList, setTaskELementsList] = useState(initialState);
    const [taskNameInput, setTaskNameInput] = useState("");
    const [taskDescInput, setTaskDescInput] = useState("");
    function handleNameChange(e) {
        setTaskNameInput(e.target.value);
    }
    function handleDescChange(e) {
        setTaskDescInput(e.target.value);
    }
    function handleAddClick() {
        setTaskELementsList([
            ...taskElementsList,
            {
                id: nextId++,
                isDone: false,
                name: taskNameInput,
                desc: taskDescInput,
                editable: false,
            },
        ]);
        setTaskNameInput("");
        setTaskDescInput("");
    }
    function handleKeyDown(e) {
        if (e.key === "Enter" && taskNameInput !== "" && taskDescInput !== "") {
            handleAddClick();
        }
    }
    return (
        <div className="listWindow">
            <div className="inputs">
                <input
                    type="text"
                    value={taskNameInput}
                    onChange={handleNameChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a task name"
                />
                <input
                    type="text"
                    value={taskDescInput}
                    onChange={handleDescChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a task description"
                />

                <button
                    onClick={handleAddClick}
                    disabled={!taskNameInput || !taskDescInput}
                >
                    ADD TASK
                </button>
            </div>
            <TaskList
                taskElementsList={taskElementsList}
                setTaskElementsList={setTaskELementsList}
            />
        </div>
    );
}
