import "./Sidebar.css";
import { useEffect, useState } from "react";

export default function Sidebar({
    setIsLoggedIn,
    setListOwner,
    currentUser,
    listOwner,
}) {
    return (
        <div className="sidebar">
            <h2>ToDo app</h2>
            <LogoutButton setIsLoggedIn={setIsLoggedIn} />
            <nav>
                <MyTasks
                    currentUser={currentUser}
                    setListOwner={setListOwner}
                />
                <Teams currentUser={currentUser} setListOwner={setListOwner} />
            </nav>
            {listOwner.type === "team" && (
                <UserList listOwner={listOwner} currentUser={currentUser} />
            )}
        </div>
    );
}

function LogoutButton({ setIsLoggedIn }) {
    async function handleLogoutClick() {
        await fetch("http://localhost:3000/auth/logout", {
            method: "DELETE",
            credentials: "include",
        });
        setIsLoggedIn(false);
    }
    return (
        <button className="logout" onClick={handleLogoutClick}>
            Logout
        </button>
    );
}

function MyTasks({ currentUser, setListOwner }) {
    return (
        <>
            <h2>My tasks</h2>
            <hr />
            <a href="#" onClick={() => setListOwner(currentUser)}>
                My tasklist
            </a>
        </>
    );
}

function Teams({ currentUser, setListOwner }) {
    const [addingTeam, setAddingTeam] = useState(false);
    const [creationInputValue, setcreationInputValue] = useState("");
    const [teamsList, setTeamsList] = useState([]);
    useEffect(() => {
        const getTeams = async () => {
            try {
                console.log(currentUser.id);
                const response = await fetch(
                    "http://localhost:3000/teams/get?userId=" + currentUser.id
                );
                const data = await response.json();
                const receivedTeamsList = data.data;
                console.log(receivedTeamsList);
                setTeamsList(receivedTeamsList);
            } catch (err) {
                console.log(err.message);
            }
        };

        getTeams();
    }, []);
    async function handleTeamAdd(currentUser, e) {
        e.preventDefault();
        console.log("current user: " + currentUser);
        console.log("creationInputValue: " + creationInputValue);
        const newTeam = {
            teamName: creationInputValue,
            owner: currentUser.id,
            users: [currentUser.id],
        };
        console.log(newTeam);
        try {
            const response = await fetch("http://localhost:3000/teams/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTeam),
            });
            const data = await response.json();
            newTeam._id = data.data;
            console.log(newTeam);
            setTeamsList([...teamsList, newTeam]);
        } catch (err) {
            console.log(err.message);
        }
        setAddingTeam(false);
    }

    return (
        <>
            <h2>My teams</h2>
            <a href="#" className="addTeam" onClick={() => setAddingTeam(true)}>
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
                <span>Create a team</span>
            </a>
            <hr />
            <ul className="teamsList">
                {teamsList.map((team) => (
                    <li key={team._id}>
                        <a
                            href="#"
                            onClick={() =>
                                setListOwner({ type: "team", id: team._id })
                            }
                        >
                            {team.teamName}
                        </a>
                    </li>
                ))}
                {addingTeam && (
                    <form
                        action="#"
                        method="post"
                        onSubmit={(e) => handleTeamAdd(currentUser, e)}
                    >
                        <input
                            required
                            type="text"
                            placeholder="Team name"
                            onChange={(e) =>
                                setcreationInputValue(e.target.value)
                            }
                        />
                        <br />
                        <input
                            type="button"
                            value="Cancel"
                            onClick={() => setAddingTeam(false)}
                        />
                        <input type="submit" value="Confirm" />
                    </form>
                )}
            </ul>
        </>
    );
}

function UserList({ listOwner, currentUser }) {
    const [currentTeam, setCurrentTeam] = useState({
        list: [],
        owner: "",
        ownerId: "",
    });
    const [addingUser, setAddingUser] = useState(false);
    const [creationInputValue, setCreationInputValue] = useState("");
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
            await fetch("http://localhost:3000/teams/addUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: creationInputValue.trim(),
                    teamId: listOwner.id,
                }),
            });
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
    return (
        <div className="userListContainer">
            {console.log(currentTeam)}
            <h2>Owner:</h2>
            <span>{currentTeam.owner}</span>
            <h3>Users: </h3>
            {console.log(currentUser.id)}
            {console.log(currentTeam.ownerId)}
            {currentUser.id == currentTeam.ownerId && (
                <a href="#" onClick={() => setAddingUser(true)}>
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
                    >
                        <input
                            required
                            type="text"
                            placeholder="username"
                            onChange={(e) =>
                                setCreationInputValue(e.target.value)
                            }
                        />
                        <br />
                        <input
                            type="button"
                            value="Cancel"
                            onClick={() => setAddingUser(false)}
                        />
                        <input type="submit" value="Confirm" />
                    </form>
                )}
            </ul>
        </div>
    );
}
