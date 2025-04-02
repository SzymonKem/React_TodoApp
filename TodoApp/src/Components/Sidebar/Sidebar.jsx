import "./Sidebar.css";
import UserIcon from "./UserIcon";
import MyTasks from "./MyTasks";
import Teams from "./Teams";
import UserList from "./UserList";
export default function Sidebar({
    setIsLoggedIn,
    setListOwner,
    currentUser,
    listOwner,
}) {
    return (
        <div className="sidebar">
            <UserIcon currentUser={currentUser} setIsLoggedIn={setIsLoggedIn} />
            <h2>ToDo app</h2>
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
                />
            </nav>
            {listOwner.type === "team" && (
                <UserList listOwner={listOwner} currentUser={currentUser} />
            )}
        </div>
    );
}
