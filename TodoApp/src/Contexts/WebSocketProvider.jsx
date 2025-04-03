import {
    React,
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

const SocketContext = createContext(null);

export function WebSocketProvider({ children, listOwner, currentUser }) {
    const socket = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    useEffect(() => {
        if (socket.current) {
            socket.current.close();
        }

        socket.current = new WebSocket(
            "ws://localhost:3000/?listOwner=" +
                JSON.stringify(listOwner) +
                "&currentUser=" +
                JSON.stringify(currentUser)
        );

        socket.current.addEventListener("open", () => {
            setIsConnected(true);
        });

        socket.current.addEventListener("ping", () => {
            socket.current.pong();
        });

        socket.current.addEventListener("close", () => {
            setIsConnected(false);
        });

        return () => {
            socket.current.close();
            setIsConnected(false);
        };
    }, [listOwner, currentUser]);
    const addWebSocketEventListener = (event, fun) => {
        if (socket.current && socket.current.readyState === 1) {
            socket.current.addEventListener(event, fun);
        } else {
            return;
        }
    };
    return (
        <SocketContext.Provider
            value={{ addWebSocketEventListener, isConnected }}
        >
            {children}
        </SocketContext.Provider>
    );
}

export const useWebSocket = () => useContext(SocketContext);
