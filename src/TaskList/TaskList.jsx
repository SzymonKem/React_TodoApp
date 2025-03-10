import { useState } from "react";

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
            <ToDoList
                taskElementsList={taskElementsList}
                setTaskElementsList={setTaskElementsList}
                doneChange={handleDone}
            />
            <DoneList
                taskElementsList={taskElementsList}
                doneChange={handleDone}
            />
        </div>
    );
}

function ToDoList({ taskElementsList, setTaskElementsList, doneChange }) {
    const [currentName, setcurrentName] = useState({ name: "", desc: "" });
    function handleNameChange(taskId, value) {
        // taskElementsList.map((task) =>
        //     task.id === taskId ? { ...task, name: value } : task
        // );
        setcurrentName({ ...currentName, name: value });
    }
    function handleDescChange(taskId, value) {
        // taskElementsList.map((task) =>
        //     task.id === taskId ? { ...task, desc: value } : task
        // );
        setcurrentName({ ...currentName, desc: value });
    }
    function handleEdit(taskId) {
        setTaskElementsList(
            taskElementsList.map((task) =>
                task.id === taskId
                    ? {
                          ...task,
                          name: currentName.name || task.name,
                          desc: currentName.desc || task.desc,
                          editable: !task.editable,
                      }
                    : task
            )
        );
    }
    function handleDelete(taskId) {
        setTaskElementsList(taskElementsList.filter((t) => t.id !== taskId));
    }
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
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(t.id);
                                    }}
                                >
                                    <span>Edit task</span>
                                </button>
                                <button
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
                        <>
                            <input
                                type="text"
                                placeholder={t.name}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => {
                                    handleNameChange(t.id, e.target.value);
                                }}
                            />
                            <input
                                type="text"
                                placeholder={t.desc}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => {
                                    handleDescChange(t.id, e.target.value);
                                }}
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(t.id);
                                }}
                            >
                                <span>Confirm</span>
                            </button>
                        </>
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
