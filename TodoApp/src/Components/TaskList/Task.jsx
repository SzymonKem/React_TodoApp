import TaskEditPopUp from "./TaskEditPopUp";

export default function Task({
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
