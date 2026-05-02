import express from "express";
import {
  allocationController,
  deleteAllocation,
  getAllAllocations,
  updateAllocationController,
} from "../controllers/allocationController.js";
import { verifyToken } from "../middleware/auth.js";
import { isAdmin } from "../middleware/isAdmin.js";

const routeAllcoaion = express.Router();

// -----------------Allcoaion--------------------------
routeAllcoaion.post(
  "/create-allocation",
  verifyToken,
  isAdmin,
  allocationController,
);
routeAllcoaion.delete(
  "/delete-allocation/:id",
  verifyToken,
  isAdmin,
  deleteAllocation,
);
routeAllcoaion.get(
  "/get-all-allocations",
  verifyToken,
  isAdmin,
  getAllAllocations,
);
routeAllcoaion.put(
  "/update-allocation/:id",
  verifyToken,
  updateAllocationController,
);

export default routeAllcoaion;
