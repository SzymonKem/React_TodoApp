import express from "express";
import { GetTasks, Add, Edit, Delete } from "../controllers/tasks.js";

const router = express.Router();

router.get("/", GetTasks);
router.post("/", Add);
router.put("/", Edit);
router.delete("/", Delete);

export default router;
