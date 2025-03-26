import mongoose from "mongoose";
import Task from "../models/Task.js";
import { broadcastToClients, teams } from "./socket.js";

let msg = "tasksUpdated";

export async function GetTasks(req, res) {
    const owner = JSON.parse(req.query.owner);
    owner.id = new mongoose.Types.ObjectId(owner.id);
    try {
        const gotTasks = await Task.find({
            owner: owner,
        });
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
        await newTask.save();
        console.log(task.owner);
        console.log(teams);
        if (task.owner.type === "team") {
            broadcastToClients(task.owner.id, msg);
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
    task.owner.id = new mongoose.Types.ObjectId(task.owner.id);
    try {
        await Task.replaceOne({ id: task.id, owner: task.owner }, task);
        if (task.owner.type === "team") {
            broadcastToClients(task.owner.id, msg);
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
    task.owner.id = new mongoose.Types.ObjectId(task.owner.id);
    console.log(task);
    try {
        await Task.deleteOne({
            id: task.id,
            owner: task.owner,
        });
        if (task.owner.type === "team") {
            broadcastToClients(task.owner.id, msg);
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
