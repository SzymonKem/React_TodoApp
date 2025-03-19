import { useRef } from "react";

export default function LoginPage({ setIsLoggedIn, setCurrentUserId }) {
    const usernameRef = useRef(null);
    const passRef = useRef(null);

    async function handleSubmit(e) {
        e.preventDefault();
        const submitter = e.nativeEvent.submitter.name;
        fetch("http://localhost:3000/auth/" + submitter, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: usernameRef.current.value.trim(),
                password: passRef.current.value.trim(),
            }),
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => data.data[0].username)
            .then((username) =>
                fetch(
                    "http://localhost:3000/auth/getuser/?username=" + username
                )
            )
            .then((response) => response.json())
            .then((data) => {
                setCurrentUserId(data.data.userId);
                setIsLoggedIn(true);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }
    return (
        <form onSubmit={handleSubmit} method="post">
            <input type="text" placeholder="Username" ref={usernameRef} />
            <br />
            <input type="password" placeholder="Password" ref={passRef} />
            <br />
            <input type="submit" value="Log in" name="login" />
            <input type="submit" value="Register" name="register" />
        </form>
    );
}
