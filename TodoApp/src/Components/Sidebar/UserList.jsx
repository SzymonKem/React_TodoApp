import { useState, useEffect, useRef } from "react";
import { useOutsideClick } from "../../hooks/useOutsideClick";

export default function UserList({ listOwner, currentUser }) {
    const [currentTeam, setCurrentTeam] = useState({
        list: [],
        owner: "",
        ownerId: "",
    });
    const [addingUser, setAddingUser] = useState(false);
    const [creationInputValue, setCreationInputValue] = useState("");
    const [responseError, setResponseError] = useState("");
    const userFormRef = useRef(null);
    useEffect(() => {
        const getUserList = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/teams/getUsers?teamId=" +
                        listOwner.id
                );
                const data = await response.json();
                const list = data.data.users;
                const owner = data.data.owner;
                const ownerId = data.data.ownerId;
                setCurrentTeam({ list: list, owner: owner, ownerId: ownerId });
            } catch (err) {
                console.log(err.message);
            }
        };
        getUserList();
    }, [addingUser, listOwner]);

    async function handleUserAdd(listOwner, e) {
        e.preventDefault();
        try {
            const response = await fetch(
                "http://localhost:3000/teams/addUser",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: creationInputValue.trim(),
                        teamId: listOwner.id,
                    }),
                }
            );
            const data = await response.json();
            if (!response.ok) {
                setResponseError(data.message);
                setTimeout(() => setResponseError(""), 1500);
            }
            setAddingUser(false);
        } catch (err) {
            console.log(err.message);
        }
    }
    async function handleUserDelete(listOwner, user) {
        try {
            await fetch("http://localhost:3000/teams/deleteUser", {
                method: "delete",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ teamId: listOwner.id, user: user }),
            });
            setCurrentTeam({
                ...currentTeam,
                list: currentTeam.list.filter((listUser) => listUser !== user),
            });
        } catch (err) {
            console.log(err.message);
        }
    }

    useOutsideClick(userFormRef, setAddingUser, ".addUser");
    return (
        <div className="userListContainer">
            <h2>Owner:</h2>
            <span>{currentTeam.owner}</span>
            <h3>Users: </h3>
            {currentUser.id == currentTeam.ownerId && (
                <a
                    href="#"
                    onClick={() => setAddingUser(true)}
                    className="addUser"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="addIcon"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                        />
                    </svg>
                    <span>Add a user</span>
                </a>
            )}
            <hr />
            <ul className="userList">
                {currentTeam.list.map((user) => (
                    <li key={user}>
                        {user}
                        {user !== currentTeam.owner &&
                            currentUser.id == currentTeam.ownerId && (
                                <a
                                    href="#"
                                    onClick={() => {
                                        handleUserDelete(listOwner, user);
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
                                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                        />
                                    </svg>
                                </a>
                            )}
                    </li>
                ))}
                {addingUser && (
                    <form
                        action="#"
                        method="post"
                        onSubmit={(e) => handleUserAdd(listOwner, e)}
                        ref={userFormRef}
                    >
                        <input
                            required
                            type="text"
                            placeholder="username"
                            onChange={(e) =>
                                setCreationInputValue(e.target.value)
                            }
                        />
                        <div className="addButtons">
                            <input
                                type="submit"
                                value="Confirm"
                                className="addConfirm"
                            />
                            <input
                                type="button"
                                value="Cancel"
                                className="addCancel"
                                onClick={() => setAddingUser(false)}
                            />
                        </div>
                    </form>
                )}
                <li className="userResponseError">{responseError}</li>
            </ul>
        </div>
    );
}
