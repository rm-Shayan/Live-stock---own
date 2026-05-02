import express from "express";
// import {verifyToken} from "../middleware/verifyToken.js";
import { verifyToken } from "../middleware/auth.js";
import {isManager} from "../middleware/isManager.js"
import {receivedAnimals} from "../controllers/receiveController.js"
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.post("/receive/:allocationId", verifyToken, isAdmin, receivedAnimals )


export default router;