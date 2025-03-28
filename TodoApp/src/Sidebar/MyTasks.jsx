export default function MyTasks({ currentUser, listOwner, setListOwner }) {
    return (
        <>
            <h2>My tasks</h2>
            <hr />
            <a
                href="#"
                className={listOwner.id == currentUser.id ? "activeTeam" : null}
                onClick={() => setListOwner(currentUser)}
            >
                My tasklist
            </a>
        </>
    );
}
