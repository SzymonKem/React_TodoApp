import mongoose from "mongoose";
import Task from "../models/Task.js";
import { broadcastToClients, teams } from "./socket.js";
import List from "../models/List.js";

let msg = "tasksUpdated";

export async function GetTasks(req, res) {
    const owner = JSON.parse(req.query.owner);
    owner.id = new mongoose.Types.ObjectId(owner.id);
    try {
        let currentList = await List.findOne({ "owner.id": owner.id });
        console.log("Current list from getTasks: ", currentList);
        const gotTasks = await Promise.all(
            currentList.tasks.map(async (task) => {
                const foundTask = await Task.findOne({ _id: task });
                if (foundTask !== null && foundTask !== undefined) {
                    return foundTask;
                }
            })
        );
        console.log("Got tasks: ", gotTasks);
        res.status(200).json({
            status: "success",
            data: gotTasks,
            message: "Successfully got tasks",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "An unexpected error happened " + err.message,
        });
    }
}

export async function Add(req, res) {
    const task = req.body;
    try {
        const newTask = new Task(task);
        const savedTask = await newTask.save();
        console.log(task.owner);
        console.log(teams);
        console.log("logging task");
        console.log(task);
        const list = await List.findOneAndUpdate(
            { _id: task.list },
            { $push: { tasks: savedTask._id } }
        );
        console.log("logging list: ");
        console.log(list);
        if (list.owner.type === "team") {
            broadcastToClients(list.owner.id, msg);
        }
        res.status(200).json({
            status: "success",
            message: "successfully added task",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "An unexpected error happened " + err.message,
        });
    }
}

export async function Edit(req, res) {
    const task = req.body;
    task.list = new mongoose.Types.ObjectId(task.list);
    try {
        await Task.replaceOne({ id: task.id, list: task.list }, task);
        const list = await List.findOne({ _id: task.list });
        if (list.owner.type === "team") {
            broadcastToClients(list.owner.id, msg);
        }
        res.status(200).json({
            status: "success",
            message: "Succesfully edited task",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "An unexpected error happened " + err.message,
        });
    }
}

export async function Delete(req, res) {
    const task = req.body;
    task.list = new mongoose.Types.ObjectId(task.list);
    console.log(task);
    try {
        const deletedTask = await Task.findOneAndDelete({
            id: task.id,
            list: task.list,
        });
        console.log("logging task");
        console.log(task);
        const list = await List.findOneAndUpdate(
            { _id: task.list },
            { $pull: { tasks: deletedTask._id } }
        );
        console.log("logging list");
        console.log(list);
        if (list.owner.type === "team") {
            broadcastToClients(list.owner.id, msg);
        }
        res.status(200).json({
            status: "success",
            message: "Successfully deleted task",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "An unexpected error happened " + err.message,
        });
    }
}
