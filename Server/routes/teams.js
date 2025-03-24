import express from "express";
import {
    CreateTeam,
    GetTeams,
    GetTeamUsers,
    AddUserToTeam,
    DeleteUserFromTeam,
    DeleteTeam,
} from "../controllers/teams.js";

const router = express.Router();
router.post("/create", CreateTeam);
router.get("/get", GetTeams);
router.get("/getUsers", GetTeamUsers);
router.post("/addUser", AddUserToTeam);
router.delete("/deleteUser", DeleteUserFromTeam);
router.delete("/delete", DeleteTeam);

export default router;
