import express from "express";
import cors from "cors";
import { mongoose } from "mongoose";
import Router from "./routes/index.js";
import Auth from "./routes/auth.js";
import Tasks from "./routes/tasks.js";
const server = express();
const port = 3000;

server.use(cors());
server.use(express.json());

mongoose
    .connect("mongodb://127.0.0.1:27017/taskList")
    .then(console.log("Connected to database"))
    .catch((err) => console.log(err));

// server.use("/", Router);
server.use("/auth", Auth);
server.use("/tasks", Tasks);

// app.get("/", async (req, res) => {
//     if (!db) {
//         res.sendStatus(500);
//     } else {
//         const foundTasks = await collection.find({}).toArray();
//         res.send(JSON.stringify(foundTasks));
//     }

// });

// app.post("/", async (req, res) => {
//     if (!db) {
//         res.sendStatus(500);
//     } else {
//         await collection.insertOne({ ...req.body, _id: req.body.id });
//         console.log("Added. New collection: ");
//         for await (const task of collection.find({})) {
//             console.log(task);
//         }
//         res.sendStatus(200);
//     }
// });

// app.delete("/", async (req, res) => {
//     if (!db) {
//         res.sendStatus(500);
//     } else {
//         await collection.deleteOne({ _id: req.body.id });
//         console.log("Deleted. New collection: ");
//         for await (const task of collection.find({})) {
//             console.log(task);
//         }
//         res.sendStatus(200);
//     }
// });

// app.put("/", async (req, res) => {
//     if (!db) {
//         res.sendStatus(500);
//     } else {
//         const editedTask = req.body;
//         await collection.replaceOne({ _id: editedTask.id }, editedTask);
//         console.log("Edited. New collection: ");
//         for await (const task of collection.find({})) {
//             console.log(task);
//         }
//         res.sendStatus(200);
//     }
// });

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
