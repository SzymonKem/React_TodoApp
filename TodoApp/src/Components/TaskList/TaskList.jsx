import { useState } from "react";
import TaskEditPopUp from "./TaskEditPopUp";
import "./TaskList.css";

export default function TaskList({
    taskElementsList,
    setTaskElementsList,
    listOwner,
    tags,
    editingTask,
    setEditingTask,
}) {
    const [editingTaskId, setEditingTaskId] = useState(null); // Track the task being edited

    async function handleDone(taskId) {
        const currentTask = taskElementsList.find(
            (element) => element.id === taskId
        );
        const isInProgress = currentTask.tags.includes("in progress");
        const newTask = {
            ...currentTask,
            isDone: !currentTask.isDone,
            tags: isInProgress
                ? [
                      ...currentTask.tags.filter(
                          (tag) => tag !== "in progress"
                      ),
                      "done",
                  ]
                : [
                      ...currentTask.tags.filter((tag) => tag !== "done"),
                      "in progress",
                  ],
        };
        setTaskElementsList((prevTaskElementsList) =>
            prevTaskElementsList.map((task) =>
                task.id === taskId ? newTask : task
            )
        );
        try {
            await fetch("http://localhost:3000/tasks", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTask),
            });
        } catch (err) {
            console.log(err.message);
        }
    }

    let toDoElementsList = taskElementsList.filter((t) => t.isDone === false);
    let doneElementsList = taskElementsList.filter((t) => t.isDone === true);

    return (
        <div className={`taskList ${editingTask ? "scrollable" : ""}`}>
            <ul className="toDoList">
                {toDoElementsList.map((t) => (
                    <Task
                        key={t.id}
                        task={t}
                        listOwner={listOwner}
                        taskElementsList={taskElementsList}
                        setTaskElementsList={setTaskElementsList}
                        doneChange={handleDone}
                        tags={tags}
                        editingTask={editingTask}
                        setEditingTask={setEditingTask}
                        editingTaskId={editingTaskId}
                        setEditingTaskId={setEditingTaskId}
                    />
                ))}
            </ul>
            <ul className="doneList">
                {doneElementsList.map((t) => (
                    <Task
                        key={t.id}
                        task={t}
                        listOwner={listOwner}
                        taskElementsList={taskElementsList}
                        doneChange={handleDone}
                        editingTask={editingTask}
                        editingTaskId={editingTaskId}
                        setEditingTaskId={setEditingTaskId}
                    />
                ))}
            </ul>
        </div>
    );
}

function Task({
    task,
    taskElementsList,
    setTaskElementsList,
    doneChange,
    listOwner,
    tags,
    editingTask,
    setEditingTask,
    editingTaskId,
    setEditingTaskId,
}) {
    function handleEdit() {
        setEditingTask(true);
        setEditingTaskId(task.id);
    }

    function handleDelete(taskId) {
        console.log(taskElementsList);
        setTaskElementsList(taskElementsList.filter((t) => t.id !== taskId));
        fetch("http://localhost:3000/tasks", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: taskId, list: listOwner.list }),
        });
    }

    let className = "inProgress task";

    return (
        <>
            {editingTaskId === task.id && (
                <TaskEditPopUp
                    editingTask={editingTask}
                    setEditingTask={setEditingTask}
                    task={task}
                    taskElementsList={taskElementsList}
                    setTaskElementsList={setTaskElementsList}
                    tags={tags}
                    setEditingTaskId={setEditingTaskId}
                />
            )}
            <li
                key={task.id}
                onClick={() => doneChange(task.id)}
                className={className}
            >
                <h2>{task.name}</h2>
                <div className="taskTags">
                    {task.tags.map((tag) => (
                        <span className="tag" key={tag}>
                            {tag}
                        </span>
                    ))}
                </div>
                <p>{task.desc}</p>
                {!task.isDone ? (
                    <div className="taskELementButtons">
                        <button
                            className="edit"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEdit();
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
        </>
    );
}
