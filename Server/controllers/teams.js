import mongoose from "mongoose";
import Team from "../models/Team.js";
import User from "../models/User.js";
import Task from "../models/Task.js";
import List from "../models/List.js";
import { broadcastToClients, teams, users } from "./socket.js";

let msg = "teamsUpdated";

export async function CreateTeam(req, res) {
    const team = req.body;
    try {
        const newTeam = new Team(team);
        const savedTeam = await newTeam.save();
        const newList = new List({
            owner: { type: "team", id: savedTeam._id },
            tags: ["in progress", "done"],
            tasks: [],
        });
        const savedList = await newList.save();
        const updatedTeam = await Team.findOneAndUpdate(
            { _id: savedTeam._id },
            { $set: { list: savedList._id } },
            { new: true }
        );
        res.status(200).json({
            status: "success",
            data: updatedTeam,
            message: "successfully created team",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Unexpected error happened " + err.message,
        });
    }
}

export async function DeleteTeam(req, res) {
    const teamId = new mongoose.Types.ObjectId(req.body.teamId);
    try {
        const teamsUsers = await Team.findOne({ _id: teamId });
        const userList = teamsUsers.users;
        await Team.deleteOne({ _id: teamId });
        await Task.deleteMany({
            owner: await List.findOne({ _id: req.body.teamId })._id,
        });
        await List.deleteOne({ owner: { type: "team", id: req.body.teamId } });
        broadcastToClients(req.body.teamId, msg, userList);
        res.status(200).json({
            status: "successs",
            message: "successfully deleted team",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Unexpected error happened: " + err.message,
        });
    }
}

export async function GetTeams(req, res) {
    const userId = req.query.userId;
    try {
        const gotTeams = await Team.find({ users: userId });
        res.status(200).json({
            status: "Success",
            data: gotTeams,
            message: "Successfully got Teams",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Unexpected error happened: " + err.message,
        });
    }
}

export async function GetTeamUsers(req, res) {
    const teamId = req.query.teamId;
    try {
        let foundTeam = await Team.findOne({ _id: teamId }).lean();
        foundTeam.users = await Promise.all(
            foundTeam.users.map(async (user) => {
                const foundUser = await User.findOne({ _id: user });
                return foundUser.username;
            })
        );
        const owner = await User.findOne({ _id: foundTeam.owner });
        const ownerId = owner._id;
        foundTeam.owner = owner.username;

        res.status(200).json({
            status: "success",
            data: { ...foundTeam, ownerId: ownerId },
            message: "successfully got current team",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Unexpected error happened: " + err.message,
        });
    }
}

export async function AddUserToTeam(req, res) {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "User not found",
            });
        }
        let teamsUsers = await Team.findOne({ _id: req.body.teamId });
        let userList = teamsUsers.users;
        if (userList.includes(user._id)) {
            return res.status(400).json({
                status: "failed",
                message: "This user is already in the team",
            });
        }
        await Team.updateOne(
            { _id: req.body.teamId },
            { $push: { users: user._id.toString() } }
        );
        teamsUsers = await Team.findOne({ _id: req.body.teamId });
        userList = teamsUsers.users;
        broadcastToClients(req.body.teamId, msg, userList);
        return res.status(200).json({
            status: "success",
            message: "successfully added user to team",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "An unexpected error happened: " + err.message,
        });
    }
}

export async function DeleteUserFromTeam(req, res) {
    try {
        const foundUser = await User.findOne({ username: req.body.user });
        const idToDelete = foundUser._id.toString();
        const teamsUsers = await Team.findOne({ _id: req.body.teamId });
        const userList = teamsUsers.users;
        await Team.updateOne(
            { _id: req.body.teamId },
            { $pull: { users: idToDelete } }
        );
        broadcastToClients(req.body.teamId, msg, userList);
        res.status(200).json({
            status: "success",
            message: "successfully removed user from team",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "An unexpected error happened: " + err.message,
        });
    }
}

export async function GetTags(req, res) {
    try {
        const list = await List.findOne({ _id: req.query.list });
        res.status(200).json({
            status: "success",
            data: list.tags,
            message: "successfully got tasks",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Unexpected error happened: " + err.message,
        });
    }
}

export async function AddTag(req, res) {
    try {
        const list = await List.findOne({ _id: req.body.list });
        if (list.tags.includes(req.body.tagName)) {
            return res.status(400).json({
                status: "failed",
                message: "This tag already exists in this list",
            });
        }
        await List.updateOne(
            { _id: req.body.list },
            { $push: { tags: req.body.tagName } }
        );
        if (list.owner.type == "team") {
            broadcastToClients(list.owner.id, "tagsUpdated");
        }
        return res.status(200).json({
            status: "success",
            message: "successfully added tag to list",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Unexpected error happened: " + err.message,
        });
    }
}
export async function DeleteTag(req, res) {
    try {
        const list = await List.findOneAndUpdate(
            { _id: req.body.list },
            { $pull: { tags: req.body.tagName } }
        );

        await Task.updateMany(
            { tags: req.body.tagName },
            { $pull: { tags: req.body.tagName } }
        );
        if (list.owner.type == "team") {
            broadcastToClients(list.owner.id, "tagsUpdated");
        }
        res.status(200).json({
            status: "success",
            message: "successfully deleted task",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Unexpected error happened: " + err.message,
        });
    }
}
