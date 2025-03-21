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
        console.log(foundTeam);
        foundTeam.users = await Promise.all(
            foundTeam.users.map(async (user) => {
                const foundUser = await User.findOne({ _id: user });
                console.log(foundUser.username);
                return foundUser.username;
            })
        );
        const owner = await User.findOne({ _id: foundTeam.owner });
        foundTeam.owner = owner.username;
        console.log(foundTeam.owner);

        res.status(200).json({
            status: "success",
            data: foundTeam,
            message: "successfully got current team",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Unexpected error happened: " + err.message,
        });
    }
}
