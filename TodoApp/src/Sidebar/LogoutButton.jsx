export default function LogoutButton({ setIsLoggedIn }) {
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
