import express from "express";
import {
    CreateTeam,
    GetTeams,
    GetTeamUsers,
    AddUserToTeam,
    DeleteUserFromTeam,
    DeleteTeam,
    AddTag,
    GetTags,
    DeleteTag,
} from "../controllers/teams.js";

const router = express.Router();
router.post("/create", CreateTeam);
router.get("/get", GetTeams);
router.get("/getUsers", GetTeamUsers);
router.post("/addUser", AddUserToTeam);
router.delete("/deleteUser", DeleteUserFromTeam);
router.delete("/delete", DeleteTeam);
router.get("/getTags", GetTags);
router.post("/addTag", AddTag);
router.delete("/deleteTag", DeleteTag);

export default router;
