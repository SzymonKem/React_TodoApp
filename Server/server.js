import express from "express";
import cors from "cors";
import db from "./db/conn.js";
const app = express();
const port = 3000;

let collection = db.collection("tasks");

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    if (!db) {
        res.sendStatus(500);
    } else {
        const foundTasks = await collection.find({}).toArray();
        res.send(JSON.stringify(foundTasks));
    }
});

app.post("/", async (req, res) => {
    if (!db) {
        res.sendStatus(500);
    } else {
        await collection.insertOne({ ...req.body, _id: req.body.id });
        console.log("Added. New collection: ");
        for await (const task of collection.find({})) {
            console.log(task);
        }
        res.sendStatus(200);
    }
});

app.delete("/", async (req, res) => {
    if (!db) {
        res.sendStatus(500);
    } else {
        await collection.deleteOne({ _id: req.body.id });
        console.log("Deleted. New collection: ");
        for await (const task of collection.find({})) {
            console.log(task);
        }
        res.sendStatus(200);
    }
});

app.put("/", async (req, res) => {
    if (!db) {
        res.sendStatus(500);
    } else {
        const editedTask = req.body;
        await collection.replaceOne({ _id: editedTask.id }, editedTask);
        console.log("Edited. New collection: ");
        for await (const task of collection.find({})) {
            console.log(task);
        }
        res.sendStatus(200);
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
