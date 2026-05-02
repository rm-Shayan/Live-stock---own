import express from "express";
import {verifyToken} from "../middleware/auth.js";
import {isManager} from "../middleware/isManager.js"
import { createSlaughter, deleteSlaughterRecord, getAllSlaughters, getSingleSlaughter, updateSlaughterRecord } from "../controllers/slaughterController.js";

const router = express.Router();
router.post("/createSlaughter", verifyToken , createSlaughter);
router.get("/getSingleSlaughter/:id", verifyToken, getSingleSlaughter);
router.get("/getAllSlaughters", verifyToken, getAllSlaughters);
router.put("/updateSlaughterRecord/:id", verifyToken, updateSlaughterRecord);
router.delete("/deleteSlaughterRecord/:id", verifyToken, isManager, deleteSlaughterRecord);
export default router;