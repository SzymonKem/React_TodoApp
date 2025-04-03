import { useState, useEffect, useRef } from "react";
import { useWebSocket } from "../../Contexts/WebSocketProvider";
import { useOutsideClick } from "../../hooks/useOutsideClick";

export default function Teams({
    currentUser,
    listOwner,
    setListOwner,
    // teamUpdateHandler,
}) {
    const [addingTeam, setAddingTeam] = useState(false);
    const [creationInputValue, setcreationInputValue] = useState("");
    const [teamsList, setTeamsList] = useState([]);
    const teamFormRef = useRef(null);
    const { addWebSocketEventListener, isConnected } = useWebSocket();
    useEffect(() => {
        const getTeams = async () => {
            if (!isConnected) return;
            try {
                const response = await fetch(
                    "http://localhost:3000/teams/get?userId=" + currentUser.id
                );
                const data = await response.json();
                const receivedTeamsList = data.data;
                const removed =
                    listOwner.type === "team" &&
                    !receivedTeamsList.some(
                        (team) => team._id === listOwner.id
                    );
                setTeamsList(receivedTeamsList);
                if (removed) {
                    setListOwner(currentUser);
                }
            } catch (err) {
                console.log(err.message);
            }
        };
        addWebSocketEventListener("message", (event) => {
            if (event.data == "teamsUpdated") {
                getTeams();
            }
        });
        getTeams();
    }, [
        listOwner,
        addWebSocketEventListener,
        currentUser,
        setListOwner,
        isConnected,
    ]);
    async function handleTeamAdd(currentUser, e) {
        e.preventDefault();
        const newTeam = {
            teamName: creationInputValue,
            owner: currentUser.id,
            users: [currentUser.id],
        };
        try {
            const response = await fetch("http://localhost:3000/teams/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTeam),
            });
            const data = await response.json();
            const receivedTeam = data.data;
            setTeamsList([...teamsList, receivedTeam]);
        } catch (err) {
            console.log(err.message);
        }
        setAddingTeam(false);
    }
    useOutsideClick(teamFormRef, setAddingTeam, ".addTeam");
    async function handleTeamDelete(team) {
        try {
            await fetch("http://localhost:3000/teams/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ teamId: team._id }),
            });
            setListOwner(currentUser);
        } catch (err) {
            console.log(err.message);
        }
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
                    className="addIcon"
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
                            className={
                                team._id == listOwner.id ? "activeTeam" : null
                            }
                            onClick={() =>
                                setListOwner({
                                    type: "team",
                                    id: team._id,
                                    list: team.list,
                                })
                            }
                        >
                            {team.teamName}
                        </a>
                        {currentUser.id == team.owner && (
                            <a
                                href="#"
                                onClick={() => {
                                    handleTeamDelete(team);
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
                {addingTeam && (
                    <form
                        action="#"
                        method="post"
                        onClick={(e) => e.stopPropagation}
                        onSubmit={(e) => handleTeamAdd(currentUser, e)}
                        ref={teamFormRef}
                    >
                        <input
                            required
                            type="text"
                            placeholder="Team name"
                            className="teamAddInput"
                            onChange={(e) =>
                                setcreationInputValue(e.target.value)
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
                                onClick={() => setAddingTeam(false)}
                            />
                        </div>
                    </form>
                )}
            </ul>
        </>
    );
}
