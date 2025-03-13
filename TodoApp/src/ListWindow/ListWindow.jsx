import { useState, useRef } from "react";
import TaskList from "../TaskList/TaskList";
import "./ListWindow.css";

let nextId = 0;

export default function ListWindow() {
    let initialState = [];
    const [renderItems, setRenderItems] = useState("all");
    const [taskElementsList, setTaskELementsList] = useState(initialState);
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);
    const nameRef = useRef(null);
    const descRef = useRef(null);
    function handleInput() {
        const isInputEmpty = !nameRef.current.value || !descRef.current.value;
        setIsButtonEnabled(!isInputEmpty);
    }

    function handleAddClick() {
        const newTask = {
            id: nextId++,
            isDone: false,
            name: nameRef.current.value.trim(),
            desc: descRef.current.value.trim(),
            editable: false,
        };
        setTaskELementsList([...taskElementsList, newTask]);
        fetch("http://localhost:3000/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTask),
        });
        nameRef.current.value = "";
        descRef.current.value = "";
        handleInput();
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
            {console.log("rendered listwindow")}
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
                setTaskElementsList={setTaskELementsList}
                renderItems={renderItems}
            />
        </div>
    );
}
