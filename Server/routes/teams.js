import express from "express";
import {
    CreateTeam,
    GetTeams,
    GetTeamUsers,
    AddUserToTeam,
} from "../controllers/teams.js";

const router = express.Router();
router.post("/create", CreateTeam);
router.get("/get", GetTeams);
router.get("/getUsers", GetTeamUsers);
router.post("/addUser", AddUserToTeam);

export default router;
