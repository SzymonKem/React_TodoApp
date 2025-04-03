import TaskAddInputs from "./TaskAddInputs";
export default function TaskAddPopUp({
    visible,
    setVisible,
    nextId,
    listOwner,
    setNextId,
    taskElementsList,
    setTaskElementsList,
    tags,
}) {
    return (
        <div className={visible === true ? "visiblePopUp" : "invisiblePopUp"}>
            <div className="popUpContent">
                <a
                    href="#"
                    className="popUpClose"
                    onClick={() => setVisible(false)}
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
                <TaskAddInputs
                    nextId={nextId}
                    listOwner={listOwner}
                    setNextId={setNextId}
                    taskElementsList={taskElementsList}
                    setTaskElementsList={setTaskElementsList}
                    setVisible={setVisible}
                    tags={tags || []}
                />
            </div>
        </div>
    );
}
