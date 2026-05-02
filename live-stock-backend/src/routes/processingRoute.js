import express from "express";
import {verifyToken} from "../middleware/auth.js";
import {isManager} from "../middleware/isManager.js"
import {createProcessing, deleteProcessingRecord, filterProcessingByDate, getAllprocessRecords, getSingleProcess, updateProcessingRecord} from "../controllers/processingController.js";

const router = express.Router();

router.post("/createProcessing/:slaughterId", verifyToken, createProcessing )
router.get("/getSingleProcess/:id", verifyToken, isManager, getSingleProcess)
router.get("/getAllProcesses", verifyToken, isManager,getAllprocessRecords)
router.put("/updateProcess/:id", verifyToken, isManager, updateProcessingRecord)
router.delete("/deleteProcess/:id", verifyToken, isManager, deleteProcessingRecord)
router.get("/filterByDate", verifyToken, isManager, filterProcessingByDate)

export default router;