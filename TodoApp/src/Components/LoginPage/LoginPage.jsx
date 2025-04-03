import "./LoginPage.css";
import { useEffect, useRef, useState } from "react";

export default function LoginPage({
    setIsLoggedIn,
    setCurrentUser,
    setListOwner,
}) {
    const [validationArray, setValidationArray] = useState([]);
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
                setIsLoggedIn(data.data.logIn);
                setCurrentUser({
                    type: "user",
                    id: data.data.user,
                    list: data.data.list,
                });
                setListOwner({
                    type: "user",
                    id: data.data.user,
                    list: data.data.list,
                });
            } catch (err) {
                console.log(err.message);
            }
        };
        checkRemembered();
    }, [setCurrentUser, setIsLoggedIn, setListOwner]);

    async function handleSubmit(e) {
        e.preventDefault();
        setValidationArray([]); // Reset errors on each attempt
        const submitter = e.nativeEvent.submitter.name;

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
            if (response.ok) {
                setCurrentUser({
                    type: "user",
                    id: data.data.foundUserId,
                    list: data.data.usersList,
                });
                setListOwner({
                    type: "user",
                    id: data.data.foundUserId,
                    list: data.data.usersList,
                });
                setIsLoggedIn(true);
            } else {
                setValidationArray(() => {
                    const newErrors = new Set([
                        ...(data.errors?.errors?.map((err) => err.msg) || []),
                        data.message || "", // Add res.message if it exists
                    ]);
                    return [...newErrors].filter((err) => err !== ""); // Remove empty strings
                });
                setTimeout(() => setValidationArray([]), 2000);
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    return (
        <form onSubmit={handleSubmit} method="post" className="loginForm">
            <input
                type="text"
                placeholder="Username"
                ref={usernameRef}
                className="loginUsername"
            />
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
            <div>
                {validationArray.map((err, index) => (
                    <p key={index} className="errorElement">
                        {err}
                    </p>
                ))}
            </div>
            <input type="submit" value="Log in" name="login" />
            <input type="submit" value="Register" name="register" />
        </form>
    );
}
