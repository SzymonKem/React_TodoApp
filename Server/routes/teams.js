import express from "express";
import {
    CreateTeam,
    GetTeams,
    GetTeamUsers,
    AddUserToTeam,
    DeleteUserFromTeam,
} from "../controllers/teams.js";

const router = express.Router();
router.post("/create", CreateTeam);
router.get("/get", GetTeams);
router.get("/getUsers", GetTeamUsers);
router.post("/addUser", AddUserToTeam);
router.delete("/deleteUser", DeleteUserFromTeam);

export default router;
