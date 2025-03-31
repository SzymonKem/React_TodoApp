import TaskEditInputs from "./TaskEditInputs.jsx";

export default function TaskEditPopUp({
    editingTask,
    setEditingTask,
    task,
    taskElementsList,
    setTaskElementsList,
    tags,
    setEditingTaskId,
}) {
    return (
        <div
            className={editingTask ? "visibleEditPopUp" : "invisibleEditPopUp"}
        >
            <div className="popUpContent">
                <a
                    href="#"
                    className="popUpClose"
                    onClick={() => {
                        setEditingTask(false);
                        setEditingTaskId(null);
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                        />
                    </svg>
                </a>
                <TaskEditInputs
                    task={task}
                    taskElementsList={taskElementsList}
                    setTaskElementsList={setTaskElementsList}
                    tags={tags}
                    setEditingTask={setEditingTask}
                    setEditingTaskId={setEditingTaskId}
                />
            </div>
        </div>
    );
}
