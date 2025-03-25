import express from "express";
import expressWs from "express-ws";
import { GetTasks, Add, Edit, Delete, Socket } from "../controllers/tasks.js";

const router = express.Router();
expressWs(router);
router.ws("/", Socket);

router.get("/", GetTasks);
router.post("/", Add);
router.put("/", Edit);
router.delete("/", Delete);

export default router;
