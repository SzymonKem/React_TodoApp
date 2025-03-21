import Team from "../models/Team.js";

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
