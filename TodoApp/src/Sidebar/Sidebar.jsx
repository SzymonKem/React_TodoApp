import "./Sidebar.css";
import { useEffect, useState } from "react";

export default function Sidebar({ setIsLoggedIn, setListOwner, currentUser }) {
    return (
        <>
            <div className="sidebar">
                <h2>ToDo app</h2>
                <LogoutButton setIsLoggedIn={setIsLoggedIn} />
                <nav>
                    <MyTasks />
                    <Teams
                        currentUser={currentUser}
                        setListOwner={setListOwner}
                    />
                </nav>
            </div>
        </>
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

function MyTasks() {
    return (
        <>
            <h2>My tasks</h2>
            <hr />
            <a href="#">My tasklist</a>
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
