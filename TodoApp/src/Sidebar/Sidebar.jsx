import "./Sidebar.css";
import LogoutButton from "./LogoutButton";
import MyTasks from "./MyTasks";
import Teams from "./Teams";
import UserList from "./UserList";
export default function Sidebar({
    setIsLoggedIn,
    setListOwner,
    currentUser,
    listOwner,
    teamUpdateHandler,
    userUpdateHandler,
}) {
    return (
        <div className="sidebar">
            <h2>ToDo app</h2>
            <LogoutButton setIsLoggedIn={setIsLoggedIn} />
            <nav>
                <MyTasks
                    currentUser={currentUser}
                    listOwner={listOwner}
                    setListOwner={setListOwner}
                />
                <Teams
                    currentUser={currentUser}
                    listOwner={listOwner}
                    setListOwner={setListOwner}
                    teamUpdateHandler={teamUpdateHandler}
                />
            </nav>
            {listOwner.type === "team" && (
                <UserList
                    listOwner={listOwner}
                    currentUser={currentUser}
                    userUpdateHandler={userUpdateHandler}
                />
            )}
        </div>
    );
}
