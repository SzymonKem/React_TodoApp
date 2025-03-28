import { useState, useRef, useEffect } from "react";
export default function Filters({ setRenderItems, tags, setTags, listOwner }) {
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
