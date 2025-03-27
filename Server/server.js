import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import expressWs from "express-ws";
import { mongoose } from "mongoose";
import Router from "./routes/index.js";
import Auth from "./routes/auth.js";
import Tasks from "./routes/tasks.js";
import Teams from "./routes/teams.js";
import { Socket } from "./controllers/socket.js";
const server = express();
const webSocket = expressWs(server);
const port = 3000;

server.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
server.use(express.json());
server.use(cookieParser());
server.use(
    session({
        secret: "sessionSecret222",
        resave: false,
        saveUninitialized: true,
        cookie: { httpOnly: true, secure: false },
    })
);

mongoose
    .connect("mongodb://127.0.0.1:27017/taskList")
    .then(console.log("Connected to database"))
    .catch((err) => console.log(err));

Router(server);
server.ws("/", Socket);
const pingInterval = setInterval(() => {
    // console.log(webSocket.getWss("/").clients);
    webSocket.getWss("/").clients.forEach((ws) => {
        if (!ws.isAlive) {
            console.log("inactive connection");
            ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
    });
}, 5000);
server.use("/auth", Auth);
server.use("/tasks", Tasks);
server.use("/teams", Teams);

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
