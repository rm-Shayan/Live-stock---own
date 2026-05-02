import express from "express";
import { getAllInventories, getInventory, getInventoryByDateRange } from "../controllers/inventoryController.js";
import { isManager } from "../middleware/isManager.js";
import {verifyToken} from "../middleware/auth.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.get("/inventory", verifyToken, isManager, isAdmin, getInventory);
router.get("/inventories", verifyToken, isAdmin, getAllInventories);
router.get("/inventory/date-range", verifyToken, isManager, getInventoryByDateRange);


export default router;