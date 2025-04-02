import { useState, useRef, useEffect } from "react";
import LogoutButton from "./LogoutButton";

export default function UserIcon({ currentUser, setIsLoggedIn }) {
    console.log("CURRENT USER: ", currentUser);
    const [logoutVisible, setLogoutVisible] = useState(false);
    const userIconRef = useRef(null);

    useEffect(() => {
        function handleOutsideClick(e) {
            if (!userIconRef.current.contains(e.target)) {
                setLogoutVisible(false);
            }
        }
        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, []);

    return (
        <div className="userIcon" ref={userIconRef}>
            <a
                href="#"
                onClick={(e) => {
                    {
                        e.preventDefault();
                        setLogoutVisible(!logoutVisible);
                    }
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
                        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                </svg>
            </a>
            {logoutVisible && <LogoutButton setIsLoggedIn={setIsLoggedIn} />}
        </div>
    );
}
