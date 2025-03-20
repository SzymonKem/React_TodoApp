import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import { mongoose } from "mongoose";
import Router from "./routes/index.js";
import Auth from "./routes/auth.js";
import Tasks from "./routes/tasks.js";
const server = express();
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
server.use("/auth", Auth);
server.use("/tasks", Tasks);

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
