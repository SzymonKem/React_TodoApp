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
        console.log("TAGS FROM HANDLEDONE: ", tags);
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
            console.log("TAGS AFTER HANDLE DONE: ", tags);
        } catch (err) {
            console.log(err.message);
        }
    }
    console.log(
        "taskelementsList from tasklist before filter",
        taskElementsList
    );
    let toDoElementsList = taskElementsList.filter(
        (task) => task.isDone === false
    );
    console.log("taskelementsLits", taskElementsList);
    let doneElementsList = taskElementsList.filter(
        (task) => task.isDone === true
    );

    return (
        <div className={`taskList ${editingTask ? "scrollable" : ""}`}>
            {console.log("TAGS FROM TASKLIST", tags)}
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
