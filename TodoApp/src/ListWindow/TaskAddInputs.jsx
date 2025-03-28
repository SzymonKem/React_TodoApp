import { useRef, useState } from "react";
export default function TaskAddInputs({
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
