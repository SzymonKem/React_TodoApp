export default function TaskList({ taskElementsList, setTaskElementsList }) {
    function handleEdit() {}
    function handleDelete(taskId) {
        setTaskElementsList(taskElementsList.filter((t) => t.id !== taskId));
    }

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
                onEditclicked={handleEdit}
                onDeleteClicked={handleDelete}
                doneChange={handleDone}
            />
            <DoneList
                taskElementsList={taskElementsList}
                doneChange={handleDone}
            />
        </div>
    );
}

function ToDoList({
    taskElementsList,
    onEditclicked,
    onDeleteClicked,
    doneChange,
}) {
    let toDoElementsList = taskElementsList.filter((t) => t.isDone === false);
    return (
        <ul className="toDoList">
            {toDoElementsList.map((t) => (
                <li
                    key={t.id}
                    onClick={() => doneChange(t.id)}
                    className="inProgress"
                >
                    <h2>{t.name}</h2>
                    <p>{t.desc}</p>
                    <div className="taskELementButtons">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEditclicked();
                            }}
                        >
                            <span>Edit task</span>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteClicked(t.id);
                            }}
                        >
                            {" "}
                            <span>Delete task</span>
                        </button>
                    </div>
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
