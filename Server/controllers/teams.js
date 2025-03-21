import mongoose from "mongoose";
import Team from "../models/Team.js";
import User from "../models/User.js";

export async function CreateTeam(req, res) {
    const team = req.body;
    console.log(team);
    try {
        const newTeam = new Team(team);
        console.log(newTeam);
        const savedTask = await newTeam.save();
        res.status(200).json({
            status: "success",
            data: savedTask._id,
            message: "successfully created team",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Unexpected error happened " + err.message,
        });
    }
}

export async function GetTeams(req, res) {
    const userId = req.query.userId;
    // console.log(userId);
    try {
        const gotTeams = await Team.find({ users: userId });
        // console.log(gotTeams);
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
        // console.log(foundTeam.owner);
        // console.log(ownerId);

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
    // console.log(req.body);
    try {
        const user = await User.findOne({ username: req.body.username });
        // console.log(user);
        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "User not found",
            });
        }
        // console.log(user._id);
        await Team.updateOne(
            { _id: req.body.teamId },
            { $push: { users: user._id.toString() } }
        );
        const test = await Team.findOne({ _id: req.body.teamId });
        // console.log(test);
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
    console.log(req.body);
    try {
        const foundUser = await User.findOne({ username: req.body.user });
        const idToDelete = foundUser._id.toString();
        console.log(idToDelete);
        await Team.updateOne(
            { _id: req.body.teamId },
            { $pull: { users: idToDelete } }
        );
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
