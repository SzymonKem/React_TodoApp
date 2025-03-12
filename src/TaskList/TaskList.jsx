import { useRef, useEffect, useState } from "react";
import "./TaskList.css";

export default function TaskList({ taskElementsList, setTaskElementsList }) {
    function handleDone(taskId) {
        setTaskElementsList(
            taskElementsList.map((task) =>
                task.id === taskId ? { ...task, isDone: !task.isDone } : task
            )
        );
    }
    return (
        <div className="taskList">
            <h1>In progress: </h1>
            <ToDoList
                taskElementsList={taskElementsList}
                setTaskElementsList={setTaskElementsList}
                doneChange={handleDone}
            />
            <h1>Done:</h1>
            <DoneList
                taskElementsList={taskElementsList}
                doneChange={handleDone}
            />
        </div>
    );
}

function ToDoList({ taskElementsList, setTaskElementsList, doneChange }) {
    const editRef = useRef(null);
    const [orignalValues, setOrignalValues] = useState();
    function handleNameChange(taskId, value) {
        setTaskElementsList(
            taskElementsList.map((task) =>
                task.id === taskId ? { ...task, name: value } : task
            )
        );
    }

    function handleDescChange(taskId, value) {
        setTaskElementsList(
            taskElementsList.map((task) =>
                task.id === taskId ? { ...task, desc: value } : task
            )
        );
    }

    function handleEdit(taskId) {
        setTaskElementsList(
            taskElementsList.map((task) =>
                task.id === taskId
                    ? { ...task, editable: !task.editable }
                    : task
            )
        );
        const task = taskElementsList.find((t) => t.id === taskId);
        setOrignalValues({
            [taskId]: { name: task.name, desc: task.desc },
        });
    }

    function handleDelete(taskId) {
        setTaskElementsList(taskElementsList.filter((t) => t.id !== taskId));
    }

    useEffect(() => {
        function handleOutsideClick(e) {
            if (editRef.current && !editRef.current.contains(e.target)) {
                setTaskElementsList(
                    taskElementsList.map((task) => ({
                        ...task,
                        name: orignalValues[task.id].name,
                        desc: orignalValues[task.id].desc,
                        editable: false,
                    }))
                );
            }
        }
        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [taskElementsList, setTaskElementsList, orignalValues]);

    let toDoElementsList = taskElementsList.filter((t) => t.isDone === false);
    return (
        <ul className="toDoList">
            {toDoElementsList.map((t) => (
                <li
                    key={t.id}
                    onClick={() => doneChange(t.id)}
                    className="inProgress"
                >
                    {!t.editable ? (
                        <>
                            <h2>{t.name}</h2>
                            <p>{t.desc}</p>
                            <div className="taskELementButtons">
                                <button
                                    className="edit"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(t.id);
                                    }}
                                >
                                    <span>Edit task</span>
                                </button>
                                <button
                                    className="delete"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(t.id);
                                    }}
                                >
                                    <span>Delete task</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="editing" ref={editRef}>
                            <input
                                type="text"
                                placeholder={t.name}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) =>
                                    handleNameChange(t.id, e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleEdit(t.id);
                                    }
                                }}
                            />
                            <input
                                type="text"
                                placeholder={t.desc}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) =>
                                    handleDescChange(t.id, e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleEdit(t.id);
                                    }
                                }}
                            />
                            <button
                                className="confirm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(t.id);
                                }}
                            >
                                <span>Confirm</span>
                            </button>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
}

function DoneList({ taskElementsList, doneChange }) {
    let doneElementsList = taskElementsList.filter((t) => t.isDone === true);
    return (
        <ul className="doneList">
            {doneElementsList.map((t) => (
                <li
                    key={t.id}
                    onClick={() => doneChange(t.id)}
                    className="done"
                >
                    <h2>{t.name}</h2>
                    <p>{t.desc}</p>
                </li>
            ))}
        </ul>
    );
}
