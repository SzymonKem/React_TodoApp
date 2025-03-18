import { useRef } from "react";

export default function LoginPage({ setIsLoggedIn }) {
    const usernameRef = useRef(null);
    const passRef = useRef(null);

    async function handleSubmit(e) {
        e.preventDefault();
        if (e.nativeEvent.submitter.name === "register") {
            fetch("http://localhost:3000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: usernameRef.current.value.trim(),
                    password: passRef.current.value.trim(),
                }),
            }).then((response) =>
                response.status == 200 ? setIsLoggedIn(true) : null
            );
        } else if (e.nativeEvent.submitter.name === "login") {
            fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: usernameRef.current.value.trim(),
                    password: passRef.current.value.trim(),
                }),
            }).then((response) =>
                response.status == 200 ? setIsLoggedIn(true) : null
            );
        }
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
