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
            console.log(taskElementsList);
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
            console.log(editedTask);
            if (newName !== "" || newDesc !== "") {
                await fetch("http://localhost:3000/tasks", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(editedTask),
                });
            }
            setEditingTask(false);
            console.log("tags from handleConfirm: ", tags);
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
                // onInput={handleInput}
                defaultValue={task.name}
                placeholder="Add a task name"
                ref={editNameRef}
            />
            <input
                type="text"
                defaultValue={task.desc}
                // onInput={handleInput}
                placeholder="Add a task description"
                ref={editDescRef}
            />

            <ul className="tagListUl">
                {console.log("tags: ", tags)}
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
                                        console.log("task tags");
                                        console.log(task);
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
