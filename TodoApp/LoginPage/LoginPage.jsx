import "./LoginPage.css";
import { useEffect, useRef } from "react";

export default function LoginPage({ setIsLoggedIn, setCurrentUserId }) {
    const usernameRef = useRef(null);
    const passRef = useRef(null);
    const checkboxRef = useRef(null);
    useEffect(() => {
        const checkRemembered = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/auth/rememberedUser",
                    {
                        method: "POST",
                        credentials: "include",
                    }
                );
                const data = await response.json();
                setIsLoggedIn(data.data[0]);
                setCurrentUserId(data.data[1]);
            } catch (err) {
                console.log(err.message);
            }
        };
        checkRemembered();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        const submitter = e.nativeEvent.submitter.name;
        // console.log(checkboxRef);
        // console.log(checkboxRef.current.checked);

        try {
            const response = await fetch(
                "http://localhost:3000/auth/" + submitter,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        username: usernameRef.current.value.trim(),
                        password: passRef.current.value.trim(),
                        isChecked: checkboxRef.current.checked,
                    }),
                }
            );

            const data = await response.json();
            setCurrentUserId(data.data[0].foundUserId);
            setIsLoggedIn(true);
        } catch (err) {
            console.log(err.message);
        }
    }

    return (
        <form onSubmit={handleSubmit} method="post" className="loginForm">
            <input type="text" placeholder="Username" ref={usernameRef} />
            <br />
            <input type="password" placeholder="Password" ref={passRef} />
            <br />
            <div className="rememberMe">
                <input
                    type="checkbox"
                    id="remember"
                    value="1"
                    ref={checkboxRef}
                />
                <label htmlFor="remember">Remember me</label>
            </div>
            <input type="submit" value="Log in" name="login" />
            <input type="submit" value="Register" name="register" />
        </form>
    );
}
