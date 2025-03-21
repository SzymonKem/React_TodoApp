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
    }, [addingUser]);

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
                    <li key={user}>{user}</li>
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
