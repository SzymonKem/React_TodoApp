import { useRef, useEffect } from "react";
import "./TaskList.css";

export default function TaskList({
    taskElementsList,
    setTaskElementsList,
    renderItems,
}) {
    function handleDone(taskId) {
        const newTask = {
            ...taskElementsList[taskId],
            isDone: !taskElementsList[taskId].isDone,
        };
        setTaskElementsList((prevTaskElementsList) =>
            prevTaskElementsList.map((task) =>
                task.id === taskId ? newTask : task
            )
        );
        fetch("http://localhost:3000/", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTask),
        });
    }
    let content;
    switch (renderItems) {
        case "all":
            content = (
                <>
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
                </>
            );
            break;
        case "inProgress":
            content = (
                <>
                    <h1>In progress: </h1>
                    <ToDoList
                        taskElementsList={taskElementsList}
                        setTaskElementsList={setTaskElementsList}
                        doneChange={handleDone}
                    />
                </>
            );
            break;
        case "done":
            content = (
                <>
                    <h1>Done:</h1>
                    <DoneList
                        taskElementsList={taskElementsList}
                        doneChange={handleDone}
                    />
                </>
            );
            break;
        default:
            break;
    }
    return (
        <div className="taskList">
            {console.log("rendered tasklist")}
            {content}
        </div>
    );
}

function ToDoList({ taskElementsList, setTaskElementsList, doneChange }) {
    const editRef = useRef(null);
    const editNameRef = useRef(null);
    const editDescRef = useRef(null);

    function handleEdit(taskId) {
        setTaskElementsList((prevTaskElementsList) =>
            prevTaskElementsList.map((task) =>
                task.id === taskId
                    ? { ...task, editable: !task.editable }
                    : task
            )
        );
    }

    function handleConfirm(taskId) {
        const newName = editNameRef.current.value.trim();
        const newDesc = editDescRef.current.value.trim();

        const editedTask = {
            ...taskElementsList[taskId],
            name: newName !== "" ? newName : taskElementsList[taskId].name,
            desc: newDesc !== "" ? newDesc : taskElementsList[taskId].desc,
            editable: false,
        };

        setTaskElementsList((prevTaskElementsList) =>
            prevTaskElementsList.map((task) =>
                task.id === taskId ? editedTask : task
            )
        );
        if (newName !== "" || newDesc !== "") {
            fetch("http://localhost:3000/", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editedTask),
            });
        }
    }

    function handleDelete(taskId) {
        const taskToDelete = taskElementsList.filter((t) => t.id === taskId);
        setTaskElementsList(taskElementsList.filter((t) => t.id !== taskId));
        fetch("http://localhost:3000/", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskToDelete),
        });
    }

    useEffect(() => {
        function handleOutsideClick(e) {
            if (editRef.current && !editRef.current.contains(e.target)) {
                setTaskElementsList((prevTaskElementsList) =>
                    prevTaskElementsList.map((task) => ({
                        ...task,
                        editable: false,
                    }))
                );
            }
        }
        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [taskElementsList, setTaskElementsList]);

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
                                ref={editNameRef}
                                onClick={(e) => e.stopPropagation()}
                                // onChange={(e) =>
                                //     handleNameChange(t.id, e.target.value)
                                // }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleConfirm(t.id);
                                    }
                                }}
                            />
                            <input
                                type="text"
                                placeholder={t.desc}
                                ref={editDescRef}
                                onClick={(e) => e.stopPropagation()}
                                // onChange={(e) =>
                                //     handleDescChange(t.id, e.target.value)
                                // }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleConfirm(t.id);
                                    }
                                }}
                            />
                            <button
                                className="confirm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleConfirm(t.id);
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
