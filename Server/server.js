import express from "express";
import cors from "cors";
import db from "./db/conn.js";
const app = express();
const port = 3000;

let collection = db.collection("tasks");

app.use(cors());
app.use(express.json());

app.post("/", async (req, res) => {
    if (!db) {
        res.sendStatus(500);
    } else {
        await collection.insertOne({ ...req.body, _id: req.body.id });
    }
    console.log("Added. New collection: ");
    for await (const task of collection.find({})) {
        console.log(task);
    }
});

app.delete("/", async (req, res) => {
    console.log(req.body.id);
    await collection.deleteOne({ id: req.body.id });
    console.log("Deleted. New collection: ");
    for await (const task of collection.find({})) {
        console.log(task);
    }
});

app.put("/", async (req, res) => {
    const editedTask = req.body;
    await collection.replaceOne({ id: editedTask.id }, editedTask);
    console.log("Edited. New collection: ");
    for await (const task of collection.find({})) {
        console.log(task);
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
