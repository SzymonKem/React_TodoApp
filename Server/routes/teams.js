import express from "express";
import { CreateTeam, GetTeams } from "../controllers/teams.js";

const router = express.Router();
router.post("/create", CreateTeam);
router.get("/get", GetTeams);

export default router;
