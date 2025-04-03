import { useState } from "react";
import Task from "./Task.jsx";
import "./TaskList.css";

export default function TaskList({
    taskElementsList,
    setTaskElementsList,
    listOwner,
    tags,
    editingTask,
    setEditingTask,
}) {
    const [editingTaskId, setEditingTaskId] = useState(null);

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
        setTaskElementsList(
            taskElementsList.map((task) =>
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

    let toDoElementsList = taskElementsList.filter(
        (task) => task.isDone === false
    );
    let doneElementsList = taskElementsList.filter(
        (task) => task.isDone === true
    );

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
