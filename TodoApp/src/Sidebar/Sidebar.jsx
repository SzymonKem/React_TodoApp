import "./Sidebar.css";

export default function Sidebar({ setIsLoggedIn }) {
    return (
        <>
            <div className="sidebar">
                <h2>ToDo app</h2>
                <LogoutButton setIsLoggedIn={setIsLoggedIn} />
                <SidebarNav />
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

function SidebarNav() {
    return (
        <nav>
            <MyTasks />
            <Teams />
        </nav>
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

function Teams() {
    return (
        <>
            <h2>My teams</h2>
            <a href="#" className="addTeam">
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
                        d="M12 4.5v15m7.5-7.5h-15"
                    />
                </svg>
                <span>Create a team</span>
            </a>
            <hr />
            <ul className="teamsList"></ul>
        </>
    );
}
