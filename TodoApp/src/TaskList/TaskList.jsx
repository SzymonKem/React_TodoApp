import { useRef, useEffect } from "react";
import "./TaskList.css";

export default function TaskList({
    taskElementsList,
    setTaskElementsList,
    renderItems,
    currentUser,
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
        fetch("http://localhost:3000/tasks", {
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
                        currentUser={currentUser}
                        taskElementsList={taskElementsList}
                        setTaskElementsList={setTaskElementsList}
                        doneChange={handleDone}
                    />
                    <h1>Done:</h1>
                    <DoneList
                        currentUser={currentUser}
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
                        currentUser={currentUser}
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
                        currentUser={currentUser}
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

function ToDoList({
    taskElementsList,
    setTaskElementsList,
    doneChange,
    currentUser,
}) {
    console.log("taskElementsList log from toDoList" + taskElementsList);
    let toDoElementsList = taskElementsList.filter((t) => t.isDone === false);
    return (
        <ul className="toDoList">
            {toDoElementsList.map((t) =>
                !t.editable ? (
                    <Task
                        key={t.id}
                        task={t}
                        currentUser={currentUser}
                        taskElementsList={taskElementsList}
                        setTaskElementsList={setTaskElementsList}
                        doneChange={doneChange}
                    />
                ) : (
                    <EditableTask
                        key={t.id}
                        task={t}
                        currentUser={currentUser}
                        taskElementsList={taskElementsList}
                        setTaskElementsList={setTaskElementsList}
                        doneChange={doneChange}
                    />
                )
            )}
        </ul>
    );
}

function DoneList({ taskElementsList, doneChange, currentUser }) {
    let doneElementsList = taskElementsList.filter((t) => t.isDone === true);
    return (
        <ul className="doneList">
            {doneElementsList.map((t) => (
                <Task
                    key={t.id}
                    task={t}
                    currentUser={currentUser}
                    taskElementsList={taskElementsList}
                    doneChange={doneChange}
                />
            ))}
        </ul>
    );
}

function Task({
    task,
    taskElementsList,
    setTaskElementsList,
    doneChange,
    currentUser,
}) {
    function handleEdit(taskId) {
        setTaskElementsList((prevTaskElementsList) =>
            prevTaskElementsList.map((task) =>
                task.id === taskId
                    ? { ...task, editable: !task.editable }
                    : task
            )
        );
    }
    function handleDelete(taskId) {
        setTaskElementsList(taskElementsList.filter((t) => t.id !== taskId));
        fetch("http://localhost:3000/tasks", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: taskId, userId: currentUser }),
        });
    }
    return (
        <li
            key={task.id}
            onClick={() => doneChange(task.id)}
            className="inProgress"
        >
            <h2>{task.name}</h2>
            <p>{task.desc}</p>
            {!task.isDone ? (
                <div className="taskELementButtons">
                    <button
                        className="edit"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(task.id);
                        }}
                    >
                        <span>Edit task</span>
                    </button>
                    <button
                        className="delete"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(task.id);
                        }}
                    >
                        <span>Delete task</span>
                    </button>
                </div>
            ) : null}
        </li>
    );
}

function EditableTask({
    task,
    taskElementsList,
    setTaskElementsList,
    doneChange,
}) {
    const editRef = useRef(null);
    const editNameRef = useRef(null);
    const editDescRef = useRef(null);
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
            fetch("http://localhost:3000/tasks", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editedTask),
            });
        }
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
    return (
        <li
            key={task.id}
            onClick={() => doneChange(task.id)}
            className="inProgress"
        >
            <div className="editing" ref={editRef}>
                <input
                    type="text"
                    placeholder={task.name}
                    ref={editNameRef}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleConfirm(task.id);
                        }
                    }}
                />
                <input
                    type="text"
                    placeholder={task.desc}
                    ref={editDescRef}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleConfirm(task.id);
                        }
                    }}
                />
                <button
                    className="confirm"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleConfirm(task.id);
                    }}
                >
                    <span>Confirm</span>
                </button>
            </div>
        </li>
    );
}
