export default function TaskList({ taskElementsList, setTaskElementsList }) {
    function handleEdit() {}
    function handleDelete(taskId) {
        setTaskElementsList(taskElementsList.filter((t) => t.id !== taskId));
    }

    function handleDone(t) {
        t.isDone = !t.isDone;
    }
    return (
        <div className="taskList">
            <ToDoList
                taskElementsList={taskElementsList}
                onEditclicked={handleEdit}
                onDeleteClicked={handleDelete}
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
                    onClick={() => doneChange(t)}
                    className="inProgress"
                >
                    <h2>{t.name}</h2>
                    <p>{t.desc}</p>
                    <div className="taskELementButtons">
                        <button onClick={onEditclicked}>
                            <span>Edit task</span>
                        </button>
                        <button onClick={onDeleteClicked}>
                            <span>Delete task</span>
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}

function DoneList(taskElementsList, doneChange) {
    let doneElementsList = taskElementsList.filter((t) => t.isDone === true);
    return (
        <ul className="doneList">
            {doneElementsList.map((t) => {
                <li onClick={doneChange(t)} className="done">
                    <h2>{t.name}</h2>
                    <p>{t.desc}</p>
                </li>;
            })}
        </ul>
    );
}
