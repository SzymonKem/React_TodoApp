import { useState, useRef } from "react";

export default function TaskEditInputs({
    task,
    taskElementsList,
    setTaskElementsList,
    tags,
    setEditingTask,
}) {
    const [taskTags, setTaskTags] = useState(task.tags);
    const editNameRef = useRef(null);
    const editDescRef = useRef(null);
    async function handleConfirm(e, taskId) {
        e.preventDefault();
        try {
            const newName = editNameRef.current.value.trim();
            const newDesc = editDescRef.current.value.trim();
            const currentTask = taskElementsList.find(
                (element) => element.id == taskId
            );
            const editedTask = {
                ...currentTask,
                name: newName !== "" ? newName : currentTask.name,
                desc: newDesc !== "" ? newDesc : currentTask.desc,
                tags: taskTags,
                editable: false,
            };

            setTaskElementsList((prevTaskElementsList) =>
                prevTaskElementsList.map((task) =>
                    task.id === taskId ? editedTask : task
                )
            );
            if (newName !== "" || newDesc !== "") {
                await fetch("http://localhost:3000/tasks", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(editedTask),
                });
            }
            setEditingTask(false);
        } catch (err) {
            console.log(err.message);
        }
    }
    return (
        <form
            method="post"
            onSubmit={(e) => handleConfirm(e, task.id)}
            className="taskAddForm"
        >
            <input
                type="text"
                defaultValue={task.name}
                placeholder="Add a task name"
                ref={editNameRef}
            />
            <input
                type="text"
                defaultValue={task.desc}
                placeholder="Add a task description"
                ref={editDescRef}
            />

            <ul className="tagListUl">
                {tags.map(
                    (tag) =>
                        tag != "in progress" &&
                        tag != "done" && (
                            <li
                                key={tag}
                                className={
                                    taskTags.includes(tag)
                                        ? "selectedTag"
                                        : "unselectedTag"
                                }
                            >
                                <a
                                    href="#"
                                    onClick={() => {
                                        taskTags.includes(tag)
                                            ? setTaskTags(
                                                  taskTags.filter(
                                                      (selectedTag) =>
                                                          selectedTag != tag
                                                  )
                                              )
                                            : setTaskTags([...taskTags, tag]);
                                    }}
                                >
                                    {tag}
                                </a>
                            </li>
                        )
                )}
            </ul>
            <input
                type="submit"
                value="Confirm"
                className="taskEditFormSubmit"
            />
        </form>
    );
}
