import mongoose from "mongoose";
import Task from "../models/Task.js";

let teams = {};

export function Socket(ws, req) {
    console.log("connected");
    console.log(req.query.listOwner);
    const owner = JSON.parse(req.query.listOwner);
    console.log(owner);
    if (owner.type == "team") {
        const teamId = owner.id;
        if (!teams[teamId]) {
            teams[teamId] = new Set();
            console.log(teams[teamId]);
        }

        teams[teamId].add(ws);
        console.log(`Client connected to team: ${teamId}`);
        ws.on("close", () => {
            teams[teamId].delete(ws);
            console.log(`Client disconnected from team: ${teamId}`);
            if (teams[teamId].size == 0) {
                delete teams[teamId];
            }
        });
    }
}

function broadcastToClients(teamId) {
    console.log(teams);
    if (teams[teamId]) {
        teams[teamId].forEach((ws) => {
            console.log("sent");
            if (ws.readyState === 1) {
                ws.send("Updated list");
            }
        });
    }
}

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
            broadcastToClients(task.owner.id);
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
            broadcastToClients(task.owner.id);
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
            broadcastToClients(task.owner.id);
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
