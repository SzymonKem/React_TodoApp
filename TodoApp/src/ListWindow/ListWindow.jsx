import { useState, useRef, useEffect } from "react";
import TaskList from "../TaskList/TaskList";
import Sidebar from "../Sidebar/Sidebar";
import "./ListWindow.css";

export default function ListWindow({ currentUser, setIsLoggedIn }) {
    const [renderItems, setRenderItems] = useState("all");
    const [taskElementsList, setTaskElementsList] = useState([]);
    const [nextId, setNextId] = useState(0);
    const [listOwner, setListOwner] = useState(currentUser);
    const [visible, setVisible] = useState(false);
    const [tags, setTags] = useState(["in progress", "done"]);
    const socket = useRef(null);
    const teamUpdateHandlerRef = useRef(null);
    const userUpdateHandlerRef = useRef(null);

    useEffect(() => {
        socket.current = new WebSocket(
            "ws://localhost:3000?listOwner=" +
                JSON.stringify(listOwner) +
                "&currentUser=" +
                JSON.stringify(currentUser)
        );
        socket.current.addEventListener("open", () => {
            console.log("opened socket connection");
        });
        socket.current.addEventListener("ping", () => {
            console.log("Received ping, sending pong");
            socket.current.pong();
        });
        socket.current.addEventListener("message", (event) => {
            console.log("Event: ", event);
            console.log("Event data: ", event.data);
            if (event.data == "tasksUpdated") {
                getTasks();
            } else if (event.data == "teamsUpdated") {
                console.log("TeamsUpdated");
                teamUpdateHandlerRef.current();
                if (listOwner.type == "team") {
                    userUpdateHandlerRef.current();
                }
            }
        });
        socket.current.addEventListener("close", () => {
            console.log("Connection closed");
        });

        const getTasks = async () => {
            try {
                console.log("Logging listOwner from getTasks:");
                console.log(listOwner);
                const response = await fetch(
                    "http://localhost:3000/tasks/?owner=" +
                        JSON.stringify(listOwner)
                );
                const data = await response.json();
                console.log(data);
                const receivedTaskList = data.data;
                setTaskElementsList(receivedTaskList);
                setNextId(
                    receivedTaskList.length > 0
                        ? receivedTaskList[receivedTaskList.length - 1].id + 1
                        : 0
                );
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        getTasks();
        return () => socket.current.close();
    }, [listOwner]);
    const className = visible ? "listWindow no-scroll" : "listWindow";
    return (
        <div className={className}>
            <Sidebar
                setIsLoggedIn={setIsLoggedIn}
                setListOwner={setListOwner}
                setTaskElementsList={setTaskElementsList}
                currentUser={currentUser}
                listOwner={listOwner}
                teamUpdateHandler={(fun) =>
                    (teamUpdateHandlerRef.current = fun)
                }
                userUpdateHandler={(fun) =>
                    (userUpdateHandlerRef.current = fun)
                }
            />
            <TaskAddPopUp
                nextId={nextId}
                listOwner={listOwner}
                setNextId={setNextId}
                taskElementsList={taskElementsList}
                setTaskElementsList={setTaskElementsList}
                visible={visible}
                setVisible={setVisible}
                tags={tags}
            />
            <div className="inputs">
                <button onClick={() => setVisible(true)} className="addTask">
                    Add task
                </button>
                <Filters
                    setRenderItems={setRenderItems}
                    tags={tags}
                    setTags={setTags}
                    listOwner={listOwner}
                />
            </div>
            <TaskList
                taskElementsList={taskElementsList}
                setTaskElementsList={setTaskElementsList}
                listOwner={listOwner}
                renderItems={renderItems}
            />
        </div>
    );
}

function TaskAddPopUp({
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
                    tags={tags}
                />
            </div>
        </div>
    );
}

function TaskAddInputs({
    nextId,
    listOwner,
    setNextId,
    taskElementsList,
    setTaskElementsList,
    setVisible,
    tags,
}) {
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);
    const [selectedTags, setSelectedTags] = useState(["in progress"]);
    const nameRef = useRef(null);
    const descRef = useRef(null);
    function handleInput() {
        const isInputEmpty = !nameRef.current.value || !descRef.current.value;
        setIsButtonEnabled(!isInputEmpty);
    }
    async function handleAdd(e) {
        e.preventDefault();
        const newTask = {
            id: nextId,
            list: listOwner.list,
            isDone: false,
            name: nameRef.current.value.trim(),
            desc: descRef.current.value.trim(),
            editable: false,
            tags: selectedTags,
        };
        setNextId(nextId + 1);
        setTaskElementsList([...taskElementsList, newTask]);
        await fetch("http://localhost:3000/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTask),
        });
        nameRef.current.value = "";
        descRef.current.value = "";
        handleInput();
        setVisible(false);
        setSelectedTags(["in progress"]);
    }
    return (
        <form method="post" onSubmit={handleAdd} className="taskAddForm">
            <input
                required
                type="text"
                onInput={handleInput}
                // onKeyDown={handleKeyDown}
                placeholder="Add a task name"
                ref={nameRef}
            />
            <input
                required
                type="text"
                onInput={handleInput}
                // onKeyDown={handleKeyDown}
                placeholder="Add a task description"
                ref={descRef}
            />

            <ul className="tagListUl">
                {tags.map(
                    (tag) =>
                        tag != "in progress" &&
                        tag != "done" && (
                            <li
                                key={tag}
                                className={
                                    selectedTags.includes(tag)
                                        ? "selectedTag"
                                        : "unselectedTag"
                                }
                            >
                                <a
                                    href="#"
                                    onClick={() => {
                                        selectedTags.includes(tag)
                                            ? setSelectedTags(
                                                  selectedTags.filter(
                                                      (selectedTag) =>
                                                          selectedTag != tag
                                                  )
                                              )
                                            : setSelectedTags([
                                                  ...selectedTags,
                                                  tag,
                                              ]);
                                        console.log("selected tags");
                                        console.log(selectedTags);
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
                disabled={!isButtonEnabled}
                value="ADD TASK"
                className="taskAddFormSubmit"
            />
        </form>
    );
}

function Filters({ setRenderItems, tags, setTags, listOwner }) {
    const [addingTag, setAddingTag] = useState(false);
    const tagInputRef = useRef(null);
    console.log("tags");
    console.log(tags);
    useEffect(() => {
        const getTags = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/teams/getTags?list=" + listOwner.list
                );
                const data = await response.json();
                setTags(data.data);
            } catch (err) {
                console.log(err.message);
            }
        };
        getTags();
    }, [listOwner]);

    async function handleTagAdd(e) {
        e.preventDefault();
        fetch("http://localhost:3000/teams/addTag", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                list: listOwner.list,
                tagName: tagInputRef.current.value,
            }),
        });
    }
    async function handleTagDelete(tag) {
        try {
            fetch("http://localhost:3000/teams/deleteTag", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ list: listOwner.list, tagName: tag }),
            });
        } catch (err) {
            console.log(err.message);
        }
    }

    return (
        <>
            <div className="tagList">
                <ul className="tagListUl">
                    {console.log("Logging tags: ")}
                    {console.log(tags)}
                    {tags.map((tag) => (
                        <li key={tag} className="filtersTag">
                            {tag != "in progress" && tag != "done" && (
                                <a
                                    href="#"
                                    onClick={() => handleTagDelete(tag)}
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
                                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                        />
                                    </svg>
                                </a>
                            )}
                            <a href="#">{tag}</a>
                        </li>
                    ))}
                    <li className="createTag">
                        {addingTag ? (
                            <form
                                action="#"
                                method="post"
                                onSubmit={(e) => handleTagAdd(e)}
                            >
                                <a href="#" onClick={() => setAddingTag(false)}>
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
                                <input type="text" required ref={tagInputRef} />
                            </form>
                        ) : (
                            <a href="#" onClick={() => setAddingTag(true)}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 4.5v15m7.5-7.5h-15"
                                    />
                                </svg>
                                <span>Create tag</span>
                            </a>
                        )}
                    </li>
                </ul>
            </div>
            <div className="renderControls">
                <button
                    onClick={() => {
                        setRenderItems("all");
                    }}
                >
                    Show all tasks
                </button>
                <button
                    onClick={() => {
                        setRenderItems("inProgress");
                    }}
                >
                    Show tasks in progress
                </button>
                <button
                    onClick={() => {
                        setRenderItems("done");
                    }}
                >
                    Show done tasks
                </button>
            </div>
        </>
    );
}
