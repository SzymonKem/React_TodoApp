import express from "express";
import { CreateTeam, GetTeams, GetTeamUsers } from "../controllers/teams.js";

const router = express.Router();
router.post("/create", CreateTeam);
router.get("/get", GetTeams);
router.get("/getUsers", GetTeamUsers);

export default router;
